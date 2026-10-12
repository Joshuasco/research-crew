import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const SAMPLE_TOPICS = [
  "Autonomous AI Agent Enterprise Workflows 2026",
  "Solid-State Battery Commercialization & EV Supply Chains",
  "Post-Quantum Cryptography & NIST Standard Enforcement",
  "Commercial Fusion Energy Reactor Benchmarks & Timeline"
];

export function BriefingForm({ onSubmit, isStreaming, error }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSubmit(input.trim());
  };

  const handleSampleClick = (sample) => {
    setInput(sample);
    if (!isStreaming) {
      onSubmit(sample);
    }
  };

  return (
    <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-5 mb-6 card-shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-sans font-medium text-[#38463F] dark:text-[#9CA3AF] uppercase tracking-wider mb-2">
            Investigate Another Research Topic
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Autonomous AI Agent Enterprise Adoption in 2026..."
              disabled={isStreaming}
              className="w-full bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl py-2.5 pl-10 pr-32 text-sm text-[#17211D] dark:text-white placeholder-[#4E5C55] focus:outline-none focus:border-[#176B4D] dark:focus:border-[#34D399] focus:ring-1 focus:ring-[#176B4D] dark:focus:ring-[#34D399] transition-all font-sans font-normal"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-1.5 px-4 py-1.5 bg-[#176B4D] hover:bg-[#12563D] disabled:opacity-40 text-white font-sans text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isStreaming ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <span>Start Crew</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample Topics Quick Select */}
        <div>
          <div className="text-xs font-sans font-medium text-[#38463F] dark:text-[#9CA3AF] mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#176B4D] dark:text-[#34D399]" />
            <span>Quick Sample Topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={isStreaming}
                className="text-xs font-sans font-medium px-2.5 py-1 rounded-lg bg-[#EEF1EF] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#D1D5DB] hover:text-[#17211D] dark:hover:text-white hover:border-[#176B4D] dark:hover:border-[#34D399] transition-colors cursor-pointer"
              >
                + {sample}
              </button>
            ))}
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#17211D] dark:border-[#9CA3AF] text-[#17211D] dark:text-[#F3F4F6] text-xs font-sans flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Streaming Warning: </span>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
