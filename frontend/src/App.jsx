import React from 'react';
import { useBriefingStream } from './hooks/useBriefingStream';
import { Header } from './components/Header';
import { BriefingForm } from './components/BriefingForm';
import { TelemetrySidebar } from './components/TelemetrySidebar';
import { DocumentViewer } from './components/DocumentViewer';

export function App() {
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
    loadDemoBriefing
  } = useBriefingStream();

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top Monochrome Header */}
      <Header
        isStreaming={isStreaming}
        isDemoMode={isDemoMode}
        onLoadDemo={loadDemoBriefing}
        onReset={resetState}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col">
        {/* Research Briefing Input Form */}
        <BriefingForm
          onSubmit={startStream}
          isStreaming={isStreaming}
          error={error}
        />

        {/* Split-Pane Core UI Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[650px]">
          {/* Left Pane: Agent Telemetry & Progress Feed (4 Cols) */}
          <div className="lg:col-span-4">
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
          </div>

          {/* Right Pane: Verified Executive Briefing Document Viewer (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <DocumentViewer
              markdownContent={markdownContent}
              topic={topic}
              rejections={rejections}
              isStreaming={isStreaming}
              agentStatus={agentStatus}
            />
          </div>
        </div>
      </main>

      {/* Footer System Contract Specs */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-center text-xs font-mono text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          <span className="text-neutral-400 font-bold">The Research Crew</span> &bull; Multi-Agent OpenRouter Free Model Pipeline
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Researcher: Live Facts</span>
          <span>&bull;</span>
          <span>Writer: Synthesis</span>
          <span>&bull;</span>
          <span className="text-amber-400 font-bold">Reviewer: "The Teeth" Audit</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
