/**
 * JNTUH Results API Client & Academic Calculator
 * Connects directly to the live scraper backend: https://jntuh-backend-7rad.onrender.com
 */

export const JNTUH_BACKEND_URL = import.meta.env.VITE_JNTUH_API_URL || "https://jntuh-backend-7rad.onrender.com";

export const GRADE_POINTS = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  D: 4,
  P: 4,
  F: 0,
  Ab: 0,
  ABSENT: 0,
  S: 10,
  "-": 0
};

/**
 * Health check on Render backend
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${JNTUH_BACKEND_URL}/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Detect JNTUH Regulation & Lateral Entry
 */
export function getAcademicProfile(hallTicket) {
  const ht = (hallTicket || "").trim().toUpperCase();
  const isLateral = (ht.length >= 6 && ht.substring(4, 6) === "5A") || (ht.length >= 5 && ht.charAt(4) === "5");
  const yearPrefix = parseInt(ht.substring(0, 2), 10);

  let regulation = "R22";
  let totalSemesters = isLateral ? 6 : 8;
  let totalCreditsRequired = isLateral ? 120 : 160;

  if (!isNaN(yearPrefix)) {
    if (isLateral) {
      if (yearPrefix >= 23) regulation = "R22";
      else if (yearPrefix >= 19) regulation = "R18";
      else regulation = "R16";
    } else {
      if (yearPrefix >= 22) regulation = "R22";
      else if (yearPrefix >= 18) regulation = "R18";
      else regulation = "R16";
    }
  }

  return {
    isLateral,
    regulation,
    totalSemesters,
    totalCreditsRequired,
    entryType: isLateral ? "Lateral Entry (6 Semesters: 2-1 to 4-2)" : "Regular Entry (8 Semesters: 1-1 to 4-2)",
  };
}

/**
 * Process raw backend data into structured student model
 */
export function normalizeStudentData(rawData) {
  if (!rawData) return null;

  const profile = getAcademicProfile(rawData.hallTicket);
  const semesters = rawData.semesters || [];

  // Group latest subject attempts across semesters
  const latestSubjectMap = new Map();
  const semesterWiseData = [];

  semesters.forEach((sem) => {
    const semName = sem.semester || "";
    let semCredits = 0;
    let semPoints = 0;
    const subjects = sem.subjects || [];

    subjects.forEach((sub) => {
      const code = (sub.subjectCode || sub.code || "").trim();
      if (!code) return;

      const cr = parseFloat(sub.credits || 0);
      const gp = GRADE_POINTS[sub.grade] ?? 0;
      const isPass = !["F", "Ab", "ABSENT", "-"].includes(sub.grade) && gp > 0;

      semCredits += cr;
      semPoints += gp * cr;

      // Update overall latest map
      const prev = latestSubjectMap.get(code);
      const currAttempt = Number(sub.attemptNumber || 1);
      const prevAttempt = prev ? Number(prev.attemptNumber || 1) : 0;
      const prevGp = prev ? (GRADE_POINTS[prev.grade] ?? 0) : -1;

      if (!prev || currGp > prevGp || currAttempt >= prevAttempt) {
        latestSubjectMap.set(code, {
          ...sub,
          semester: semName,
          creditsNum: cr,
          gradePoint: gp,
          isPass
        });
      }
    });

    const sgpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : "0.00";
    semesterWiseData.push({
      semester: semName,
      sgpa: parseFloat(sgpa),
      credits: semCredits,
      subjects: subjects.map(s => ({
        ...s,
        creditsNum: parseFloat(s.credits || 0),
        gradePoint: GRADE_POINTS[s.grade] ?? 0,
        isPass: !["F", "Ab", "ABSENT", "-"].includes(s.grade)
      }))
    });
  });

  // Calculate cumulative stats from latest unique subjects
  let earnedCredits = 0;
  let totalPoints = 0;
  const backlogs = [];
  const topSubjects = [];
  const bottleneckSubjects = [];

  latestSubjectMap.forEach((sub) => {
    if (sub.isPass) {
      earnedCredits += sub.creditsNum;
      totalPoints += sub.gradePoint * sub.creditsNum;

      if (sub.gradePoint >= 9) {
        topSubjects.push(sub);
      } else if (sub.creditsNum >= 3 && sub.gradePoint <= 6) {
        bottleneckSubjects.push(sub);
      }
    } else {
      backlogs.push(sub);
    }
  });

  const cgpa = earnedCredits > 0 ? (totalPoints / earnedCredits).toFixed(2) : "0.00";
  const completedSemesters = semesterWiseData.length;
  const remainingSemesters = Math.max(0, profile.totalSemesters - completedSemesters);
  const remainingCredits = Math.max(0, profile.totalCreditsRequired - earnedCredits);

  return {
    raw: rawData,
    profile,
    hallTicket: rawData.hallTicket,
    name: rawData.name || "Student",
    fatherName: rawData.fatherName || "—",
    college: rawData.college || "JNTUH Affiliated College",
    collegeCode: rawData.collegeCode || "—",
    branch: rawData.branch || "B.Tech",
    overallCgpa: parseFloat(cgpa),
    cgpaString: cgpa,
    earnedCredits,
    totalCreditsRequired: profile.totalCreditsRequired,
    completedSemesters,
    remainingSemesters,
    remainingCredits,
    backlogs,
    topSubjects,
    bottleneckSubjects,
    semesters: semesterWiseData,
    latestSubjects: Array.from(latestSubjectMap.values())
  };
}

/**
 * Fetch Results from Render Backend
 */
export async function fetchJntuhResults(hallTicket) {
  const ht = (hallTicket || "").trim().toUpperCase();
  if (!ht) throw new Error("Please enter a valid Hall Ticket number.");

  const response = await fetch(`${JNTUH_BACKEND_URL}/result/${ht}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Results for Hall Ticket "${ht}" were not found or have not been declared by JNTUH.`);
    }
    throw new Error(`Server returned error status ${response.status}. The JNTUH scraper may be spinning up or temporarily busy.`);
  }

  const json = await response.json();
  if (!json || !json.data) {
    throw new Error("Invalid response format received from university data scraper.");
  }

  let data = json.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data.replace(/'/g, '"'));
    } catch (e) {
      throw new Error("Unable to parse university marksheet payload.");
    }
  }

  return normalizeStudentData(data);
}

/**
 * Curated Demo Student (Realistic 5-Semester JNTUH B.Tech Student)
 */
export const DEMO_STUDENT_RAW = {
  hallTicket: "22071A0501",
  name: "YENAGANDULA NARENDRA",
  fatherName: "YENAGANDULA RAMESH",
  college: "VAAGESWARI COLLEGE OF ENGINEERING",
  collegeCode: "S4",
  branch: "COMPUTER SCIENCE & ENGINEERING (AI & ML)",
  semesters: [
    {
      semester: "1-1",
      examCode: "1601",
      subjects: [
        { subjectCode: "MA101BS", subjectName: "Matrices and Calculus", internalMarks: "23", externalMarks: "54", totalMarks: "77", grade: "A", credits: 4 },
        { subjectCode: "AP102BS", subjectName: "Applied Physics", internalMarks: "21", externalMarks: "49", totalMarks: "70", grade: "B+", credits: 4 },
        { subjectCode: "CS103ES", subjectName: "Programming for Problem Solving", internalMarks: "25", externalMarks: "65", totalMarks: "90", grade: "O", credits: 4 },
        { subjectCode: "EN104HS", subjectName: "English for Skill Enhancement", internalMarks: "22", externalMarks: "46", totalMarks: "68", grade: "B+", credits: 2 },
        { subjectCode: "CS105ES", subjectName: "Programming for Problem Solving Lab", internalMarks: "24", externalMarks: "70", totalMarks: "94", grade: "O", credits: 1.5 }
      ]
    },
    {
      semester: "1-2",
      examCode: "1602",
      subjects: [
        { subjectCode: "MA201BS", subjectName: "Ordinary Differential Equations & Vector Calculus", internalMarks: "20", externalMarks: "48", totalMarks: "68", grade: "B+", credits: 4 },
        { subjectCode: "CH202BS", subjectName: "Engineering Chemistry", internalMarks: "19", externalMarks: "45", totalMarks: "64", grade: "B", credits: 4 },
        { subjectCode: "CS203ES", subjectName: "Data Structures", internalMarks: "25", externalMarks: "67", totalMarks: "92", grade: "O", credits: 4 },
        { subjectCode: "CS205ES", subjectName: "Data Structures Lab", internalMarks: "24", externalMarks: "71", totalMarks: "95", grade: "O", credits: 1.5 }
      ]
    },
    {
      semester: "2-1",
      examCode: "1701",
      subjects: [
        { subjectCode: "CS301PC", subjectName: "Computer Organization & Architecture", internalMarks: "22", externalMarks: "45", totalMarks: "67", grade: "B+", credits: 4 },
        { subjectCode: "CS302PC", subjectName: "Discrete Mathematics", internalMarks: "23", externalMarks: "58", totalMarks: "81", grade: "A", credits: 3 },
        { subjectCode: "CS303PC", subjectName: "Object Oriented Programming through Java", internalMarks: "25", externalMarks: "66", totalMarks: "91", grade: "A+", credits: 3 },
        { subjectCode: "CS304PC", subjectName: "Database Management Systems", internalMarks: "25", externalMarks: "68", totalMarks: "93", grade: "O", credits: 4 },
        { subjectCode: "CS305PC", subjectName: "Database Management Systems Lab", internalMarks: "24", externalMarks: "72", totalMarks: "96", grade: "O", credits: 1.5 }
      ]
    },
    {
      semester: "2-2",
      examCode: "1702",
      subjects: [
        { subjectCode: "CS401PC", subjectName: "Operating Systems", internalMarks: "22", externalMarks: "60", totalMarks: "82", grade: "A", credits: 3 },
        { subjectCode: "CS402PC", subjectName: "Design & Analysis of Algorithms", internalMarks: "24", externalMarks: "64", totalMarks: "88", grade: "A+", credits: 4 },
        { subjectCode: "CS403PC", subjectName: "Software Engineering", internalMarks: "21", externalMarks: "50", totalMarks: "71", grade: "B+", credits: 3 },
        { subjectCode: "CS404PC", subjectName: "Formal Languages & Automata Theory", internalMarks: "17", externalMarks: "20", totalMarks: "37", grade: "F", credits: 3 }
      ]
    },
    {
      semester: "3-1",
      examCode: "1801",
      subjects: [
        { subjectCode: "AI501PC", subjectName: "Artificial Intelligence", internalMarks: "25", externalMarks: "68", totalMarks: "93", grade: "A+", credits: 4 },
        { subjectCode: "AI502PC", subjectName: "Machine Learning Foundations", internalMarks: "25", externalMarks: "70", totalMarks: "95", grade: "O", credits: 4 },
        { subjectCode: "CS503PC", subjectName: "Computer Networks", internalMarks: "23", externalMarks: "58", totalMarks: "81", grade: "A", credits: 3 },
        { subjectCode: "CS404PC", subjectName: "Formal Languages & Automata Theory", internalMarks: "19", externalMarks: "45", totalMarks: "64", grade: "B", credits: 3, attempt: "supply", attemptNumber: 2 }
      ]
    }
  ]
};

export function getDemoStudent() {
  return normalizeStudentData(DEMO_STUDENT_RAW);
}
