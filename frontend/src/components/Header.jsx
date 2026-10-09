import React from 'react';
import { ShieldCheck, Zap, RotateCcw, Cpu, Sparkles } from 'lucide-react';

export function Header({ isStreaming, isDemoMode, onRunDemo, onLoadDemo, onReset }) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md text-white px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-50">
      {/* Brand & Mission Tagline */}
      <div className="flex items-center gap-3.5">
        <img
          src="/neo-rc-logo.png"
          alt="The Research Crew Logo"
          className="w-9 h-9 object-contain shrink-0 rounded drop-shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-sans text-sm md:text-base font-bold tracking-tight uppercase text-white">
              The Research Crew
            </h1>
            {isDemoMode && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                ⚡ Demo Mode Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Presentation & Demo Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <button
          onClick={onRunDemo}
          disabled={isStreaming}
          className="px-3 py-1.5 text-xs font-sans font-medium rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer glow-emerald-sm"
          title="Run full 3-agent progression simulation for audience presentations"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          ⚡ Run Interactive Demo
        </button>

        <button
          onClick={onLoadDemo}
          disabled={isStreaming}
          className="px-3 py-1.5 text-xs font-sans font-medium rounded border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Instantly load cached verified briefing without waiting"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          Instant Briefing
        </button>

        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-sans font-medium rounded border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 hover:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Reset to clean initial research prompt"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo
        </button>
      </div>
    </header>
  );
}
