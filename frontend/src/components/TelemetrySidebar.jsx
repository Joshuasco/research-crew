import React from 'react';
import { Search, Edit3, ShieldAlert, CheckCircle2, Clock, Cpu, DollarSign, Activity, FileCode } from 'lucide-react';

export function TelemetrySidebar({
  currentAgent,
  agentStatus,
  statusMessage,
  iteration,
  maxIterations,
  telemetry,
  logs,
  rejections
}) {
  const getAgentBadge = (agentName) => {
    const isActive = currentAgent === agentName;
    
    let icon = null;
    if (agentName === 'Researcher') icon = <Search className="w-4 h-4" />;
    if (agentName === 'Writer') icon = <Edit3 className="w-4 h-4" />;
    if (agentName === 'Reviewer') icon = <ShieldAlert className="w-4 h-4" />;

    let statusStyle = "bg-neutral-950 border-neutral-800 text-neutral-500";
    let stateLabel = "Idle";

    if (isActive) {
      if (agentStatus === 'in_progress') {
        statusStyle = "bg-neutral-900 border-white text-white shadow-sm ring-1 ring-white";
        stateLabel = "In Progress...";
      } else if (agentStatus === 'rejected') {
        statusStyle = "bg-red-950/40 border-red-500/80 text-red-300";
        stateLabel = "REJECTED";
      } else if (agentStatus === 'passed' || agentStatus === 'completed') {
        statusStyle = "bg-emerald-950/40 border-emerald-500/80 text-emerald-300";
        stateLabel = "PASSED";
      }
    } else {
      // Past agents that succeeded
      if (
        (agentName === 'Researcher' && (currentAgent === 'Writer' || currentAgent === 'Reviewer')) ||
        (agentName === 'Writer' && currentAgent === 'Reviewer' && agentStatus === 'passed')
      ) {
        statusStyle = "bg-neutral-900 border-neutral-700 text-neutral-300";
        stateLabel = "Completed";
      }
    }

    return (
      <div className={`p-3.5 rounded-lg border transition-all duration-200 ${statusStyle}`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            {icon}
            <span>{agentName}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
            stateLabel === 'REJECTED' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
            stateLabel === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
            stateLabel === 'In Progress...' ? 'bg-white text-black font-bold animate-pulse' :
            'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}>
            {stateLabel}
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-sans line-clamp-2">
          {agentName === 'Researcher' && 'Queries live web sources, extracts metrics & tags uncertainty.'}
          {agentName === 'Writer' && 'Drafts 6 mandatory executive sections from research notes.'}
          {agentName === 'Reviewer' && 'Deterministic quality gate cross-referencing claims & metrics.'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* 3-Agent Pipeline Blueprint View */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" />
            3-Agent Pipeline State
          </h3>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
            Iter {iteration} / {maxIterations}
          </span>
        </div>

        <div className="space-y-2.5">
          {getAgentBadge('Researcher')}
          {getAgentBadge('Writer')}
          {getAgentBadge('Reviewer')}
        </div>
      </div>

      {/* Execution Telemetry Counters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          Execution Telemetry
        </h3>

        <div className="grid grid-cols-3 gap-2 font-mono text-center">
          <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">Elapsed</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {telemetry.elapsed_seconds}s
            </div>
          </div>
          <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">Est Tokens</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {telemetry.estimated_tokens.toLocaleString()}
            </div>
          </div>
          <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase font-bold text-emerald-400">Est Cost</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              ${(telemetry.estimated_cost_usd || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Live Agent Thought Log Feed */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-neutral-400" />
            Agent Telemetry Stream
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Real-time SSE</span>
        </h3>

        <div className="h-64 overflow-y-auto space-y-2 pr-1 font-mono text-xs scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-neutral-600 text-center py-10 text-xs italic">
              Awaiting briefing prompt submission...
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border text-[11px] leading-relaxed transition-all ${
                  log.status === 'rejected'
                    ? 'bg-red-950/30 border-red-900/50 text-red-300'
                    : log.status === 'passed'
                    ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1 border-b border-neutral-800/60 pb-0.5">
                  <span className="font-bold text-neutral-300">[{log.agent}]</span>
                  <span>{log.timestamp} (Iter {log.iteration})</span>
                </div>
                <div>{log.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
