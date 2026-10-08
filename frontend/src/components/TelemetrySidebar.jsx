import React from 'react';
import { Search, Edit3, ShieldAlert, Clock, Activity, FileCode } from 'lucide-react';

export function TelemetrySidebar({
  currentAgent,
  agentStatus,
  _statusMessage,
  iteration,
  maxIterations,
  telemetry,
  logs,
  _rejections
}) {
  const getAgentBadge = (agentName) => {
    const isActive = currentAgent === agentName;
    
    let icon = null;
    let accentColor = "text-neutral-400";
    if (agentName === 'Researcher') {
      icon = <Search className="w-3.5 h-3.5 text-teal-400" />;
      accentColor = "text-teal-400";
    }
    if (agentName === 'Writer') {
      icon = <Edit3 className="w-3.5 h-3.5 text-indigo-400" />;
      accentColor = "text-indigo-400";
    }
    if (agentName === 'Reviewer') {
      icon = <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />;
      accentColor = "text-emerald-400";
    }

    let statusStyle = "bg-neutral-950 border-neutral-800 text-neutral-400";
    let stateLabel = "Queued";

    if (isActive) {
      if (agentStatus === 'in_progress') {
        statusStyle = "bg-neutral-900 border-white text-white shadow-sm ring-1 ring-white/50";
        stateLabel = "In Progress";
      } else if (agentStatus === 'rejected') {
        statusStyle = "bg-red-950/40 border-red-500/80 text-red-200";
        stateLabel = "Rejected";
      } else if (agentStatus === 'passed' || agentStatus === 'completed') {
        statusStyle = "bg-emerald-950/40 border-emerald-500/80 text-emerald-200";
        stateLabel = "Verified";
      }
    } else {
      if (
        (agentName === 'Researcher' && (currentAgent === 'Writer' || currentAgent === 'Reviewer')) ||
        (agentName === 'Writer' && currentAgent === 'Reviewer' && agentStatus === 'passed')
      ) {
        statusStyle = "bg-neutral-900 border-neutral-700/80 text-neutral-300";
        stateLabel = "Completed";
      }
    }

    return (
      <div className={`p-3 rounded-lg border transition-all duration-200 ${statusStyle}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            {icon}
            <span className={accentColor}>{agentName}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
            stateLabel === 'Rejected' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
            stateLabel === 'Verified' || stateLabel === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
            stateLabel === 'In Progress' ? 'bg-white text-black font-bold animate-pulse' :
            'bg-neutral-800 text-neutral-500 border-neutral-700'
          }`}>
            {stateLabel}
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
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
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800">
          <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            3-Agent Blueprint State
          </h3>
          <span className="text-[10px] font-mono font-medium text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
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
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-300 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            Execution Telemetry
          </span>
          <span className="text-[10px] font-mono font-medium text-emerald-400">OpenRouter Free</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase font-medium">Elapsed</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {telemetry.elapsed_seconds}s
            </div>
          </div>
          <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase font-medium">Tokens</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {telemetry.estimated_tokens.toLocaleString()}
            </div>
          </div>
          <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Cost</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              ${(telemetry.estimated_cost_usd || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Real-Time Event Stream */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-xs">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-300 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-neutral-400" />
            Live Event Stream
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time
          </span>
        </h3>

        <div className="h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-neutral-500 font-sans text-center py-12 text-xs italic">
              Awaiting briefing prompt submission...
            </div>
          ) : (
            logs.map((log, index) => {
              const isResearcher = log.agent === 'Researcher';
              const isWriter = log.agent === 'Writer';
              const isReviewer = log.agent === 'Reviewer';
              const isRejected = log.status === 'rejected';
              const isPassed = log.status === 'passed';

              return (
                <div
                  key={index}
                  className={`p-2 rounded border text-[11px] leading-relaxed transition-all ${
                    isRejected
                      ? 'bg-red-950/25 border-red-900/60 text-red-200'
                      : isPassed
                      ? 'bg-emerald-950/25 border-emerald-900/60 text-emerald-200'
                      : 'bg-neutral-900/80 border-neutral-800/80 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1 border-b border-neutral-800/60 pb-0.5">
                    <span
                      className={`font-bold tracking-wider ${
                        isResearcher
                          ? 'text-teal-400'
                          : isWriter
                          ? 'text-indigo-400'
                          : isReviewer
                          ? 'text-emerald-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {log.agent.toUpperCase()}
                    </span>
                    <span className="text-neutral-500">
                      {log.timestamp} {log.iteration ? `(Iter ${log.iteration})` : ''}
                    </span>
                  </div>
                  <div className="text-neutral-200 font-mono text-xs font-normal leading-relaxed">
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
