import React from 'react';
import { ShieldCheck, Zap, RotateCcw, Cpu } from 'lucide-react';

export function Header({ isStreaming, isDemoMode, onLoadDemo, onReset }) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950 text-white px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-white text-black flex items-center justify-center font-bold font-mono text-xl shadow-md">
          RC
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-extrabold tracking-wider uppercase">
              The Research Crew
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-neutral-400" />
              OpenRouter Free Tier
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                ⚡ Demo Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            Autonomous Multi-Agent Pipeline &bull; Deterministic Audit Loops &bull; Instant Client-Side Export
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onLoadDemo}
          disabled={isStreaming}
          className="px-3.5 py-1.5 text-xs font-mono rounded border border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Load cached offline sample briefing instantly for presentation continuity"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          ⚡ Load Demo Briefing
        </button>

        <button
          onClick={onReset}
          className="px-3.5 py-1.5 text-xs font-mono rounded border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Reset crew state and start new query"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </header>
  );
}
