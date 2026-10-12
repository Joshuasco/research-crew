import React from 'react';
import { Search, Edit3, ShieldAlert, Clock, Activity, FileCode } from 'lucide-react';

export function TelemetrySidebar({
  currentAgent,
  agentStatus,
  iteration,
  maxIterations,
  telemetry,
  logs
}) {
  const getAgentBadge = (agentName) => {
    const isActive = currentAgent === agentName;

    let icon = null;
    if (agentName === 'Researcher') {
      icon = <Search className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />;
    } else if (agentName === 'Writer') {
      icon = <Edit3 className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />;
    } else if (agentName === 'Reviewer') {
      icon = <ShieldAlert className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />;
    }

    let statusStyle = 'bg-white dark:bg-[#181A1D] border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#9CA3AF]';
    let stateLabel = 'Queued';

    if (isActive) {
      if (agentStatus === 'in_progress') {
        statusStyle = 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#176B4D] dark:border-[#34D399] text-[#17211D] dark:text-white ring-1 ring-[#176B4D]/30';
        stateLabel = 'In Progress';
      } else if (agentStatus === 'rejected') {
        statusStyle = 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#17211D] dark:border-[#9CA3AF] text-[#17211D] dark:text-white';
        stateLabel = 'Rejected';
      } else if (agentStatus === 'passed' || agentStatus === 'completed') {
        statusStyle = 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.12)] border-[#176B4D] dark:border-[#34D399] text-[#176B4D] dark:text-[#34D399]';
        stateLabel = 'Verified';
      }
    } else {
      if (
        (agentName === 'Researcher' && (currentAgent === 'Writer' || currentAgent === 'Reviewer')) ||
        (agentName === 'Writer' && currentAgent === 'Reviewer' && agentStatus === 'passed')
      ) {
        statusStyle = 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-[#D1D5DB]';
        stateLabel = 'Completed';
      }
    }

    return (
      <div className={`p-3 rounded-lg border transition-all ${statusStyle}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
            {icon}
            <span>{agentName}</span>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold border ${
              stateLabel === 'Rejected'
                ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] border-transparent'
                : stateLabel === 'Verified' || stateLabel === 'Completed'
                ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.2)] text-[#176B4D] dark:text-[#34D399] border-[#176B4D]/30'
                : stateLabel === 'In Progress'
                ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] animate-pulse border-transparent'
                : 'bg-[#EEF1EF] dark:bg-[#22262B] text-[#4E5C55] dark:text-[#9CA3AF] border-[#CBD5CF] dark:border-[#292D33]'
            }`}
          >
            {stateLabel}
          </span>
        </div>
        <p className="text-[11px] text-[#38463F] dark:text-[#9CA3AF] font-sans leading-relaxed">
          {agentName === 'Researcher' && 'Primary evidence retrieval, metric extraction & uncertainty tagging.'}
          {agentName === 'Writer' && 'Synthesis across 6 mandatory sections & structured competitor tables.'}
          {agentName === 'Reviewer' && 'Deterministic audit gate verifying claim citations & line-item provenance.'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 3-Agent Pipeline Blueprint View */}
      <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-4 card-shadow">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#CBD5CF] dark:border-[#292D33]">
          <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />
            3-Agent Blueprint State
          </h3>
          <span className="text-[10px] font-mono font-medium text-[#38463F] dark:text-[#9CA3AF] bg-[#EEF1EF] dark:bg-[#22262B] px-2 py-0.5 rounded-md border border-[#CBD5CF] dark:border-[#292D33]">
            Iter {iteration} / {maxIterations}
          </span>
        </div>

        <div className="space-y-2">
          {getAgentBadge('Researcher')}
          {getAgentBadge('Writer')}
          {getAgentBadge('Reviewer')}
        </div>
      </div>

      {/* Execution Telemetry Counters */}
      <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-4 card-shadow">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
            Execution Telemetry
          </span>
          <span className="text-[10px] font-mono font-medium text-[#176B4D] dark:text-[#34D399]">
            OpenRouter Free
          </span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="bg-[#F4F7F5] dark:bg-[#1F2226] p-2.5 rounded-lg border border-[#CBD5CF] dark:border-[#292D33]">
            <div className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] uppercase font-sans">Elapsed</div>
            <div className="text-sm font-bold text-[#17211D] dark:text-white mt-0.5">
              {telemetry.elapsed_seconds}s
            </div>
          </div>
          <div className="bg-[#F4F7F5] dark:bg-[#1F2226] p-2.5 rounded-lg border border-[#CBD5CF] dark:border-[#292D33]">
            <div className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] uppercase font-sans">Tokens</div>
            <div className="text-sm font-bold text-[#17211D] dark:text-white mt-0.5">
              {telemetry.estimated_tokens.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F4F7F5] dark:bg-[#1F2226] p-2.5 rounded-lg border border-[#CBD5CF] dark:border-[#292D33]">
            <div className="text-[10px] text-[#176B4D] dark:text-[#34D399] uppercase font-sans font-medium">Cost</div>
            <div className="text-sm font-bold text-[#176B4D] dark:text-[#34D399] mt-0.5">
              ${(telemetry.estimated_cost_usd || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Real-Time Event Stream */}
      <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-4 font-mono text-xs card-shadow">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
            Live Event Stream
          </span>
          <span className="text-[10px] text-[#176B4D] dark:text-[#34D399] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B4D] dark:bg-[#34D399] animate-pulse" />
            Real-time
          </span>
        </h3>

        <div className="h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-[#4E5C55] dark:text-[#9CA3AF] font-sans text-center py-10 text-xs italic">
              Awaiting briefing prompt submission...
            </div>
          ) : (
            logs.map((log, index) => {
              const isRejected = log.status === 'rejected';
              const isPassed = log.status === 'passed';

              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg border text-[11px] leading-relaxed transition-all ${
                    isRejected
                      ? 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#17211D] dark:border-[#9CA3AF] text-[#17211D] dark:text-[#F3F4F6]'
                      : isPassed
                      ? 'bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.12)] border-[#176B4D]/30 text-[#176B4D] dark:text-[#34D399]'
                      : 'bg-[#F4F7F5] dark:bg-[#1F2226] border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1 border-b border-[#CBD5CF] dark:border-[#292D33] pb-0.5">
                    <span className="font-bold tracking-wider text-[#17211D] dark:text-white">
                      {log.agent?.toUpperCase()}
                    </span>
                    <span className="text-[#4E5C55] dark:text-[#9CA3AF]">
                      {log.timestamp} {log.iteration ? `(Iter ${log.iteration})` : ''}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-normal leading-relaxed text-[#17211D] dark:text-[#F3F4F6]">
                    {log.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
