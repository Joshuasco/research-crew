import React, { useState } from 'react';

const PROGRESSION_POINTS = [
  {
    step: '01',
    agent: 'Researcher',
    phase: 'Source Discovery',
    confidence: 28,
    evidenceCount: '14 Notes',
    description: 'Querying primary web benchmarks and technical whitepapers',
    timestamp: '00:06.2',
    iteration: 1
  },
  {
    step: '02',
    agent: 'Researcher',
    phase: 'Metric Extraction',
    confidence: 52,
    evidenceCount: '6 Metrics',
    description: 'Extracting quantitative data and tagging uncertain hypotheses',
    timestamp: '00:11.4',
    iteration: 1
  },
  {
    step: '03',
    agent: 'Writer',
    phase: 'Synthesis Draft 1',
    confidence: 68,
    evidenceCount: '6 Sections',
    description: 'Drafting 6 mandatory executive sections from research notes',
    timestamp: '00:18.8',
    iteration: 1
  },
  {
    step: '04',
    agent: 'Reviewer',
    phase: 'Audit Iter 1 (Gate)',
    confidence: 59,
    evidenceCount: '1 Uncited Flagged',
    description: 'Audit rejected uncited statistical claim in Market Context',
    timestamp: '00:21.3',
    isRejection: true,
    iteration: 1
  },
  {
    step: '05',
    agent: 'Writer',
    phase: 'Remediation Iter 2',
    confidence: 86,
    evidenceCount: 'Attribution Injected',
    description: 'Revised draft linking 340% benchmark to verified report',
    timestamp: '00:31.0',
    iteration: 2
  },
  {
    step: '06',
    agent: 'Reviewer',
    phase: 'Audit Passed',
    confidence: 99.2,
    evidenceCount: '6/6 Verified',
    description: 'Deterministic quality gate passed with zero phantom claims',
    timestamp: '00:36.5',
    isPassed: true,
    iteration: 2
  }
];

export function EvidenceConfidenceGraph() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'iter1' | 'iter2'
  const [activePoint, setActivePoint] = useState(PROGRESSION_POINTS[PROGRESSION_POINTS.length - 1]);

  const filteredPoints = PROGRESSION_POINTS.filter((p) => {
    if (activeFilter === 'iter1') return p.iteration === 1;
    if (activeFilter === 'iter2') return p.iteration === 2;
    return true;
  });

  const getY = (val) => 220 - (val / 100) * 180;
  const chartHeight = 180;
  const baselineY = 220;
  const thresholdY = getY(95.0);

  const chartWidth = 860;
  const startX = 75;
  const slotWidth = chartWidth / Math.max(filteredPoints.length, 1);

  return (
    <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-5 md:p-6 mb-6 card-shadow">
      {/* Header bar matching reference chart header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#CBD5CF] dark:border-[#292D33]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#17211D] dark:text-[#F3F4F6] font-sans">
              Evidence Confidence &amp; Milestone Progression
            </h3>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#E6F0EA] dark:bg-[#22262B] text-[#176B4D] dark:text-[#34D399] border border-[rgba(23,107,77,0.25)] dark:border-[#292D33]">
              99.2% Final Confidence
            </span>
          </div>
          <p className="text-xs text-[#38463F] dark:text-[#9CA3AF] mt-0.5 font-sans">
            Verification confidence per milestone across Researcher, Writer, and Reviewer gates
          </p>
        </div>

        {/* Milestone filter buttons */}
        <div className="flex items-center rounded-lg border border-[#CBD5CF] dark:border-[#292D33] p-0.5 bg-[#EEF1EF] dark:bg-[#1F2226] text-xs font-medium font-sans">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-white shadow-xs font-semibold'
                : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
            }`}
          >
            All Milestones
          </button>
          <button
            onClick={() => setActiveFilter('iter1')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'iter1'
                ? 'bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-white shadow-xs font-semibold'
                : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
            }`}
          >
            Iteration 1
          </button>
          <button
            onClick={() => setActiveFilter('iter2')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'iter2'
                ? 'bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-white shadow-xs font-semibold'
                : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
            }`}
          >
            Iteration 2
          </button>
        </div>
      </div>

      {/* SVG Vertical Bar Chart */}
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[680px]">
          <svg viewBox="0 0 1000 275" className="w-full h-56 md:h-64 select-none">
            {/* Horizontal Grid lines */}
            {[0, 20, 40, 60, 80, 100].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1="65"
                    y1={y}
                    x2="945"
                    y2={y}
                    stroke="currentColor"
                    className="text-[#CBD5CF] dark:text-[#292D33]"
                    strokeWidth={level === 0 ? '1.5' : '1'}
                    strokeDasharray={level === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x="55"
                    y={y + 3.5}
                    textAnchor="end"
                    className="fill-[#38463F] dark:fill-[#9CA3AF] text-[10px] font-mono font-semibold"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Restrained 95% Audit Pass Threshold Reference Line */}
            <line
              x1="65"
              y1={thresholdY}
              x2="945"
              y2={thresholdY}
              stroke="#176B4D"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              strokeOpacity="0.85"
              className="dark:stroke-[#34D399]"
            />
            {/* Clean threshold label positioned on the left with background cutout to eliminate collision with 99.2% final bar */}
            <g>
              <rect
                x="68"
                y={thresholdY - 14}
                width="168"
                height="12"
                rx="2"
                className="fill-white dark:fill-[#181A1D]"
              />
              <text
                x="72"
                y={thresholdY - 4}
                textAnchor="start"
                fill="#176B4D"
                className="text-[9px] font-mono font-bold dark:fill-[#34D399] tracking-wider select-none"
              >
                95.0% AUDIT PASS THRESHOLD
              </text>
            </g>

            {/* Vertical Bars and Milestone Labels */}
            {filteredPoints.map((p, idx) => {
              const isSelected = activePoint?.step === p.step;
              const slotCenter = startX + idx * slotWidth + slotWidth / 2;
              const barWidth = Math.min(54, Math.max(34, slotWidth * 0.42));
              const barHeight = Math.max(4, (p.confidence / 100) * chartHeight);
              const barY = baselineY - barHeight;
              const barX = slotCenter - barWidth / 2;

              // Color palette: Forest Green as brand accent, neutral grey for flagged/rejection gate
              const barColorClass = p.isRejection
                ? 'fill-[#38463F] dark:fill-[#6B7280]'
                : 'fill-[#176B4D] dark:fill-[#34D399]';

              return (
                <g
                  key={p.step}
                  className="cursor-pointer group"
                  onClick={() => setActivePoint(p)}
                  onMouseEnter={() => setActivePoint(p)}
                >
                  {/* Subtle column hover background target */}
                  <rect
                    x={slotCenter - slotWidth / 2 + 4}
                    y="35"
                    width={slotWidth - 8}
                    height="190"
                    rx="6"
                    fill="transparent"
                    className="group-hover:fill-black/[0.03] dark:group-hover:fill-white/[0.04] transition-colors"
                  />

                  {/* Vertical Bar */}
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    className={`${barColorClass} transition-opacity ${
                      isSelected ? 'opacity-100 ring-2' : 'opacity-85 group-hover:opacity-100'
                    }`}
                  />

                  {/* Selection Indicator Ring/Border for active bar */}
                  {isSelected && (
                    <rect
                      x={barX - 2}
                      y={barY - 2}
                      width={barWidth + 4}
                      height={barHeight + 2}
                      rx="6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#17211D] dark:text-white"
                      opacity="0.4"
                    />
                  )}

                  {/* Value readout directly on top of the bar */}
                  <text
                    x={slotCenter}
                    y={Math.max(barY - 8, 30)}
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold ${
                      isSelected
                        ? 'fill-[#17211D] dark:fill-white'
                        : 'fill-[#17211D] dark:fill-[#D1D5DB]'
                    }`}
                  >
                    {p.confidence}%
                  </text>

                  {/* X-axis Milestone Phase Label */}
                  <text
                    x={slotCenter}
                    y="242"
                    textAnchor="middle"
                    className={`text-[10px] font-sans ${
                      isSelected
                        ? 'fill-[#17211D] dark:fill-white font-bold'
                        : 'fill-[#17211D] dark:fill-[#D1D5DB] font-semibold'
                    }`}
                  >
                    {p.phase}
                  </text>

                  {/* X-axis Agent & Timestamp Sublabel */}
                  <text
                    x={slotCenter}
                    y="258"
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-[#38463F] dark:fill-[#9CA3AF]"
                  >
                    {p.agent} • {p.timestamp}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Point Inspection Detail */}
      {activePoint && (
        <div className="mt-4 p-3.5 bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-md bg-white dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-[#17211D] dark:text-white font-bold text-xs flex items-center justify-center shrink-0">
              {activePoint.step}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#17211D] dark:text-[#F3F4F6] uppercase font-sans">
                  {activePoint.phase}
                </span>
                <span className="text-[#8FA097] dark:text-[#4B5563]">•</span>
                <span className="text-[#38463F] dark:text-[#9CA3AF]">
                  Agent: <strong className="text-[#17211D] dark:text-white">{activePoint.agent}</strong>
                </span>
                <span className="text-[#8FA097] dark:text-[#4B5563]">•</span>
                <span className="text-[#38463F] dark:text-[#9CA3AF]">{activePoint.timestamp}</span>
              </div>
              <p className="text-[#38463F] dark:text-[#9CA3AF] text-[11px] font-sans mt-0.5">
                {activePoint.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] uppercase block font-sans font-medium">
                Evidence
              </span>
              <span className="font-semibold text-[#17211D] dark:text-white">
                {activePoint.evidenceCount}
              </span>
            </div>
            <div className="text-right pl-3 border-l border-[#CBD5CF] dark:border-[#292D33]">
              <span className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] uppercase block font-sans font-medium">
                Confidence
              </span>
              <span className="font-bold text-base text-[#176B4D] dark:text-[#34D399]">
                {activePoint.confidence}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
