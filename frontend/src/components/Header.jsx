import React from 'react';
import {
  PanelLeft,
  ShieldCheck,
  Zap,
  RotateCcw,
  Cpu,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/useTheme';

export function Header({
  isStreaming,
  isDemoMode,
  onRunDemo,
  onLoadDemo,
  onReset,
  onToggleSidebar,
  pageTitle = 'Documents'
}) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="h-14 px-4 md:px-6 bg-white dark:bg-[#181A1D] border-b border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Sidebar Toggle + Title Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white hover:bg-[#EEF1EF] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle navigation sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#CBD5CF] dark:bg-[#292D33]" />

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm font-semibold text-[#17211D] dark:text-[#F3F4F6] font-sans truncate">
            {pageTitle}
          </h1>

          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-[#EEF1EF] dark:bg-[#22262B] text-[#38463F] dark:text-[#9CA3AF] border border-[#CBD5CF] dark:border-[#292D33] flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#4E5C55]" />
              Free Tier
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] border border-[rgba(23,107,77,0.25)] dark:border-[rgba(30,142,98,0.3)] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Audit Gate Active
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-[#EEF1EF] dark:bg-[#22262B] text-[#17211D] dark:text-white border border-[#CBD5CF] dark:border-[#292D33]">
                ⚡ Demo Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions, GitHub Reference Link & Accessible Theme Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRunDemo}
          disabled={isStreaming}
          className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-sans font-medium rounded-md border border-[rgba(23,107,77,0.3)] bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] hover:bg-[#D8E8DF] dark:hover:bg-[rgba(30,142,98,0.25)] disabled:opacity-40 transition-colors items-center gap-1.5 cursor-pointer"
          title="Run full 3-agent progression simulation for audience presentations"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Interactive Demo</span>
        </button>

        <button
          onClick={onLoadDemo}
          disabled={isStreaming}
          className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-sans font-medium rounded-md border border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] disabled:opacity-40 transition-colors items-center gap-1.5 cursor-pointer font-semibold"
          title="Instantly load cached verified briefing without waiting"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4E5C55]" />
          <span>Instant Briefing</span>
        </button>

        <button
          onClick={onReset}
          className="p-1.5 md:px-2.5 md:py-1.5 text-xs font-sans font-medium rounded-md border border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D] text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Reset to clean initial research prompt"
          aria-label="Reset research demo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        {/* GitHub link matching reference screenshot */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-medium text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white px-2 py-1.5 transition-colors"
          title="View on GitHub"
        >
          <span>GitHub</span>
        </a>

        <div className="h-4 w-px bg-[#CBD5CF] dark:bg-[#292D33]" />

        {/* Accessible Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white hover:bg-[#EEF1EF] dark:hover:bg-[#22262B] border border-transparent hover:border-[#CBD5CF] dark:hover:border-[#292D33] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#F3F4F6]" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-[#17211D]" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
