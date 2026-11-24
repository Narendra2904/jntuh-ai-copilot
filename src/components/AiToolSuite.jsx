import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Compass, 
  Copy, 
  Check, 
  RotateCw, 
  Send, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { marked } from "marked";
import { 
  runAcademicStrategist, 
  runWhatIfSimulation, 
  sendDoubtChatMessage, 
  runCareerResumeBlueprint 
} from "../services/geminiApi";

export default function AiToolSuite({ 
  student, 
  activeTab = "strategist", 
  onTabChange, 
  prefilledPrompt = null, 
  onClearPrefilled 
}) {
  // State for each tool
  const [strategistData, setStrategistData] = useState({ content: "", loading: false, cached: false });
  const [simulatorData, setSimulatorData] = useState({ 
    targetCgpa: 8.0, 
    credits: 40, 
    content: "", 
    loading: false, 
    neededSgpa: null, 
    isFeasible: true,
    maxPossibleCgpa: null 
  });
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: `Hello ${student?.name ? student.name.split(" ")[0] : "there"}! 👋 I'm your JNTUH Academic Co-Pilot. I'm already aware of your branch (**${student?.branch || "B.Tech"}**), regulation (**${student?.profile?.regulation || "R22"}**), completed semesters, and active subjects. What would you like to solve or plan today?`
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [careerData, setCareerData] = useState({ content: "", loading: false, cached: false });

  // Copy feedback state
  const [copiedId, setCopiedId] = useState(null);
  const chatBottomRef = useRef(null);

  // Initialize Target CGPA default
  useEffect(() => {
    if (student) {
      const curr = student.overallCgpa;
      let target = curr > 0 ? (Math.ceil(curr * 2) / 2).toFixed(1) : "8.0";
      if (parseFloat(target) <= curr) target = (parseFloat(target) + 0.5).toFixed(1);
      setSimulatorData(prev => ({
        ...prev,
        targetCgpa: parseFloat(target),
        credits: student.remainingCredits || 40
      }));
    }
  }, [student]);

  // Handle prefilled chat prompt (e.g. from Subject matrix "Ask AI")
  useEffect(() => {
    if (prefilledPrompt) {
      onTabChange("chat");
      handleSendChat(prefilledPrompt);
      if (onClearPrefilled) onClearPrefilled();
    }
  }, [prefilledPrompt]);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  // Copy utility
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Run Academic Strategist
  const handleRunStrategist = async (force = false) => {
    setStrategistData(prev => ({ ...prev, loading: true }));
    try {
      const res = await runAcademicStrategist(student, force);
      setStrategistData({ content: res.content, loading: false, cached: res.cached });
    } catch (err) {
      setStrategistData({ content: `**Error:** ${err.message}`, loading: false, cached: false });
    }
  };

  // 2. Run What-If Simulator
  const handleRunSimulator = async (force = false) => {
    setSimulatorData(prev => ({ ...prev, loading: true }));
    try {
      const res = await runWhatIfSimulation(student, simulatorData.targetCgpa, simulatorData.credits, force);
      setSimulatorData(prev => ({
        ...prev,
        content: res.content,
        loading: false,
        neededSgpa: res.neededSgpa,
        isFeasible: res.isFeasible,
        maxPossibleCgpa: res.maxPossibleCgpa
      }));
    } catch (err) {
      setSimulatorData(prev => ({ ...prev, content: `**Error:** ${err.message}`, loading: false }));
    }
  };

  // 3. Send Doubt Chat Message
  const handleSendChat = async (overrideText = null) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const newHistory = [...chatMessages, { role: "user", text: textToSend }];
    setChatMessages(newHistory);
    if (!overrideText) setChatInput("");
    setChatLoading(true);

    try {
      const reply = await sendDoubtChatMessage(student, newHistory, textToSend);
      setChatMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", text: `⚠️ **Error:** ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 4. Run Career & Resume Blueprint
  const handleRunCareer = async (force = false) => {
    setCareerData(prev => ({ ...prev, loading: true }));
    try {
      const res = await runCareerResumeBlueprint(student, force);
      setCareerData({ content: res.content, loading: false, cached: res.cached });
    } catch (err) {
      setCareerData({ content: `**Error:** ${err.message}`, loading: false, cached: false });
    }
  };

  // Quick Chat Suggestion Chips
  const suggestionChips = [
    `How to clear supplies using the 3-unit strategy?`,
    `What are the easiest scoring electives in ${student.branch.split(" ")[0]}?`,
    `Explain the JNTUH 26/75 external passing mark rule.`,
    `Create a 2-week revision schedule for upcoming finals.`
  ];

  return (
    <div className="bento-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      
      {/* Tool Navigation Bar */}
      <div className="border-b border-white/10 bg-bento-card/90 px-4 sm:px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => onTabChange("strategist")}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "strategist"
                ? "border-gold-500 text-gold-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Academic Strategist</span>
          </button>

          <button
            onClick={() => onTabChange("simulator")}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "simulator"
                ? "border-gold-500 text-gold-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "chat"
                ? "border-gold-500 text-gold-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Doubt-Solver Chat</span>
          </button>

          <button
            onClick={() => onTabChange("career")}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "career"
                ? "border-gold-500 text-gold-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Blueprint</span>
          </button>

        </div>

        <div className="hidden sm:flex items-center gap-2 pb-2 text-[10px] font-mono text-zinc-500">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Tool Content Panels */}
      <div className="p-5 sm:p-7 min-h-[420px]">
        
        {/* PANEL 1: ACADEMIC STRATEGIST */}
        {activeTab === "strategist" && (
          <div className="space-y-6 animate-reveal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bento-elevated/80 p-4 rounded-2xl border border-white/5">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gold-400" />
                  GPA Strength, Bottlenecks & Recovery Blueprint
                </h4>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Pinpoints high-credit leverage subjects and generates an actionable university exam recovery roadmap.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunStrategist(false)}
                  disabled={strategistData.loading}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase px-4 py-2 rounded-xl transition-all shadow-gold-glow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{strategistData.loading ? "Analyzing..." : strategistData.content ? "Re-Run Strategy" : "Generate Strategy"}</span>
                </button>
              </div>
            </div>

            {/* Content Output */}
            {strategistData.loading && <SkeletonLoader title="Synthesizing academic transcript & calculating bottleneck ratios..." />}

            {!strategistData.loading && strategistData.content && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                      {strategistData.cached ? "⚡ Instant Cache" : "✨ Fresh Gemini Analysis"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(strategistData.content, "strategist")}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    {copiedId === "strategist" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "strategist" ? "Copied Plan" : "Copy Study Plan"}</span>
                  </button>
                </div>

                <div 
                  className="markdown-content bg-obsidian/60 p-5 rounded-2xl border border-white/5"
                  dangerouslySetInnerHTML={{ __html: marked.parse(strategistData.content) }}
                />
              </div>
            )}

            {!strategistData.loading && !strategistData.content && (
              <div className="py-16 text-center text-zinc-500 text-xs space-y-3">
                <Brain className="w-10 h-10 text-zinc-700 mx-auto" />
                <p>Click "Generate Strategy" above to run an AI-powered diagnostic on your transcript.</p>
              </div>
            )}
          </div>
        )}

        {/* PANEL 2: WHAT-IF CGPA SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="space-y-6 animate-reveal">
            
            {/* Interactive Sliders Header */}
            <div className="bg-bento-elevated/80 p-5 rounded-2xl border border-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-gold-400" />
                    Interactive "What-If" CGPA Simulator
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Adjust target CGPA and upcoming semester credits to calculate your mathematical milestone roadmap.
                  </p>
                </div>

                <button
                  onClick={() => handleRunSimulator(true)}
                  disabled={simulatorData.loading}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase px-4 py-2 rounded-xl transition-all shadow-gold-glow flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{simulatorData.loading ? "Calculating..." : "Simulate Pathway"}</span>
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Target CGPA Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">Target CGPA Goal:</span>
                    <span className="font-mono text-base font-black text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-lg">
                      {simulatorData.targetCgpa.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.05"
                    value={simulatorData.targetCgpa}
                    onChange={(e) => setSimulatorData(prev => ({ ...prev, targetCgpa: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>5.0</span>
                    <span>Current: {student.cgpaString}</span>
                    <span>10.0</span>
                  </div>
                </div>

                {/* Upcoming Credits Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">Upcoming Credits Evaluated:</span>
                    <span className="font-mono text-base font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-lg">
                      {simulatorData.credits} Credits
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max={student.totalCreditsRequired}
                    step="1"
                    value={simulatorData.credits}
                    onChange={(e) => setSimulatorData(prev => ({ ...prev, credits: parseInt(e.target.value, 10) }))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>15 Cr</span>
                    <span>Remaining Degree: {student.remainingCredits} Cr</span>
                    <span>{student.totalCreditsRequired} Cr</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Math Summary Bar */}
            {(() => {
              const currentTotalPoints = student.overallCgpa * student.earnedCredits;
              const finalTotalCredits = student.earnedCredits + simulatorData.credits;
              const targetTotalPoints = simulatorData.targetCgpa * finalTotalCredits;
              const neededPoints = targetTotalPoints - currentTotalPoints;
              const neededSgpa = simulatorData.credits > 0 ? (neededPoints / simulatorData.credits).toFixed(2) : "0.00";
              const isFeasible = parseFloat(neededSgpa) <= 10.0;
              const maxAchievable = ((currentTotalPoints + (10 * simulatorData.credits)) / finalTotalCredits).toFixed(2);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Required Average SGPA</span>
                    <div className="text-2xl font-black font-mono mt-1 text-white">
                      {neededSgpa} <span className="text-xs font-normal text-zinc-500">/ 10</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Feasibility Verdict</span>
                    <div className={`text-sm font-extrabold flex items-center gap-1.5 mt-1 ${isFeasible ? "text-emerald-400" : "text-rose-400"}`}>
                      {isFeasible ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      <span>{isFeasible ? "Mathematically Possible" : "Ceiling Exceeded"}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Max Possible CGPA</span>
                    <div className="text-2xl font-black font-mono mt-1 text-gold-400">
                      {maxAchievable}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* AI Simulation Report Output */}
            {simulatorData.loading && <SkeletonLoader title="Computing semester credit distributions & grade point allocations..." />}

            {!simulatorData.loading && simulatorData.content && (
              <div 
                className="markdown-content bg-obsidian/60 p-5 rounded-2xl border border-white/5"
                dangerouslySetInnerHTML={{ __html: marked.parse(simulatorData.content) }}
              />
            )}
          </div>
        )}

        {/* PANEL 3: DOUBT-SOLVER CHAT */}
        {activeTab === "chat" && (
          <div className="space-y-4 animate-reveal flex flex-col h-[520px]">
            
            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold-500 text-black font-medium"
                        : "bg-bento-elevated border border-white/10 text-zinc-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div 
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                      />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-bento-elevated border border-white/10 rounded-2xl p-3 flex items-center space-x-2 text-xs text-zinc-400">
                    <div className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                    <span>Co-Pilot is researching syllabus & exam trends...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  disabled={chatLoading}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-[11px] text-zinc-400 hover:text-white transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              className="flex items-center gap-2 pt-2 border-t border-white/5"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about JNTUH syllabus, supplies, or preparation strategy..."
                className="flex-1 bg-bento-elevated border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500/50"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="bg-gold-500 hover:bg-gold-400 text-black p-2.5 rounded-xl transition-all shadow-gold-glow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* PANEL 4: CAREER & RESUME BLUEPRINT */}
        {activeTab === "career" && (
          <div className="space-y-6 animate-reveal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bento-elevated/80 p-4 rounded-2xl border border-white/5">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  Tech Role Matching, Projects & Resume Bullet Points
                </h4>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Translates high scores in core subjects into resume-ready projects and high-paying tech placements.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunCareer(false)}
                  disabled={careerData.loading}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase px-4 py-2 rounded-xl transition-all shadow-gold-glow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{careerData.loading ? "Analyzing..." : careerData.content ? "Re-Generate" : "Build Blueprint"}</span>
                </button>
              </div>
            </div>

            {/* Content Output */}
            {careerData.loading && <SkeletonLoader title="Aligning academic transcript with tech job profiles & recruiter standards..." />}

            {!careerData.loading && careerData.content && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {careerData.cached ? "⚡ Instant Cache" : "✨ Fresh Gemini Career Match"}
                  </span>
                  <button
                    onClick={() => handleCopy(careerData.content, "career")}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    {copiedId === "career" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "career" ? "Copied" : "Copy Resume Blueprint"}</span>
                  </button>
                </div>

                <div 
                  className="markdown-content bg-obsidian/60 p-5 rounded-2xl border border-white/5"
                  dangerouslySetInnerHTML={{ __html: marked.parse(careerData.content) }}
                />
              </div>
            )}

            {!careerData.loading && !careerData.content && (
              <div className="py-16 text-center text-zinc-500 text-xs space-y-3">
                <Compass className="w-10 h-10 text-zinc-700 mx-auto" />
                <p>Click "Build Blueprint" to discover tech careers tailored to your strongest academic subjects.</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}

function SkeletonLoader({ title }) {
  return (
    <div className="p-6 rounded-2xl bg-obsidian/40 border border-white/5 space-y-4 animate-pulse">
      <div className="flex items-center gap-2 text-xs text-gold-400 font-mono">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>{title}</span>
      </div>
      <div className="space-y-2.5">
        <div className="h-3.5 bg-zinc-800 rounded w-4/5" />
        <div className="h-3.5 bg-zinc-800/70 rounded w-11/12" />
        <div className="h-3.5 bg-zinc-800/50 rounded w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="h-20 bg-zinc-800/40 rounded-xl" />
        <div className="h-20 bg-zinc-800/40 rounded-xl" />
      </div>
    </div>
  );
}
