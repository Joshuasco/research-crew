import React, { useState } from 'react';
import { useBriefingStream } from './hooks/useBriefingStream';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { ResearchProgression } from './components/ResearchProgression';
import { DashboardHero } from './components/DashboardHero';
import { EvidenceConfidenceGraph } from './components/EvidenceConfidenceGraph';
import { ExecutiveBriefingReport } from './components/ExecutiveBriefingReport';
import { TelemetrySidebar } from './components/TelemetrySidebar';
import { ReviewerDiffViewer } from './components/ReviewerDiffViewer';
import { BriefingForm } from './components/BriefingForm';

export function App() {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const {
    topic,
    isStreaming,
    currentAgent,
    agentStatus,
    statusMessage,
    iteration,
    maxIterations,
    telemetry,
    logs,
    rejections,
    markdownContent,
    error,
    isDemoMode,
    startStream,
    resetState,
    runInteractiveDemo
  } = useBriefingStream();

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-black">
      {/* Top Presentation Header Bar */}
      <Header
        isDemoMode={isDemoMode}
        onReset={resetState}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        {/* STATE 1: Initial Idle / Hero Search View */}
        {!markdownContent && !isStreaming && (
          <HeroSearch
            onStartResearch={(query) => startStream(query)}
            onRunDemo={(query) => runInteractiveDemo(query)}
            isStreaming={isStreaming}
            error={error}
          />
        )}

        {/* STATE 2: Active 3-Agent Research Execution Progression View */}
        {isStreaming && !markdownContent && (
          <ResearchProgression
            topic={topic}
            currentAgent={currentAgent}
            agentStatus={agentStatus}
            statusMessage={statusMessage}
            iteration={iteration}
            maxIterations={maxIterations}
            telemetry={telemetry}
            logs={logs}
          />
        )}

        {/* STATE 3: Presentation Dashboard & Verified Executive Report View */}
        {markdownContent && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Hero Section: Research Question & Confidence KPIs */}
            <DashboardHero
              topic={topic}
              telemetry={telemetry}
              markdownContent={markdownContent}
            />

            {/* Visual Centerpiece: Evidence Confidence Trajectory Graph */}
            <EvidenceConfidenceGraph telemetry={telemetry} />

            {/* Split-Pane Core Presentation Layout */}
            <div className="flex flex-col lg:flex-row items-start w-full overflow-hidden">
              {/* Left Pane (4 Cols when open): Live Telemetry Stream & Reviewer Diff */}
              <div
                className={`transition-all duration-300 ease-in-out shrink-0 ${
                  isTelemetryOpen
                    ? 'w-full lg:w-4/12 opacity-100 translate-x-0 lg:pr-6 mb-6 lg:mb-0'
                    : 'w-0 max-h-0 lg:max-h-none opacity-0 -translate-x-6 overflow-hidden pointer-events-none'
                }`}
              >
                <div className="space-y-4">
                  <TelemetrySidebar
                    currentAgent={currentAgent}
                    agentStatus={agentStatus}
                    statusMessage={statusMessage}
                    iteration={iteration}
                    maxIterations={maxIterations}
                    telemetry={telemetry}
                    logs={logs}
                    rejections={rejections}
                  />

                  {/* Audit Diff Display if rejections occurred */}
                  {rejections && rejections.length > 0 && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                      <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">
                        Reviewer Rejection Audit Log
                      </div>
                      <ReviewerDiffViewer rejections={rejections} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane (Full width when closed, 8 Cols when open): Editorial Executive Briefing Report & Form */}
              <div
                className={`transition-all duration-300 ease-in-out flex flex-col gap-6 ${
                  isTelemetryOpen ? 'w-full lg:w-8/12' : 'w-full'
                }`}
              >
                <ExecutiveBriefingReport
                  markdownContent={markdownContent}
                  topic={topic}
                  agentStatus={agentStatus}
                  isTelemetryOpen={isTelemetryOpen}
                  onToggleTelemetry={() => setIsTelemetryOpen((prev) => !prev)}
                />

                {/* Secondary Query Bar for New Investigations */}
                <BriefingForm
                  onSubmit={startStream}
                  isStreaming={isStreaming}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Presentation Terminal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-3.5 px-4 sm:px-6 text-xs text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-2.5 mt-auto text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <img
            src="/neo-rc-logo.png"
            alt="The Research Crew"
            className="w-4 h-4 object-contain shrink-0"
          />
          <span className="font-sans text-neutral-200 font-semibold">The Research Crew</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="font-sans text-emerald-400 font-normal">Deterministic Multi-Agent Research Platform</span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-4 text-xs text-neutral-400">
          <span><strong className="font-mono text-neutral-300 font-medium">Researcher:</strong> <span className="font-sans">Live Retrieval</span></span>
          <span className="hidden sm:inline">&bull;</span>
          <span><strong className="font-mono text-neutral-300 font-medium">Writer:</strong> <span className="font-sans">Structured Synthesis</span></span>
          <span className="hidden sm:inline">&bull;</span>
          <span><strong className="font-mono text-emerald-400 font-semibold">Reviewer:</strong> <span className="font-sans text-emerald-400 font-medium">&ldquo;The Teeth&rdquo; Audit</span></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
