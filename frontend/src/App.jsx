import React, { useState, useRef } from 'react';
import { useBriefingStream } from './hooks/useBriefingStream';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSearch } from './components/HeroSearch';
import { ResearchProgression } from './components/ResearchProgression';
import { DashboardHero } from './components/DashboardHero';
import { EvidenceConfidenceGraph } from './components/EvidenceConfidenceGraph';
import { ExecutiveBriefingReport } from './components/ExecutiveBriefingReport';
import { TelemetrySidebar } from './components/TelemetrySidebar';
import { ReviewerDiffViewer } from './components/ReviewerDiffViewer';
import { BriefingForm } from './components/BriefingForm';

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
    loadDemoBriefing,
    runInteractiveDemo
  } = useBriefingStream();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const trajectoryRef = useRef(null);
  const reportRef = useRef(null);
  const telemetryRef = useRef(null);
  const auditRef = useRef(null);
  const promptRef = useRef(null);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);

    if (sectionId === 'analytics' && trajectoryRef.current) {
      trajectoryRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if ((sectionId === 'report' || sectionId === 'briefing') && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'telemetry' && telemetryRef.current) {
      telemetryRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'audit' && auditRef.current) {
      auditRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'dashboard' || sectionId === 'projects') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickCreate = () => {
    if (markdownContent) {
      if (promptRef.current) {
        promptRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1EF] dark:bg-[#0F1113] text-[#17211D] dark:text-[#F3F4F6] flex transition-colors font-sans selection:bg-[#176B4D] selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onQuickCreate={handleQuickCreate}
        isStreaming={isStreaming}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Presentation Header Bar */}
        <Header
          isStreaming={isStreaming}
          isDemoMode={isDemoMode}
          onRunDemo={() => runInteractiveDemo(topic || 'Commercial Fusion Energy Reactor Benchmarks & Timeline')}
          onLoadDemo={() => loadDemoBriefing(topic || 'Commercial Fusion Energy Reactor Benchmarks & Timeline')}
          onReset={resetState}
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen(!sidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          pageTitle="Documents"
        />

        {/* Dashboard Main Canvas */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
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
            <div className="flex flex-col gap-6">
              {/* Hero Section: Research Question & 4 Compact KPI Cards */}
              <DashboardHero
                topic={topic}
                telemetry={telemetry}
                agentStatus={agentStatus}
              />

              {/* Visual Centerpiece: Evidence Confidence Trajectory Graph Card */}
              <div ref={trajectoryRef}>
                <EvidenceConfidenceGraph />
              </div>

              {/* Split-Pane Core Presentation Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Right Pane (8 Cols Desktop / Order 1): Editorial Executive Briefing Report & Outline */}
                <div ref={reportRef} className="lg:col-span-8 flex flex-col order-1">
                  <ExecutiveBriefingReport
                    markdownContent={markdownContent}
                    topic={topic}
                    agentStatus={agentStatus}
                  />
                </div>

                {/* Left Pane (4 Cols Desktop / Order 2): Live Telemetry Stream & Reviewer Diff */}
                <div className="lg:col-span-4 space-y-4 order-2">
                  <div ref={telemetryRef}>
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

                  {/* Audit Diff Display if rejections occurred */}
                  {rejections && rejections.length > 0 && (
                    <div ref={auditRef}>
                      <ReviewerDiffViewer rejections={rejections} />
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Query Bar for New Investigations */}
              <div ref={promptRef} className="mt-4 pt-4 border-t border-[#CBD5CF] dark:border-[#292D33]">
                <div className="max-w-4xl mx-auto">
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
        <footer className="border-t border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D] py-3.5 px-6 text-xs text-[#38463F] dark:text-[#9CA3AF] flex flex-col md:flex-row items-center justify-between gap-2 mt-auto transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-[#EEF1EF] dark:bg-[#22262B] p-0.5 border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-center">
              <img
                src="/neo-rc-logo.png"
                alt="The Research Crew"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-sans text-[#17211D] dark:text-white font-semibold">
              The Research Crew
            </span>
            <span>&bull;</span>
            <span className="font-sans text-[#176B4D] dark:text-[#34D399]">
              Deterministic Multi-Agent Research Platform
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>
              <strong className="font-mono text-[#17211D] dark:text-white font-medium">Researcher:</strong> Live Retrieval
            </span>
            <span>&bull;</span>
            <span>
              <strong className="font-mono text-[#17211D] dark:text-white font-medium">Writer:</strong> Structured Synthesis
            </span>
            <span>&bull;</span>
            <span>
              <strong className="font-mono text-[#176B4D] dark:text-[#34D399] font-semibold">Reviewer:</strong> &ldquo;The Teeth&rdquo; Audit
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
