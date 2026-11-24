import React, { useState } from "react";
import { Key, X, Eye, EyeOff, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { getActiveApiKey, saveApiKey } from "../services/geminiApi";

export default function SettingsModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState(getActiveApiKey() || "");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(apiKey.trim());
    if (onKeyUpdated) onKeyUpdated(Boolean(apiKey.trim()));
    onClose();
  };

  const handleClear = () => {
    setApiKey("");
    saveApiKey("");
    if (onKeyUpdated) onKeyUpdated(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bento-card border border-gold-500/30 max-w-md w-full p-6 rounded-3xl shadow-2xl relative animate-reveal">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Google Gemini API Key</h3>
            <p className="text-[11px] font-mono text-zinc-400">Powers Gemini 2.5 Flash Co-Pilot</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          The AI Co-Pilot uses Google's latest <strong className="text-zinc-200">gemini-2.5-flash</strong> model. You can generate a 100% free API key directly from Google AI Studio in ~10 seconds:
        </p>

        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold text-xs transition-colors mb-5 cursor-pointer shadow-sm"
        >
          <span>Get Free Key at aistudio.google.com/apikey</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Input */}
        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            Paste Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-bento-elevated border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs font-mono text-gold-400 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Saved securely only in your browser's private localStorage.</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase py-2.5 rounded-xl transition-all shadow-gold-glow cursor-pointer active:scale-95"
          >
            Save & Continue
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Remove Key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
