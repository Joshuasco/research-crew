import React, { useState } from 'react';
import { Activity } from 'lucide-react';

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

  const benchmark = telemetry?.benchmark_confidence ?? 85.0;
  const thresholdY = getY(benchmark);
  const currentScore = parseFloat(telemetry?.verification_precision ?? lastPoint?.confidence ?? 0);
  const isBenchmarkExceeded = currentScore >= benchmark;
  const roundedCurrentScore = `${Math.round(currentScore)}%`;

  // Derive active point index & percentages for the right-column line indicators
  const activeIdx = Math.max(0, activePoints.findIndex((p) => p.step === activePoint?.step));
  const stepProgressPct = Math.round(((activeIdx + 1) / Math.max(1, activePoints.length)) * 100);

  // Extract (Iteration X/Y) from description or phase if present
  const iterationMatch = activePoint?.description?.match(/\(Iteration\s+\d+\/\d+\)/i);
  const phaseIterMatch = activePoint?.phase?.match(/Iter(?:ation)?\s*(\d+)/i);
  const iterationLabel = iterationMatch
    ? iterationMatch[0]
    : phaseIterMatch
    ? `(Iteration ${phaseIterMatch[1]}/2)`
    : `(Iteration ${activePoints.length > 4 ? 2 : 1}/2)`;

  // Compute Evidence Artifact bar fill percentage (e.g. "6/6 Verified" -> 100%)
  const ratioMatch = activePoint?.evidenceCount?.match(/(\d+)\s*\/\s*(\d+)/);
  const evidencePct = ratioMatch
    ? Math.min(100, Math.round((parseInt(ratioMatch[1], 10) / Math.max(1, parseInt(ratioMatch[2], 10))) * 100))
    : Math.min(100, Math.max(25, Math.round(activePoint?.confidence ?? 50)));

  const confidencePct = Math.min(100, Math.max(8, Math.round(activePoint?.confidence ?? 0)));
  const thresholdFillPct = Math.min(100, Math.max(10, Math.round(currentScore)));

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 lg:p-6 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3.5 sm:pb-4 mb-3.5 sm:mb-4 border-b border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <h2 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white">
            Evidence Confidence & Audit Verification Trajectory
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
            Real-Time Provenance Curve
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout: Left SVG Trajectory Graph + Right Stacked Line-Indicator Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Left Column (8 Cols): Centerpiece SVG Graph */}
        <div className="lg:col-span-8 relative w-full overflow-x-auto scrollbar-none">
          <div className="min-w-[520px] sm:min-w-[640px]">
            <svg
              viewBox="0 0 1000 270"
              className="w-full h-48 sm:h-56 md:h-64 overflow-visible select-none"
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

              {/* Y-Axis Labels: 20%, 40%, 60%, 80%, 100% */}
              {[20, 40, 60, 80, 100].map((level) => {
                const y = getY(level);
                return (
                  <text
                    key={level}
                    x="50"
                    y={y + 3}
                    textAnchor="end"
                    fill="#737373"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {level}%
                  </text>
                );
              })}

              {/* Verification Threshold Target Line (85% Benchmark) */}
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
                {benchmark.toFixed(0)}% AUDIT PASS GATE
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
                      fill="var(--color-neutral-950)"
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
                      fill={isRejection ? 'var(--color-red-400)' : 'var(--color-neutral-200)'}
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
                      fill={isSelected ? 'var(--color-white)' : '#737373'}
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

        {/* Right Column (4 Cols): Stacked Graph Metrics with Line Indicators (Reference Style + DashboardHero Palette) */}
        {activePoint && (
          <div className="lg:col-span-4 bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800/90 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between gap-4">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

            {/* 1. Threshold Gate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-sans font-medium text-neutral-300">
                  Threshold Gate:
                </span>
                <span className={`font-mono font-bold text-[11px] ${
                  isBenchmarkExceeded ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {isBenchmarkExceeded
                    ? `${benchmark.toFixed(1)}% EXCEEDED (${roundedCurrentScore})`
                    : `BELOW ${benchmark.toFixed(1)}% (${roundedCurrentScore})`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isBenchmarkExceeded
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  }`}
                  style={{ width: `${thresholdFillPct}%` }}
                />
              </div>
            </div>

            {/* 2. Evidence Artifact */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-sans font-medium text-neutral-300">
                  Evidence Artifact
                </span>
                <span className="font-mono font-bold text-sky-400">
                  {activePoint.evidenceCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${evidencePct}%` }}
                />
              </div>
            </div>

            {/* 3. Confidence Score */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-sans font-medium text-neutral-300">
                  Confidence Score
                </span>
                <span className={`font-mono font-bold ${
                  activePoint.isRejection ? 'text-red-400' : 'text-indigo-400'
                }`}>
                  {Math.round(activePoint.confidence)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activePoint.isRejection
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                  }`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* 4. Milestone Step, Iteration, Phase & Agent Timestamp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                    activePoint.isRejection
                      ? 'bg-red-950 text-red-300 border border-red-800/80'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                  }`}>
                    {activePoint.step}
                  </span>
                  <span className="font-sans font-medium text-neutral-200">
                    {activePoint.phase}
                  </span>
                </div>
                <span className="font-mono font-bold text-[11px] text-amber-400">
                  {iterationLabel}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${stepProgressPct}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 pt-0.5">
                <span>Agent: <strong className="text-neutral-200 font-semibold">{activePoint.agent}</strong></span>
                <span className="text-neutral-500">•</span>
                <span>{activePoint.timestamp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
