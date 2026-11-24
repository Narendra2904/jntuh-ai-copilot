import React, { useState, useEffect } from "react";
import { X, Sparkles, BookOpen, MessageSquare, Check, Copy } from "lucide-react";
import { marked } from "marked";
import { explainSubject } from "../services/geminiApi";

export default function SubjectModal({ isOpen, onClose, student, subject, onSendToChat }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && subject && student) {
      setLoading(true);
      setExplanation("");
      explainSubject(student, subject)
        .then((res) => {
          setExplanation(res);
          setLoading(false);
        })
        .catch((err) => {
          setExplanation(`**Error:** ${err.message}`);
          setLoading(false);
        });
    }
  }, [isOpen, subject, student]);

  if (!isOpen || !subject) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bento-card border border-gold-500/30 max-w-lg w-full p-6 rounded-3xl shadow-2xl relative animate-reveal">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subject Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {subject.subjectCode}
              </span>
              <span className="font-mono text-xs text-gold-400 font-bold">
                Grade: {subject.grade}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1 leading-snug">
              {subject.subjectName}
            </h3>
          </div>
        </div>

        {/* AI Briefing Content */}
        <div className="my-4 max-h-[360px] overflow-y-auto pr-1">
          {loading && (
            <div className="py-10 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-gold-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">Gemini is curating exam tactics & syllabus breakdown...</p>
            </div>
          )}

          {!loading && explanation && (
            <div 
              className="markdown-content text-xs sm:text-sm bg-obsidian/70 p-4 rounded-2xl border border-white/5"
              dangerouslySetInnerHTML={{ __html: marked.parse(explanation) }}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
          <button
            onClick={() => {
              onClose();
              onSendToChat(`Can you explain the detailed unit-by-unit syllabus and exam preparation strategy for ${subject.subjectCode} - ${subject.subjectName}?`);
            }}
            className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-bold cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask in Doubt Chat &rarr;</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!explanation || loading}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-white/5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
