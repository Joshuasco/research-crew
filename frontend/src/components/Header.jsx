import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function Header({ isDemoMode, onReset }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rc_theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('rc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md text-white px-4 sm:px-6 py-3 sm:py-3.5 flex flex-row items-center justify-between gap-3 sm:gap-4 sticky top-0 z-50">
      {/* Brand & Mission Tagline (Clickable to Landing Page) */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2.5 sm:gap-3.5 text-left cursor-pointer hover:opacity-85 transition-opacity focus:outline-none min-w-0"
        title="Return to Landing Page"
      >
        <img
          src="/neo-rc-logo.png"
          alt="The Research Crew Logo"
          className="w-9 h-9 object-contain shrink-0 rounded drop-shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-sans text-sm md:text-base font-bold tracking-tight uppercase text-white">
              The Research Crew
            </h1>
            {isDemoMode && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                ⚡ Demo Mode Active
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Right Header Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-300" />
          )}
        </button>
      </div>
    </header>
  );
}
