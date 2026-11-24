import React, { useState } from "react";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, BookOpen, Layers, AlertCircle, Compass } from "lucide-react";

export default function LandingHero({ onSearch, onLoadDemo, isLoading, errorMsg }) {
  const [hallTicket, setHallTicket] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hallTicket.trim()) return;
    onSearch(hallTicket.trim());
  };

  return (
    <div className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider mb-6 animate-reveal">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Autonomous Academic & Career Intelligence</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
        Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-300 to-amber-500">JNTUH AI Co-Pilot</span>
      </h1>

      <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
        Instant results analytics, intelligent target CGPA calculations, backlog clearance blueprints, and tailored tech career pathways powered by <span className="text-zinc-200 font-semibold">Gemini 2.5 Flash</span>.
      </p>

      {/* AI Command Input Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl bg-bento-card border border-white/10 group-hover:border-gold-500/40 shadow-2xl backdrop-blur-2xl transition-all duration-300">
            
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-gold-400 transition-colors" />
              <input
                type="text"
                value={hallTicket}
                onChange={(e) => setHallTicket(e.target.value.toUpperCase())}
                placeholder="ENTER HALL TICKET (e.g. 22071A0501)"
                maxLength={10}
                className="w-full bg-transparent border-none text-white placeholder-zinc-600 font-mono font-bold text-sm sm:text-base px-3 py-3 focus:outline-none tracking-widest uppercase"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !hallTicket.trim()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-gold-glow shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Decrypting...</span>
                </>
              ) : (
                <>
                  <span>Launch Co-Pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </form>

        {/* Demo Mode Button */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
          <span>Don't have your hall ticket handy?</span>
          <button
            type="button"
            onClick={onLoadDemo}
            className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Preview with Demo Student (22071A0501)</span>
          </button>
        </div>
      </div>

      {/* Error / Cold-Start Alert */}
      {errorMsg && (
        <div className="max-w-2xl mx-auto mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-[11px] text-rose-400/80 mt-1">
              Note: The JNTUH backend scraper runs on a free Render tier and may take ~30 seconds to wake up from idle. Click "Preview with Demo Student" above to explore immediately.
            </p>
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-16 max-w-4xl mx-auto text-left">
        <div className="bento-card p-4 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-white text-xs sm:text-sm font-bold mb-1">R18 & R22 Engines</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">Automatic regulation detection and 6-semester Lateral Entry (5A) audit.</p>
        </div>

        <div className="bento-card p-4 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-white text-xs sm:text-sm font-bold mb-1">Supply Clearance</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">Prioritizes uncleared subjects using the proven 3-unit strategy & step marks.</p>
        </div>

        <div className="bento-card p-4 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-white text-xs sm:text-sm font-bold mb-1">What-If Simulator</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">Sliders calculate the exact SGPA needed per semester to achieve target CGPA.</p>
        </div>

        <div className="bento-card p-4 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
            <Compass className="w-4 h-4" />
          </div>
          <h4 className="text-white text-xs sm:text-sm font-bold mb-1">Resume Alignment</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">Generates high-impact resume bullets and projects matching your top grades.</p>
        </div>
      </div>
    </div>
  );
}
