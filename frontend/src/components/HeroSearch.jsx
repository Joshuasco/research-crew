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
    <div className="max-w-4xl mx-auto my-auto py-8 md:py-14 flex flex-col items-center text-center">
      {/* Brand Logo in clean container */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] p-3 mb-5 card-shadow flex items-center justify-center">
        <img
          src="/neo-rc-logo.png"
          alt="The Research Crew Logo"
          className="w-full h-full object-contain select-none"
        />
      </div>

      {/* Top Overline Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#9CA3AF] text-xs font-mono mb-4 card-shadow">
        <span className="w-2 h-2 rounded-full bg-[#176B4D] dark:bg-[#34D399]" />
        <span className="font-semibold text-[#17211D] dark:text-white">Autonomous Multi-Agent Intelligence</span>
        <span className="text-[#4E5C55] dark:text-[#9CA3AF]">•</span>
        <span>Zero Phantom Claims</span>
      </div>

      {/* Main Title & Editorial Subtitle */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#17211D] dark:text-white font-sans uppercase mb-2 leading-none">
        The Research Crew
      </h1>
      <p className="text-base md:text-xl text-[#38463F] dark:text-[#9CA3AF] font-sans tracking-wide max-w-2xl mb-8 leading-relaxed font-normal">
        Autonomous research. Verified intelligence.
      </p>

      {/* Prominent Research Input Box */}
      <div className="w-full max-w-3xl bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-2xl p-4 md:p-5 card-shadow mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-[#4E5C55] dark:text-[#9CA3AF] shrink-0 pointer-events-none" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to investigate?"
              disabled={isStreaming}
              className="w-full bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl py-3 pl-11 pr-4 text-sm md:text-base text-[#17211D] dark:text-white placeholder-[#4E5C55] focus:outline-none focus:border-[#176B4D] dark:focus:border-[#34D399] focus:ring-1 focus:ring-[#176B4D] dark:focus:ring-[#34D399] transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#176B4D] hover:bg-[#12563D] text-white font-sans text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
              title="Execute live research pipeline"
            >
              <span>Start Research</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onRunDemo(input.trim())}
              disabled={isStreaming}
              className="px-4 py-3 rounded-xl bg-[#17211D] hover:bg-black text-white dark:bg-white dark:text-[#17211D] dark:hover:bg-neutral-200 font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              title="Run fast presentation walkthrough simulating all 3 agents"
            >
              <Zap className="w-3.5 h-3.5 text-[#34D399] dark:text-[#176B4D]" />
              <span>Demo Flow</span>
            </button>
          </div>
        </form>

        {/* Example Chips */}
        <div className="mt-4 pt-3.5 border-t border-[#CBD5CF] dark:border-[#292D33] text-left">
          <div className="text-xs font-sans font-medium uppercase tracking-wider text-[#38463F] dark:text-[#9CA3AF] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />
            <span>Example Investigation Queries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(topic)}
                disabled={isStreaming}
                className="text-xs font-sans font-medium px-3 py-1.5 rounded-lg bg-[#EEF1EF] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#D1D5DB] hover:text-[#17211D] dark:hover:text-white hover:border-[#176B4D] dark:hover:border-[#34D399] transition-all cursor-pointer text-left"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-3xl mb-6 p-4 rounded-xl bg-white dark:bg-[#181A1D] border border-[#17211D] dark:border-[#9CA3AF] text-[#17211D] dark:text-[#F3F4F6] text-xs font-sans text-left flex items-center justify-between gap-3 card-shadow">
          <span>{error}</span>
          <button
            onClick={() => onRunDemo(input)}
            className="px-3 py-1.5 rounded-lg bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] font-semibold text-xs whitespace-nowrap cursor-pointer"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* 3-Agent Workflow Blueprint Preview */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-xl bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
                01 RESEARCHER
              </span>
              <Search className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF]" />
            </div>
            <ul className="text-xs text-[#38463F] dark:text-[#9CA3AF] font-sans space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Searching sources
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Extracting evidence
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Identifying metrics
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono font-medium text-[#4E5C55] dark:text-[#9CA3AF] mt-2 border-t border-[#CBD5CF] dark:border-[#292D33] pt-2">
            OpenRouter Fast Extract
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
                02 WRITER
              </span>
              <BookOpen className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF]" />
            </div>
            <ul className="text-xs text-[#38463F] dark:text-[#9CA3AF] font-sans space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Synthesizing findings
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Building executive briefing
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono font-medium text-[#4E5C55] dark:text-[#9CA3AF] mt-2 border-t border-[#CBD5CF] dark:border-[#292D33] pt-2">
            Contract-Bound Synthesis
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#176B4D] dark:text-[#34D399]">
                03 REVIEWER
              </span>
              <Shield className="w-4 h-4 text-[#176B4D] dark:text-[#34D399]" />
            </div>
            <ul className="text-xs text-[#38463F] dark:text-[#9CA3AF] font-sans space-y-1.5 mb-2">
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Cross-checking claims
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Validating citations
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#176B4D] dark:text-[#34D399] font-mono">●</span> Running audit
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] mt-2 border-t border-[#CBD5CF] dark:border-[#292D33] pt-2 font-semibold">
            Deterministic Quality Gate
          </div>
        </div>
      </div>
    </div>
  );
}
