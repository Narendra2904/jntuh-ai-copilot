import React, { useState, useEffect } from "react";
import { Sparkles, Key, CheckCircle2, AlertCircle, RefreshCw, Printer, BookOpen, ExternalLink } from "lucide-react";
import { checkBackendHealth } from "../services/jntuhApi";
import { getActiveApiKey } from "../services/geminiApi";

export default function Navbar({ student, onOpenSettings, onOpenPrint }) {
  const [backendOnline, setBackendOnline] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check backend health
    checkBackendHealth().then((isOk) => setBackendOnline(isOk));
    // Check API Key
    setHasApiKey(Boolean(getActiveApiKey()));
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-bento-border bg-obsidian/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => window.location.reload()} 
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 shadow-gold-glow transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-obsidian rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-500 animate-pulse-subtle" />
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="bg-gold-500 text-black text-xs font-black px-2 py-0.5 rounded font-mono tracking-wider shadow-sm">
              JNTUH
            </span>
            <span className="text-white font-extrabold text-base sm:text-lg tracking-tight group-hover:text-gold-400 transition-colors flex items-center gap-1.5">
              AI CO-PILOT
              <span className="text-[9px] font-mono font-bold bg-zinc-800 text-gold-400 border border-gold-500/30 px-1.5 py-0.2 rounded-full uppercase tracking-wider hidden sm:inline-block">
                2.5 Flash
              </span>
            </span>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Backend Status Badge */}
          <div 
            title={backendOnline === true ? "JNTUH Scraper Backend is Online" : backendOnline === false ? "Backend waking up / slow" : "Checking connection..."}
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-all ${
              backendOnline === true
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : backendOnline === false
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-zinc-800/80 text-zinc-400 border-zinc-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline === true ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
            <span>{backendOnline === true ? "SCRAPER: ONLINE" : backendOnline === false ? "SCRAPER: CONNECTING" : "PINGING..."}</span>
          </div>

          {/* Export / Print Button (if results loaded) */}
          {student && (
            <button
              onClick={onOpenPrint}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-gold-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm"
              title="Download & Print AI Score Report"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

          {/* API Key Drawer Button */}
          <button
            onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 border ${
              hasApiKey
                ? "bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border-gold-500/30 shadow-sm"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800"
            }`}
            title="Configure your Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">{hasApiKey ? "API Key Active" : "Set Free Key"}</span>
            <span className="sm:hidden">Key</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
