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
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            Research Crew Briefing Prompt
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-neutral-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Autonomous AI Agent Enterprise Adoption in 2026..."
              disabled={isStreaming}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-md py-2.5 pl-10 pr-32 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-1.5 px-4 py-1.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 font-mono text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isStreaming ? (
                <>
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Deploying...
                </>
              ) : (
                <>
                  Start Crew
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample Topics Quick Select */}
        <div>
          <div className="text-xs font-mono text-neutral-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neutral-400" />
            Quick Sample Topics:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={isStreaming}
                className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
              >
                + {sample}
              </button>
            ))}
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Streaming Warning: </span>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
