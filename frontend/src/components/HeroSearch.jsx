import React, { useState } from 'react';
import { Search, ArrowRight, Zap, Sparkles, Shield, BookOpen } from 'lucide-react';

const SAMPLE_TOPICS = [
  "Commercial Fusion Energy Reactor Benchmarks & Timeline",
  "Autonomous AI Agent Enterprise Workflows 2026",
  "Solid-State Battery Commercialization & EV Supply Chains",
  "Post-Quantum Cryptography & NIST Standard Enforcement"
];

export function HeroSearch({ onStartResearch, onRunDemo, isStreaming, error }) {
  const [input, setInput] = useState('Commercial Fusion Energy Reactor Benchmarks & Timeline');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onStartResearch(input.trim());
  };

  const handleChipClick = (topic) => {
    setInput(topic);
    onStartResearch(topic);
  };

  return (
    <div className="max-w-4xl mx-auto my-auto py-10 md:py-16 flex flex-col items-center text-center">
      {/* Brand Logo */}
      <img
        src="/neo-rc-logo.png"
        alt="The Research Crew Logo"
        className="w-20 h-20 md:w-24 md:h-24 object-contain mb-5 drop-shadow-[0_0_35px_rgba(16,185,129,0.25)] select-none"
      />

      {/* Top Overline Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-xs font-mono mb-5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-emerald-400">Autonomous Multi-Agent Intelligence</span>
        <span className="text-neutral-600">•</span>
        <span className="text-neutral-400">Zero Phantom Claims</span>
      </div>

      {/* Main Title & Editorial Subtitle */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans uppercase mb-3 leading-none">
        The Research Crew
      </h1>
      <p className="text-lg md:text-2xl text-neutral-400 font-sans tracking-wide max-w-2xl mb-10 leading-relaxed font-light">
        &ldquo;Autonomous research. Verified intelligence.&rdquo;
      </p>

      {/* Prominent Research Input Box */}
      <div className="w-full max-w-3xl bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-3 md:p-4 shadow-2xl backdrop-blur-sm glow-subtle mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-neutral-500 shrink-0 pointer-events-none" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to investigate?"
              disabled={isStreaming}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3.5 pl-12 pr-4 text-sm md:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-40"
              title="Execute live research pipeline"
            >
              Start Research
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onRunDemo(input.trim())}
              disabled={isStreaming}
              className="px-4 py-3.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap glow-emerald-sm"
              title="Run fast presentation walkthrough simulating all 3 agents"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              ⚡ Demo Flow
            </button>
          </div>
        </form>

        {/* Compact Example Chips */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 text-left">
          <div className="text-xs font-sans font-medium uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>Example Investigation Queries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(topic)}
                disabled={isStreaming}
                className="text-xs font-sans font-medium px-3 py-1.5 rounded-md bg-neutral-950/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500/50 hover:bg-neutral-900 transition-all cursor-pointer text-left"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-3xl mb-8 p-3.5 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono text-left flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => onRunDemo(input)}
            className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-bold whitespace-nowrap"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* 3-Agent Workflow Blueprint Preview */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400">
                01 RESEARCHER
              </span>
              <Search className="w-4 h-4 text-teal-500/70" />
            </div>
            <ul className="text-xs text-neutral-400 font-sans font-normal space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5"><span className="text-teal-400 font-mono">●</span> Searching sources</li>
              <li className="flex items-center gap-1.5"><span className="text-teal-400 font-mono">●</span> Extracting evidence</li>
              <li className="flex items-center gap-1.5"><span className="text-teal-400 font-mono">●</span> Identifying metrics</li>
            </ul>
          </div>
          <div className="text-[10px] font-mono font-medium text-neutral-500 mt-2 border-t border-neutral-900 pt-2">
            OpenRouter Fast Extract
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400">
                02 WRITER
              </span>
              <BookOpen className="w-4 h-4 text-indigo-500/70" />
            </div>
            <ul className="text-xs text-neutral-400 font-sans font-normal space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-mono">●</span> Synthesizing findings</li>
              <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-mono">●</span> Building executive briefing</li>
            </ul>
          </div>
          <div className="text-[10px] font-mono font-medium text-neutral-500 mt-2 border-t border-neutral-900 pt-2">
            Contract-Bound Synthesis
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                03 REVIEWER
              </span>
              <Shield className="w-4 h-4 text-emerald-500/70" />
            </div>
            <ul className="text-xs text-neutral-400 font-sans font-normal space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">●</span> Cross-checking claims</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">●</span> Validating citations</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">●</span> Running audit</li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-emerald-500/80 mt-2 border-t border-neutral-900 pt-2 font-semibold">
            Deterministic Quality Gate
          </div>
        </div>
      </div>
    </div>
  );
}
