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
    <div className="w-full max-w-4xl mx-auto my-auto py-6 flex flex-col items-center">
      {/* Active Pipeline Status Banner */}
      <div className="w-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-5 mb-5 card-shadow text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-[#EEF1EF] dark:bg-[#22262B] p-0.5 border border-[#CBD5CF] dark:border-[#292D33] inline-flex items-center justify-center">
            <img src="/neo-rc-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#EEF1EF] dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-xs font-mono text-[#38463F] dark:text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-[#176B4D] dark:bg-[#34D399] animate-pulse" />
            <span className="font-semibold text-[#17211D] dark:text-white">PIPELINE RUNNING</span>
            <span>•</span>
            <span>Iteration {iteration} / {maxIterations}</span>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
          {topic || 'Commercial Fusion Energy Reactor Benchmarks & Timeline'}
        </h2>
        <p className="text-xs font-mono text-[#176B4D] dark:text-[#34D399] mt-1.5">
          {statusMessage || 'Agents actively executing deterministic research protocol...'}
        </p>
      </div>

      {/* 3-Agent Sequential Progression Workflow */}
      <div className="w-full space-y-3 mb-5">
        {/* STAGE 1: RESEARCHER */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            researcherState === 'active'
              ? 'bg-white dark:bg-[#181A1D] border-[#176B4D] dark:border-[#34D399] ring-1 ring-[#176B4D]/30 shadow-xs'
              : researcherState === 'completed'
              ? 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#CBD5CF] dark:border-[#292D33]'
              : 'bg-[#F4F7F5]/50 dark:bg-[#181A1D]/50 border-[#CBD5CF] dark:border-[#292D33] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#EEF1EF] dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                01
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
                RESEARCHER
              </span>
            </div>

            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-semibold uppercase border ${
                researcherState === 'completed'
                  ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] border-[#176B4D]/30'
                  : researcherState === 'active'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] border-transparent animate-pulse'
                  : 'bg-[#EEF1EF] dark:bg-[#22262B] text-[#4E5C55] dark:text-[#9CA3AF] border-[#CBD5CF] dark:border-[#292D33]'
              }`}
            >
              {researcherState === 'completed'
                ? '✓ COMPLETED'
                : researcherState === 'active'
                ? '● EXTRACTING EVIDENCE'
                : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans text-xs text-[#38463F] dark:text-[#9CA3AF] pl-8">
            <span className={researcherState === 'active' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Searching sources
            </span>
            <span className={researcherState === 'active' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Extracting evidence
            </span>
            <span className={researcherState === 'active' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Identifying metrics
            </span>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center -my-1">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-center text-[#4E5C55] dark:text-[#9CA3AF]">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STAGE 2: WRITER */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            writerState === 'active'
              ? 'bg-white dark:bg-[#181A1D] border-[#176B4D] dark:border-[#34D399] ring-1 ring-[#176B4D]/30 shadow-xs'
              : writerState === 'completed'
              ? 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#CBD5CF] dark:border-[#292D33]'
              : 'bg-[#F4F7F5]/50 dark:bg-[#181A1D]/50 border-[#CBD5CF] dark:border-[#292D33] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#EEF1EF] dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                02
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
                WRITER
              </span>
            </div>

            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-semibold uppercase border ${
                writerState === 'completed'
                  ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] border-[#176B4D]/30'
                  : writerState === 'active'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] border-transparent animate-pulse'
                  : 'bg-[#EEF1EF] dark:bg-[#22262B] text-[#4E5C55] dark:text-[#9CA3AF] border-[#CBD5CF] dark:border-[#292D33]'
              }`}
            >
              {writerState === 'completed'
                ? '✓ COMPLETED'
                : writerState === 'active'
                ? '● SYNTHESIZING DRAFT'
                : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-xs text-[#38463F] dark:text-[#9CA3AF] pl-8">
            <span className={writerState === 'active' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Synthesizing findings
            </span>
            <span className={writerState === 'active' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Building executive briefing
            </span>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center -my-1">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-center text-[#4E5C55] dark:text-[#9CA3AF]">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STAGE 3: REVIEWER */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            reviewerState === 'auditing'
              ? 'bg-white dark:bg-[#181A1D] border-[#176B4D] dark:border-[#34D399] ring-1 ring-[#176B4D]/30 shadow-xs'
              : reviewerState === 'verified'
              ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.12)] border-[#176B4D] dark:border-[#34D399]'
              : reviewerState === 'rejected'
              ? 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#17211D] dark:border-[#9CA3AF]'
              : 'bg-[#F4F7F5]/50 dark:bg-[#181A1D]/50 border-[#CBD5CF] dark:border-[#292D33] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#EEF1EF] dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                03
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
                REVIEWER (&ldquo;THE TEETH&rdquo;)
              </span>
            </div>

            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-semibold uppercase border ${
                reviewerState === 'verified'
                  ? 'bg-[#176B4D] text-white dark:bg-[#34D399] dark:text-[#17211D] border-transparent font-bold'
                  : reviewerState === 'rejected'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] border-transparent'
                  : reviewerState === 'auditing'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] border-transparent animate-pulse'
                  : 'bg-[#EEF1EF] dark:bg-[#22262B] text-[#4E5C55] dark:text-[#9CA3AF] border-[#CBD5CF] dark:border-[#292D33]'
              }`}
            >
              {reviewerState === 'verified'
                ? '✓ VERIFIED BRIEFING'
                : reviewerState === 'rejected'
                ? '✕ REJECTED (ITER 1)'
                : reviewerState === 'auditing'
                ? '◉ AUDITING CLAIMS'
                : '○ QUEUED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans text-xs text-[#38463F] dark:text-[#9CA3AF] pl-8">
            <span className={reviewerState === 'auditing' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Cross-checking claims
            </span>
            <span className={reviewerState === 'auditing' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Validating citations
            </span>
            <span className={reviewerState === 'auditing' ? 'text-[#176B4D] dark:text-[#34D399] font-medium' : ''}>
              ● Running audit gate
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Live Telemetry Bar */}
      <div className="w-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-3.5 mb-5 font-mono text-xs flex items-center justify-between card-shadow">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF]" />
          <span className="text-[#4E5C55] dark:text-[#9CA3AF]">Elapsed:</span>
          <span className="font-bold text-[#17211D] dark:text-white">{telemetry.elapsed_seconds}s</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF]" />
          <span className="text-[#4E5C55] dark:text-[#9CA3AF]">Tokens:</span>
          <span className="font-bold text-[#17211D] dark:text-white">{telemetry.estimated_tokens.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#176B4D] dark:text-[#34D399]" />
          <span className="text-[#4E5C55] dark:text-[#9CA3AF]">Cost:</span>
          <span className="font-bold text-[#176B4D] dark:text-[#34D399]">$0.00 (Free Tier)</span>
        </div>
      </div>

      {/* Live Agent Event Stream Logs */}
      <div className="w-full bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-4 font-mono text-xs card-shadow">
        <div className="text-xs font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white pb-2.5 mb-2.5 border-b border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#176B4D] dark:text-[#34D399]" />
            Live Agent Execution Stream
          </span>
          <span className="text-[#176B4D] dark:text-[#34D399] font-mono text-[11px] font-bold">● Active</span>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-[11px] leading-relaxed flex items-start gap-2 border ${
                log.status === 'rejected'
                  ? 'bg-[#F4F7F5] dark:bg-[#1F2226] text-[#17211D] dark:text-[#F3F4F6] border-[#17211D] dark:border-[#9CA3AF]'
                  : log.status === 'passed'
                  ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.12)] text-[#176B4D] dark:text-[#34D399] border-[#176B4D]/30'
                  : 'bg-[#F4F7F5] dark:bg-[#1F2226] text-[#38463F] dark:text-[#9CA3AF] border-transparent'
              }`}
            >
              <span className="text-[#4E5C55] dark:text-[#9CA3AF] shrink-0">{log.timestamp}</span>
              <span className="font-bold shrink-0 text-[#17211D] dark:text-white">
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
