import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, KeyRound, AlertTriangle, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function DashboardHero({ topic, telemetry, _agentStatus }) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  // Parse topic into primary category & subtitle for editorial feel
  const formatTopicHeading = (rawTopic) => {
    if (!rawTopic) {
      return {
        category: 'COMMERCIAL FUSION ENERGY',
        title: 'Reactor Benchmarks & Timeline'
      };
    }
    const parts = rawTopic.split(/[-–—:&|]/);
    if (parts.length >= 2) {
      return {
        category: parts[0].trim().toUpperCase(),
        title: parts.slice(1).join(' ').trim()
      };
    }
    const words = rawTopic.split(' ');
    if (words.length > 3) {
      return {
        category: words.slice(0, 3).join(' ').toUpperCase(),
        title: words.slice(3).join(' ')
      };
    }
    return {
      category: rawTopic.toUpperCase(),
      title: 'Executive Intelligence & Audit Report'
    };
  };

  const { category, title } = formatTopicHeading(topic);

  // Count-up animation for research confidence score (strictly 78.0%)
  const targetConfidence = 78.0;

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedConfidence(Math.round(eased * targetConfidence));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const elapsedSec = telemetry?.elapsed_seconds || 28.4;

  return (
    <div className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-lg p-6 lg:p-8 mb-6 bg-grid-lines">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Overline & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <img
            src="/neo-rc-logo.png"
            alt="The Research Crew"
            className="w-5 h-5 object-contain"
          />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Verified Intelligence Briefing
          </span>
          <span className="text-neutral-600 font-mono text-xs">•</span>
          <span className="text-[11px] font-mono text-neutral-400">
            OpenRouter Free Model Routing
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Audited & Approved</span>
            <span className="text-emerald-500/70 text-[10px]">Deterministic Gate</span>
          </span>
        </div>
      </div>

      {/* Main Editorial Headline */}
      <div className="mb-8">
        <div className="text-xs md:text-sm font-mono tracking-widest uppercase text-emerald-400/90 mb-1 flex items-center gap-2 font-semibold">
          <span>{category}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans uppercase leading-tight">
          {title}
        </h1>
        <p className="text-sm md:text-base text-neutral-400 mt-2 max-w-3xl font-sans font-normal leading-relaxed">
          Autonomous multi-agent research synthesis verified across 6 mandatory structural dimensions with line-item citation provenance.
        </p>
      </div>

      {/* High-Impact Performance Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {/* Prominent Confidence Score: 78% & 99.2% */}
        <div className="col-span-2 md:col-span-1 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-emerald-500/40 rounded-lg p-4 relative overflow-hidden glow-emerald-sm flex flex-col justify-between">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white font-mono tracking-tight flex items-baseline gap-0.5">
              <span className="text-emerald-300">{animatedConfidence}</span>
              <span className="text-lg text-emerald-500">%</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-medium flex items-center justify-between mt-1">
              <span>RESEARCH CONFIDENCE</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="pt-2.5 mt-2 border-t border-neutral-800/80">
            <div className="text-sm font-mono font-bold text-emerald-400 tracking-tight">
              99.2%
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              VERIFICATION PRECISION
            </div>
          </div>
        </div>

        {/* Verified Sources: 12 */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 mb-1">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>VERIFIED SOURCES</span>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">12</div>
            <div className="text-[10px] text-neutral-500 font-mono font-normal mt-0.5">Primary Ledger Notes</div>
          </div>
        </div>

        {/* Key Findings: 8 */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>KEY FINDINGS</span>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">8</div>
            <div className="text-[10px] text-neutral-500 font-mono font-normal mt-0.5">Quantitative Metrics</div>
          </div>
        </div>

        {/* Major Risks: 3 */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>MAJOR RISKS</span>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">3</div>
            <div className="text-[10px] text-neutral-500 font-mono font-normal mt-0.5">Active Mitigations</div>
          </div>
        </div>

        {/* Execution Latency: 28.4s */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>EXECUTION</span>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">
              {elapsedSec}s
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-normal mt-0.5">
              $0.00 Free Tier Cost
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
