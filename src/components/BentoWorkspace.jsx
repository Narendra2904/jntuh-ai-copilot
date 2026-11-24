import React, { useState } from "react";
import { 
  Award, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Filter, 
  Layers, 
  ArrowUpRight,
  HelpCircle,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";

export default function BentoWorkspace({ student, onSelectSubject, onSwitchTab }) {
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!student) return null;

  // Filter subjects based on semester and search query
  const displayedSemesters = selectedSemester === "all" 
    ? student.semesters 
    : student.semesters.filter(s => s.semester === selectedSemester);

  const filteredSubjects = [];
  displayedSemesters.forEach(sem => {
    sem.subjects.forEach(sub => {
      const q = searchQuery.toLowerCase();
      const codeMatch = (sub.subjectCode || "").toLowerCase().includes(q);
      const nameMatch = (sub.subjectName || "").toLowerCase().includes(q);
      if (!searchQuery || codeMatch || nameMatch) {
        filteredSubjects.push({ ...sub, semester: sem.semester });
      }
    });
  });

  // Unique semester names for tab pills
  const semesterNames = student.semesters.map(s => s.semester);

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FACC15", "#10B981", "#3B82F6"]
    });
  };

  // Grade color map
  const getGradeStyle = (grade) => {
    switch (grade) {
      case "O":
      case "S":
        return "bg-gold-500/15 text-gold-400 border-gold-500/30";
      case "A+":
      case "A":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "B+":
      case "B":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "C":
      case "D":
      case "P":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "F":
      case "Ab":
      case "ABSENT":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  // SVG Radial Gauge Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const cgpaPercentage = Math.min(100, Math.max(0, (student.overallCgpa / 10) * 100));
  const strokeDashoffset = circumference - (cgpaPercentage / 100) * circumference;

  // SVG Area Chart calculations for SGPA Trend
  const sgpaPoints = student.semesters.map(s => ({ sem: s.semester, sgpa: s.sgpa }));
  const chartHeight = 80;
  const chartWidth = 240;
  const maxSgpa = 10;
  const minSgpa = 4;
  
  let pathD = "";
  let areaD = "";
  if (sgpaPoints.length > 0) {
    const coords = sgpaPoints.map((pt, i) => {
      const x = sgpaPoints.length === 1 ? chartWidth / 2 : (i / (sgpaPoints.length - 1)) * (chartWidth - 20) + 10;
      const normalizedSgpa = Math.max(minSgpa, Math.min(maxSgpa, pt.sgpa));
      const y = chartHeight - ((normalizedSgpa - minSgpa) / (maxSgpa - minSgpa)) * (chartHeight - 20) - 10;
      return { x, y, pt };
    });

    pathD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? "M" : "L"} ${c.x} ${c.y}`, "");
    areaD = `${pathD} L ${coords[coords.length - 1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`;
  }

  return (
    <div className="space-y-6">
      
      {/* Student Banner Header */}
      <div className="bento-card p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2.5 py-0.5 rounded-lg">
                {student.hallTicket}
              </span>
              <span className="text-zinc-400 text-xs font-mono">
                {student.profile.regulation} Regulation
              </span>
              <span className="text-zinc-500 text-xs font-mono">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {student.profile.entryType}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {student.name}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 font-medium">
              {student.branch} • <span className="text-zinc-500">{student.college} ({student.collegeCode})</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => onSwitchTab("strategist")}
              className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-gold-glow flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Strategist</span>
            </button>
            <button
              onClick={() => onSwitchTab("simulator")}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
              <span>What-If Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP BENTO ROW (Key Metrics & Trajectory) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Overall CGPA Radial Progress Card */}
        <div className="bento-card p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Overall CGPA</span>
            <GraduationCap className="w-4 h-4 text-gold-400" />
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                {student.cgpaString}
              </div>
              <p className="text-[11px] text-gold-400 font-semibold mt-1">
                {student.overallCgpa >= 8.0 ? "Distinction Range 🌟" : student.overallCgpa >= 6.75 ? "First Class Division" : "Second Class"}
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-zinc-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-gold-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-extrabold text-zinc-400">
                {Math.round(cgpaPercentage)}%
              </div>
            </div>
          </div>

          <p className="text-zinc-500 text-[11px]">Calculated across {student.earnedCredits} credits passed</p>
        </div>

        {/* 2. Total Credits Earned Progress Card */}
        <div className="bento-card p-5 rounded-3xl flex flex-col justify-between group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Degree Credits</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                {student.earnedCredits}
              </span>
              <span className="text-zinc-500 font-mono text-sm font-bold">
                / {student.totalCreditsRequired}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-gold-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (student.earnedCredits / student.totalCreditsRequired) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>{Math.round((student.earnedCredits / student.totalCreditsRequired) * 100)}% Completed</span>
            <span className="text-zinc-400 font-mono">{student.remainingCredits} Cr remaining</span>
          </div>
        </div>

        {/* 3. Active Backlogs Pill Card */}
        <div className="bento-card p-5 rounded-3xl flex flex-col justify-between group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Supplies</span>
            {student.backlogs.length === 0 ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
          </div>

          <div className="my-2 flex items-center justify-between">
            <div>
              <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                student.backlogs.length === 0 ? "text-emerald-400" : "text-rose-400"
              }`}>
                {student.backlogs.length}
              </div>
              <p className={`text-[11px] font-semibold mt-1 ${
                student.backlogs.length === 0 ? "text-emerald-400" : "text-rose-400"
              }`}>
                {student.backlogs.length === 0 ? "100% Cleared! Zero Backlogs 🎉" : `${student.backlogs.length} Pending Subject(s)`}
              </p>
            </div>

            {student.backlogs.length === 0 ? (
              <button 
                onClick={triggerCelebration}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
                title="Celebrate!"
              >
                🎉 Confetti
              </button>
            ) : (
              <button 
                onClick={() => onSwitchTab("strategist")}
                className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold hover:bg-rose-500/25 transition-all cursor-pointer"
              >
                Clear Plan &rarr;
              </button>
            )}
          </div>

          <p className="text-zinc-500 text-[11px]">
            {student.backlogs.length === 0 ? "Eligible for all Tier-1 campus placements" : "Click to view clearance priority"}
          </p>
        </div>

        {/* 4. Semester SGPA Area/Sparkline Chart Card */}
        <div className="bento-card p-5 rounded-3xl flex flex-col justify-between group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>SGPA Trajectory</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
          </div>

          {/* Sparkline Graphic */}
          <div className="my-1 flex items-center justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-16 overflow-visible">
              <defs>
                <linearGradient id="sgpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {areaD && <path d={areaD} fill="url(#sgpaAreaGrad)" />}
              {pathD && <path d={pathD} fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              {sgpaPoints.map((pt, i) => {
                const x = sgpaPoints.length === 1 ? chartWidth / 2 : (i / (sgpaPoints.length - 1)) * (chartWidth - 20) + 10;
                const normalizedSgpa = Math.max(minSgpa, Math.min(maxSgpa, pt.sgpa));
                const y = chartHeight - ((normalizedSgpa - minSgpa) / (maxSgpa - minSgpa)) * (chartHeight - 20) - 10;
                return (
                  <circle 
                    key={i} 
                    cx={x} 
                    cy={y} 
                    r="3.5" 
                    className="fill-obsidian stroke-gold-400 stroke-2 hover:r-5 transition-all cursor-pointer"
                  >
                    <title>{`${pt.sem}: SGPA ${pt.sgpa}`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>{sgpaPoints[0]?.sem || "1-1"}</span>
            <span className="text-gold-400 font-bold">Latest: {sgpaPoints[sgpaPoints.length - 1]?.sgpa}</span>
            <span>{sgpaPoints[sgpaPoints.length - 1]?.sem || "Current"}</span>
          </div>
        </div>

      </div>

      {/* INTERACTIVE SUBJECT MATRIX */}
      <div className="bento-card p-5 sm:p-6 rounded-3xl border border-white/10">
        
        {/* Matrix Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-400" />
              Interactive Academic Subject Matrix
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Click any subject to receive instant Gemini syllabus prep strategies and core concept breakdowns.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or subject..."
              className="w-full bg-bento-elevated border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        {/* Semester Filter Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
          <button
            onClick={() => setSelectedSemester("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSemester === "all"
                ? "bg-gold-500 text-black shadow-sm"
                : "bg-bento-elevated text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            All Semesters ({student.latestSubjects.length})
          </button>
          {semesterNames.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSemester === sem
                  ? "bg-gold-500 text-black shadow-sm"
                  : "bg-bento-elevated text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        {/* Subjects Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredSubjects.map((sub, idx) => {
            const isPass = sub.isPass;
            return (
              <div 
                key={`${sub.subjectCode}-${idx}`}
                className="p-3.5 rounded-2xl bg-bento-elevated/80 border border-white/5 hover:border-gold-500/30 transition-all flex flex-col justify-between group bento-card-interactive"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {sub.subjectCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${getGradeStyle(sub.grade)}`}>
                      Grade: {sub.grade}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors leading-snug line-clamp-2">
                    {sub.subjectName}
                  </h4>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span>Cr: <strong className="text-zinc-200">{sub.creditsNum}</strong></span>
                    <span>•</span>
                    <span>Tot: <strong className="text-zinc-200">{sub.totalMarks || (Number(sub.internalMarks || 0) + Number(sub.externalMarks || 0))}</strong></span>
                  </div>

                  <button
                    onClick={() => onSelectSubject(sub)}
                    className="inline-flex items-center gap-1 text-[10px] text-gold-400/90 hover:text-gold-300 font-bold transition-colors cursor-pointer group/btn"
                    title="Ask AI for 3-Unit Syllabus & Exam Tips"
                  >
                    <span>Ask AI</span>
                    <Sparkles className="w-2.5 h-2.5 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No subjects found matching "{searchQuery}".
          </div>
        )}

      </div>

    </div>
  );
}
