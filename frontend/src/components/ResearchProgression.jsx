import React from 'react';
import { ArrowDown, Activity, Clock, Cpu, DollarSign } from 'lucide-react';

export function ResearchProgression({
  currentAgent,
  agentStatus,
  statusMessage,
  iteration,
  maxIterations,
  telemetry,
  logs,
  topic
}) {
  // Determine state of each stage
  const getStageState = (stageName) => {
    if (stageName === 'Researcher') {
      if (currentAgent === 'Researcher') return 'active';
      if (currentAgent === 'Writer' || currentAgent === 'Reviewer') return 'completed';
      return 'queued';
    }
    if (stageName === 'Writer') {
      if (currentAgent === 'Researcher') return 'queued';
      if (currentAgent === 'Writer') return 'active';
      if (currentAgent === 'Reviewer') return 'completed';
      return 'queued';
    }
    if (stageName === 'Reviewer') {
      if (currentAgent === 'Reviewer') {
        if (agentStatus === 'rejected') return 'rejected';
        if (agentStatus === 'passed' || agentStatus === 'completed') return 'verified';
        return 'auditing';
      }
      return 'queued';
    }
    return 'queued';
  };

  const researcherState = getStageState('Researcher');
  const writerState = getStageState('Writer');
  const reviewerState = getStageState('Reviewer');

  return (
    <div className="max-w-4xl w-full mx-auto my-auto py-8 flex flex-col items-center">
      {/* Active Investigation Topic Banner */}
      <div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-5 mb-6 text-center bg-grid-lines relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <img
            src="/neo-rc-logo.png"
            alt="The Research Crew Logo"
            className="w-5 h-5 object-contain"
          />
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white">PIPELINE EXECUTING</span>
            <span className="text-neutral-500">•</span>
            <span>Iteration {iteration} / {maxIterations}</span>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
          {topic || 'Commercial Fusion Energy Reactor Benchmarks & Timeline'}
        </h2>
        <p className="text-xs font-mono text-emerald-400 mt-1.5">
          {statusMessage || 'Agents actively executing deterministic research protocol...'}
        </p>
      </div>

      {/* 3-Agent Sequential Progression Workflow */}
      <div className="w-full max-w-2xl flex flex-col items-stretch gap-3 mb-6">
        {/* STAGE 1: RESEARCHER */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 ${
            researcherState === 'active'
              ? 'bg-neutral-900 border-teal-500/80 shadow-lg glow-emerald-sm ring-1 ring-teal-500/40'
              : researcherState === 'completed'
              ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
              : 'bg-neutral-950/60 border-neutral-900 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${
                researcherState === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                researcherState === 'active' ? 'bg-teal-950 text-teal-300 border border-teal-600' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                01
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                RESEARCHER
              </span>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold uppercase border ${
              researcherState === 'completed' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60' :
              researcherState === 'active' ? 'bg-teal-950 text-teal-300 border-teal-500 animate-pulse' :
              'bg-neutral-900 text-neutral-500 border-neutral-800'
            }`}>
              {researcherState === 'completed' ? '✓ COMPLETED' :
               researcherState === 'active' ? '● EXTRACTING EVIDENCE' : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-sans text-xs text-neutral-400 pl-8">
            <span className={researcherState === 'active' ? 'text-teal-300 font-medium' : ''}>
              ● Searching sources
            </span>
            <span className={researcherState === 'active' ? 'text-teal-300 font-medium' : ''}>
              ● Extracting evidence
            </span>
            <span className={researcherState === 'active' ? 'text-teal-300 font-medium' : ''}>
              ● Identifying metrics
            </span>
          </div>
        </div>

        {/* Animated Connector 1 */}
        <div className="flex justify-center -my-1">
          <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
            <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* STAGE 2: WRITER */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 ${
            writerState === 'active'
              ? 'bg-neutral-900 border-indigo-500/80 shadow-lg glow-emerald-sm ring-1 ring-indigo-500/40'
              : writerState === 'completed'
              ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
              : 'bg-neutral-950/60 border-neutral-900 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${
                writerState === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                writerState === 'active' ? 'bg-indigo-950 text-indigo-300 border border-indigo-600' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                02
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                WRITER
              </span>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-semibold uppercase border ${
              writerState === 'completed' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60' :
              writerState === 'active' ? 'bg-indigo-950 text-indigo-300 border-indigo-500 animate-pulse' :
              'bg-neutral-900 text-neutral-500 border-neutral-800'
            }`}>
              {writerState === 'completed' ? '✓ COMPLETED' :
               writerState === 'active' ? '● SYNTHESIZING DRAFT' : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-sans text-xs text-neutral-400 pl-8">
            <span className={writerState === 'active' ? 'text-indigo-300 font-medium' : ''}>
              ● Synthesizing findings
            </span>
            <span className={writerState === 'active' ? 'text-indigo-300 font-medium' : ''}>
              ● Building executive briefing
            </span>
          </div>
        </div>

        {/* Animated Connector 2 */}
        <div className="flex justify-center -my-1">
          <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
            <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* STAGE 3: REVIEWER */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 ${
            reviewerState === 'auditing'
              ? 'bg-neutral-900 border-emerald-500/80 shadow-lg glow-emerald-sm ring-1 ring-emerald-500/40'
              : reviewerState === 'verified'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 glow-border-emerald'
              : reviewerState === 'rejected'
              ? 'bg-red-950/30 border-red-700 text-red-200'
              : 'bg-neutral-950/60 border-neutral-900 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${
                reviewerState === 'verified' ? 'bg-emerald-900 text-emerald-300 border border-emerald-500' :
                reviewerState === 'rejected' ? 'bg-red-950 text-red-300 border border-red-600' :
                reviewerState === 'auditing' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                03
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                REVIEWER (&ldquo;THE TEETH&rdquo;)
              </span>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-semibold uppercase border ${
              reviewerState === 'verified' ? 'bg-emerald-500 text-black font-extrabold border-emerald-400' :
              reviewerState === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500' :
              reviewerState === 'auditing' ? 'bg-emerald-950 text-emerald-300 border-emerald-500 animate-pulse' :
              'bg-neutral-900 text-neutral-500 border-neutral-800'
            }`}>
              {reviewerState === 'verified' ? '✓ VERIFIED BRIEFING' :
               reviewerState === 'rejected' ? '✕ REJECTED (ITER 1)' :
               reviewerState === 'auditing' ? '◉ AUDITING CLAIMS' : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-sans text-xs text-neutral-400 pl-8">
            <span className={reviewerState === 'auditing' ? 'text-emerald-300 font-medium' : ''}>
              ● Cross-checking claims
            </span>
            <span className={reviewerState === 'auditing' ? 'text-emerald-300 font-medium' : ''}>
              ● Validating citations
            </span>
            <span className={reviewerState === 'auditing' ? 'text-emerald-300 font-medium' : ''}>
              ● Running audit gate
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Live Telemetry Bar */}
      <div className="w-full max-w-2xl bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5 mb-6 font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400 font-medium">Elapsed:</span>
          <span className="text-white font-bold">{telemetry.elapsed_seconds}s</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400 font-medium">Tokens:</span>
          <span className="text-white font-bold">{telemetry.estimated_tokens.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-neutral-400 font-medium">Marginal Cost:</span>
          <span className="text-emerald-400 font-bold">$0.00 (Free Tier)</span>
        </div>
      </div>

      {/* Live Agent Event Stream Logs */}
      <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-xs">
        <div className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-300 pb-2 mb-2 border-b border-neutral-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Live Agent Execution Stream
          </span>
          <span className="text-emerald-400 font-mono text-[11px] font-bold animate-pulse">● Active</span>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-1.5 rounded text-[11px] leading-relaxed flex items-start gap-2 ${
                log.status === 'rejected'
                  ? 'bg-red-950/20 text-red-300 border border-red-900/40'
                  : log.status === 'passed'
                  ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-900/40'
                  : 'text-neutral-300'
              }`}
            >
              <span className="text-neutral-500 shrink-0">{log.timestamp}</span>
              <span className={`font-bold shrink-0 ${
                log.agent === 'Researcher' ? 'text-teal-400' :
                log.agent === 'Writer' ? 'text-indigo-400' :
                log.agent === 'Reviewer' ? 'text-emerald-400' :
                'text-neutral-400'
              }`}>
                [{log.agent}]
              </span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
