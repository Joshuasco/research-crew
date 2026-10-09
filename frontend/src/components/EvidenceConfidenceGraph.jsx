import React, { useState } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

const DEFAULT_PROGRESSION_POINTS = [
  {
    step: '01',
    agent: 'Researcher',
    phase: 'Source Discovery',
    confidence: 28,
    evidenceCount: '14 Notes',
    description: 'Querying primary web benchmarks and technical whitepapers',
    timestamp: '00:06.2'
  },
  {
    step: '02',
    agent: 'Researcher',
    phase: 'Metric Extraction',
    confidence: 52,
    evidenceCount: '6 Metrics',
    description: 'Extracting quantitative data and tagging uncertain hypotheses',
    timestamp: '00:11.4'
  },
  {
    step: '03',
    agent: 'Writer',
    phase: 'Synthesis Draft 1',
    confidence: 68,
    evidenceCount: '6 Sections',
    description: 'Drafting 6 mandatory executive sections from research notes',
    timestamp: '00:18.8'
  },
  {
    step: '04',
    agent: 'Reviewer',
    phase: 'Audit Iter 1 (Gate)',
    confidence: 59,
    evidenceCount: '1 Uncited Flagged',
    description: 'Audit rejected uncited statistical claim in Market Context',
    timestamp: '00:21.3',
    isRejection: true
  },
  {
    step: '05',
    agent: 'Writer',
    phase: 'Remediation Iter 2',
    confidence: 86,
    evidenceCount: 'Attribution Injected',
    description: 'Revised draft linking 340% benchmark to verified report',
    timestamp: '00:31.0'
  },
  {
    step: '06',
    agent: 'Reviewer',
    phase: 'Audit Passed',
    confidence: 99.2,
    evidenceCount: '6/6 Verified',
    description: 'Deterministic quality gate passed with zero phantom claims',
    timestamp: '00:36.5',
    isPassed: true
  }
];

export function EvidenceConfidenceGraph({ telemetry }) {
  const activePoints = (telemetry?.trajectory_points && telemetry.trajectory_points.length > 0)
    ? telemetry.trajectory_points
    : DEFAULT_PROGRESSION_POINTS;

  const [selectedStep, setSelectedStep] = useState(null);
  const activePoint = activePoints.find(p => p.step === selectedStep) || activePoints[activePoints.length - 1];

  const lastPoint = activePoints[activePoints.length - 1];
  const precisionLabel = telemetry?.verification_precision ? `${telemetry.verification_precision}%` : `${lastPoint?.confidence ?? 0}%`;

  // Coordinate mapping for SVG (viewBox: 0 0 1000 280)
  // X: 70 to 950 across activePoints.length points
  // Y: 240 (0%) down to 35 (100%)
  const getY = (val) => 240 - (val / 100) * 205;
  const getX = (idx) => activePoints.length === 1 ? 500 : 80 + idx * (860 / (activePoints.length - 1));

  // Build SVG path points
  const points = activePoints.map((p, idx) => ({
    x: getX(idx),
    y: getY(p.confidence),
    ...p
  }));

  // Build smooth curve path using cubic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) * 0.45;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) * 0.55;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  // Area path closing at the bottom
  const areaD = `${pathD} L ${points[points.length - 1].x} 240 L ${points[0].x} 240 Z`;

  const thresholdY = getY(95.0);

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 lg:p-6 mb-6 relative overflow-hidden bg-grid-dots">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Evidence Confidence & Audit Verification Trajectory
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
            Real-Time Provenance Curve
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400 text-[11px]">Threshold Gate:</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-600/60 text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            95.0% EXCEEDED ({precisionLabel})
          </span>
        </div>
      </div>

      {/* Centerpiece SVG Graph */}
      <div className="relative w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[720px]">
          <svg
            viewBox="0 0 1000 270"
            className="w-full h-52 md:h-64 overflow-visible select-none"
          >
            <defs>
              <linearGradient id="evidenceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
              </linearGradient>

              <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Y-Axis Horizontal Grid Lines: 20%, 40%, 60%, 80%, 100% */}
            {[20, 40, 60, 80, 100].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1="60"
                    y1={y}
                    x2="960"
                    y2={y}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray={level === 100 ? 'none' : '3 3'}
                  />
                  <text
                    x="50"
                    y={y + 3}
                    textAnchor="end"
                    fill="#737373"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Verification Threshold Target Line (95%) */}
            <line
              x1="60"
              y1={thresholdY}
              x2="960"
              y2={thresholdY}
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="4 4"
              strokeOpacity="0.6"
            />
            <text
              x="960"
              y={thresholdY - 5}
              textAnchor="end"
              fill="#34d399"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              95% AUDIT PASS GATE
            </text>

            {/* Shaded Area Under Curve */}
            <path d={areaD} fill="url(#evidenceAreaGrad)" />

            {/* Main Luminous Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.75"
              strokeLinecap="round"
              filter="url(#emeraldGlow)"
            />

            {/* Data Points & Markers */}
            {points.map((p, idx) => {
              const isSelected = activePoint?.step === p.step;
              const isRejection = p.isRejection;
              const isPassed = p.isPassed;

              const pinColor = isRejection ? '#ef4444' : isPassed ? '#10b981' : '#34d399';

              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setSelectedStep(p.step)}
                >
                  {/* Subtle vertical milestone guide */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x}
                    y2="240"
                    stroke="#27272a"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  {/* Outer pulse circle when selected */}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      fill="none"
                      stroke={pinColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? '6' : '4.5'}
                    fill="#09090b"
                    stroke={pinColor}
                    strokeWidth={isSelected ? '2.5' : '2'}
                    className="transition-all duration-150"
                  />

                  {/* Inner Core */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? '3' : '2'}
                    fill={pinColor}
                  />

                  {/* Score Label above point */}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill={isRejection ? '#fca5a5' : '#e5e5e5'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {p.confidence}%
                  </text>

                  {/* X-Axis Milestone Label below */}
                  <text
                    x={p.x}
                    y="256"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#737373'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {p.phase}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Milestone Inspection Card */}
      {activePoint && (
        <div className="mt-4 p-3.5 bg-neutral-900 border border-neutral-800 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${
              activePoint.isRejection
                ? 'bg-red-950 text-red-300 border border-red-800'
                : activePoint.isPassed
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
            }`}>
              {activePoint.step}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">{activePoint.phase}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">Agent: <strong className="text-neutral-200">{activePoint.agent}</strong></span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{activePoint.timestamp}</span>
              </div>
              <p className="text-neutral-400 text-[11px] font-sans mt-0.5">
                {activePoint.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase block">Evidence Artifact</span>
              <span className="font-bold text-white">{activePoint.evidenceCount}</span>
            </div>
            <div className="text-right pl-3 border-l border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase block">Confidence Score</span>
              <span className={`font-bold text-base ${activePoint.isRejection ? 'text-red-400' : 'text-emerald-400'}`}>
                {activePoint.confidence}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
