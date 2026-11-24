# ⚡ JNTUH AI Academic & Career Co-Pilot

<p align="center">
  <strong>An AI-First Bento Command Center for JNTUH B.Tech students powered by Google Gemini 2.5 Flash & React + Vite.</strong>
</p>

<p align="center">
  <a href="https://github.com/Narendra2904/jntuh-ai-copilot"><img src="https://img.shields.io/badge/GitHub-Narendra2904%2Fjntuh--ai--copilot-gold?style=for-the-badge&logo=github" alt="GitHub Repo" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini 2.5 Flash" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Theme-Obsidian%20Bento-09090B?style=for-the-badge" alt="Theme" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Overview

**JNTUH AI Co-Pilot** is an entirely original, modern web application designed from the ground up for JNTUH B.Tech undergraduates across Telangana and Andhra Pradesh.

Unlike traditional examination grade sheet viewers, JNTUH AI Co-Pilot combines **real-time university marks scraping** (via [jntuh-backend](https://github.com/Narendra2904/jntuh-backend)) with **Google Gemini 2.5 Flash** to provide personalized academic diagnosis, milestone simulation, backlog recovery planning, and career alignment inside an **Obsidian AI Bento Command Center**.

---

## 🚀 Key Features

### 1. 🍱 AI-First Bento Command Center
- **Obsidian Dark Aesthetic:** Deep `#09090B` background, `#18181B` translucent glassmorphic cards (`backdrop-blur-xl`), crisp `1px` borders, and high-contrast `#FACC15` electric gold accents.
- **Top Bento Metrics:**
  - 🎓 **CGPA Radial Progress Gauge:** Real-time animated circular progress ring showing cumulative CGPA and university honors tier.
  - 🏆 **Total Credits Progress Bar:** Earned credits vs. degree requirement (160 for Regular, 120 for Lateral Entry).
  - 🛡️ **Active Backlogs Pill:** Instant count of uncleared supplies with celebratory confetti trigger if 0 backlogs.
  - 📈 **SGPA Sparkline / Area Chart:** Responsive visual trend mapping SGPA trajectory across semesters.
- **Interactive Subject Matrix:** Filterable semester tabs, search box, color-coded grade badges (`O`, `A+`, `A`, `B+`, `B`, `C`, `F`), and one-click **"⚡ Ask AI"** buttons on every subject card.

---

### 2. 🤖 Multi-Tool AI Co-Pilot Suite (Gemini 2.5 Flash)
Four dedicated interactive AI panels designed specifically for JNTUH engineering curriculum:

1. **🧠 Academic Strategist:**
   - Detects GPA mastery areas and mathematically pinpoints high-credit bottleneck subjects dragging the CGPA down.
   - Provides a week-by-week backlog recovery roadmap utilizing the **3-Unit Syllabus Mastery approach**, JNTUH 26/75 rule, and step-marking techniques.
2. **🎛️ Interactive "What-If" CGPA Simulator:**
   - Sliders for desired Target CGPA (`5.0` to `10.0`) and upcoming credits.
   - Live mathematical solver computes the exact required SGPA and evaluates mathematical feasibility.
   - Recommends grade distributions (e.g. 3 'O', 2 'A+') and high-yield elective strategies.
3. **💬 Contextual Doubt-Solver Chat:**
   - Built-in chat assistant aware of the student's branch, regulation (**R18/R22**), semesters, and active backlogs.
   - One-click prompt chips for syllabus explanations, previous-year question strategies, and exam timetables.
4. **🚀 Career & Resume Blueprint:**
   - Analyzes highest-grade subjects to recommend 3 matching tech roles.
   - Generates 2 resume-ready project blueprints and 4 ATS-friendly bullet points in the "Accomplished [X] with [Y] resulting in [Z]" format.

---

### 3. ⚡ LocalStorage Caching & Free Key Integration
- **Instant Reloads:** AI responses are cached locally by a deterministic hash of `hall_ticket + tool_id + params`, loading repeated queries in `< 5ms` with zero API quota burn.
- **Google AI Studio Key Drawer:** Automatically reads from `VITE_GEMINI_API_KEY` or allows students to paste their free key from [Google AI Studio](https://aistudio.google.com/apikey) directly in the browser settings drawer.
- **One-Click Demo Student:** Instant preview mode loading a realistic 5-semester JNTUH student record (`22071A0501`) without typing a hall ticket.

---

### 4. 📄 Printable Study & Score Report
- Export a clean, formatted academic transcript with student metadata, curriculum grades, and AI mentor recommendations ready for **PDF download or print**.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 3.4 (Obsidian Bento Dark Theme)
- **Icons:** Lucide React
- **Celebration Animations:** Canvas-Confetti
- **Markdown Engine:** Marked.js
- **AI Model:** Google Gemini 2.5 Flash REST API
- **Data Source:** [JNTUH Scraper Backend](https://github.com/Narendra2904/jntuh-backend) (Render FastAPI + Redis)

---

## 💻 Quickstart & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Clone the Repository
```bash
git clone https://github.com/Narendra2904/jntuh-ai-copilot.git
cd jntuh-ai-copilot
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example`:
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_JNTUH_API_URL=https://jntuh-backend-7rad.onrender.com
```
*(You can also skip editing `.env` and simply paste your key inside the app's settings drawer!)*

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 6. Build for Production
```bash
npm run build
```

---

## 📁 Repository Structure

```
jntuh-ai-copilot/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Top bar with health ping & settings drawer
│   │   ├── LandingHero.jsx        # AI Command Bar & Demo trigger
│   │   ├── BentoWorkspace.jsx     # Top Bento metrics & Subject matrix
│   │   ├── AiToolSuite.jsx        # 4-in-1 Gemini AI tool panels & chat
│   │   ├── SettingsModal.jsx      # Google AI Studio key manager
│   │   ├── SubjectModal.jsx       # 1-click syllabus & exam brief
│   │   └── ExportReportModal.jsx  # Printable Score & Study report
│   ├── services/
│   │   ├── jntuhApi.js            # Scraper client & R18/R22/5A engine
│   │   └── geminiApi.js           # Gemini 2.5 Flash REST client & cache
│   ├── App.jsx                    # Root app state & routing
│   ├── main.jsx                   # React 19 entry point
│   └── index.css                  # Tailwind styles & obsidian glassmorphism
├── tailwind.config.js             # Bento obsidian color tokens
├── postcss.config.js              # PostCSS plugins
├── vite.config.js                 # Vite bundler configuration
├── .env.example                   # Environment template
├── package.json                   # Dependencies and scripts
└── README.md                      # Documentation
```

---

## 👨‍💻 Author

**Narendra Yenagandula**  
*Final-Year B.Tech Student (CSE AI & ML) & Full-Stack Developer*  
- **GitHub:** [@Narendra2904](https://github.com/Narendra2904)
- **LinkedIn:** [Narendra Yenagandula](https://www.linkedin.com/in/narendra-yenagandula/)

---

## ⭐ Support & Feedback

If you find this AI Academic Co-Pilot helpful:
- Give this repository a ⭐ on GitHub!
- Share it with your classmates and batch groups.
