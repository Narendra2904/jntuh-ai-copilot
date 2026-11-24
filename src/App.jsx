import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import BentoWorkspace from "./components/BentoWorkspace";
import AiToolSuite from "./components/AiToolSuite";
import SettingsModal from "./components/SettingsModal";
import SubjectModal from "./components/SubjectModal";
import ExportReportModal from "./components/ExportReportModal";
import { fetchJntuhResults, getDemoStudent } from "./services/jntuhApi";
import { Sparkles, ArrowLeft, RotateCcw } from "lucide-react";

export default function App() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeAiTab, setActiveAiTab] = useState("strategist");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [prefilledChatPrompt, setPrefilledChatPrompt] = useState(null);

  // Handle Search for Hall Ticket
  const handleSearch = async (hallTicket) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchJntuhResults(hallTicket);
      setStudent(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to fetch student results.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Demo Mode
  const handleLoadDemo = () => {
    setErrorMsg("");
    const demo = getDemoStudent();
    setStudent(demo);
  };

  // Reset to landing search
  const handleReset = () => {
    setStudent(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col selection:bg-gold-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar 
        student={student}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {!student ? (
          /* Landing Screen with AI Command Bar */
          <LandingHero 
            onSearch={handleSearch}
            onLoadDemo={handleLoadDemo}
            isLoading={isLoading}
            errorMsg={errorMsg}
          />
        ) : (
          /* Multi-Tab Bento Workspace & AI Suite */
          <div className="space-y-8 animate-reveal">
            
            {/* Back Button Bar */}
            <div className="flex items-center justify-between no-print">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bento-elevated hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 text-xs font-bold transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Search New Hall Ticket</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                  Viewing {student.hallTicket}
                </span>
                <button
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1 text-[11px] text-gold-400/80 hover:text-gold-400 transition-colors font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reload Demo Data</span>
                </button>
              </div>
            </div>

            {/* Top Bento Metrics & Interactive Subject Matrix */}
            <BentoWorkspace 
              student={student}
              onSelectSubject={(sub) => setSelectedSubject(sub)}
              onSwitchTab={(tab) => {
                setActiveAiTab(tab);
                const el = document.getElementById("ai-tool-suite-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />

            {/* Multi-Tool AI Co-Pilot Suite (Anchor for quick scrolling) */}
            <div id="ai-tool-suite-anchor" className="pt-4">
              <AiToolSuite 
                student={student}
                activeTab={activeAiTab}
                onTabChange={(tab) => setActiveAiTab(tab)}
                prefilledPrompt={prefilledChatPrompt}
                onClearPrefilled={() => setPrefilledChatPrompt(null)}
              />
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-bento-border bg-obsidian/90 py-6 text-center text-xs text-zinc-500 font-mono no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} JNTUH AI Co-Pilot • Built by Narendra Yenagandula</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <a 
              href="https://github.com/Narendra2904/jntuh-ai-copilot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-gold-400 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a 
              href="https://aistudio.google.com/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-gold-400 transition-colors"
            >
              Google AI Studio
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={(hasKey) => {}}
      />

      <SubjectModal 
        isOpen={Boolean(selectedSubject)}
        subject={selectedSubject}
        student={student}
        onClose={() => setSelectedSubject(null)}
        onSendToChat={(prompt) => {
          setActiveAiTab("chat");
          setPrefilledChatPrompt(prompt);
          const el = document.getElementById("ai-tool-suite-anchor");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <ExportReportModal 
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        student={student}
      />

    </div>
  );
}
