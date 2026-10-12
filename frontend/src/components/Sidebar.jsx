import React from 'react';
import {
  LayoutDashboard,
  GitBranch,
  TrendingUp,
  Folder,
  Users,
  Database,
  FileText,
  ShieldCheck,
  MoreHorizontal,
  Settings,
  HelpCircle,
  Search,
  Plus,
  X
} from 'lucide-react';

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  _onToggleCollapse,
  activeSection,
  onSelectSection,
  onQuickCreate,
  isStreaming
}) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Lifecycle', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'team', label: 'Team', icon: Users },
  ];

  const documentNavItems = [
    { id: 'briefing', label: 'Data Library', icon: Database },
    { id: 'report', label: 'Reports', icon: FileText },
    { id: 'audit', label: 'Word Assistant', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen shrink-0 bg-white dark:bg-[#181A1D] border-r border-[#CBD5CF] dark:border-[#292D33] flex flex-col transition-all duration-200 select-none ${
          isCollapsed ? 'w-[68px]' : 'w-64'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Organization Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#CBD5CF] dark:border-[#292D33]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EEF1EF] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-center shrink-0 p-1">
              <img
                src="/neo-rc-logo.png"
                alt="The Research Crew Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#17211D] dark:text-[#F3F4F6] truncate flex items-center gap-1 font-sans">
                  <span>The Research Crew</span>
                </div>
                <div className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] truncate font-sans">
                  Verified Intelligence
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-[#4E5C55] hover:text-[#17211D] dark:hover:text-white rounded-md cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Quick Create / New Research */}
        <div className="p-3">
          <button
            onClick={onQuickCreate}
            disabled={isStreaming}
            className={`w-full py-2 px-3 rounded-full bg-[#17211D] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-[#17211D] text-xs font-medium font-sans flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
              isCollapsed ? 'px-0 justify-center' : ''
            }`}
            title="Start New Research Investigation"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Quick Create</span>}
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-none">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium font-sans transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F0EA] dark:bg-[#1E3A2F] text-[#17211D] dark:text-white font-semibold'
                      : 'text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#176B4D] dark:text-[#34D399]' : ''}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Documents / Data Library Group */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-semibold text-[#4E5C55] dark:text-[#9CA3AF] uppercase tracking-wider font-sans">
                Documents
              </div>
            )}
            <div className="space-y-0.5">
              {documentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium font-sans transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#E6F0EA] dark:bg-[#1E3A2F] text-[#17211D] dark:text-white font-semibold'
                        : 'text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={item.label}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#176B4D] dark:text-[#34D399]' : ''}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
              {!isCollapsed && (
                <button
                  onClick={() => onSelectSection('telemetry')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium font-sans text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                  <span>More</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Utility Items */}
        <div className="p-3 border-t border-[#CBD5CF] dark:border-[#292D33] space-y-0.5">
          <button
            onClick={() => onSelectSection('settings')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium font-sans text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => onSelectSection('help')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium font-sans text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Get Help"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Get Help</span>}
          </button>

          <button
            onClick={() => onSelectSection('search')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium font-sans text-[#38463F] dark:text-[#9CA3AF] hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] hover:text-[#17211D] dark:hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Search"
          >
            <Search className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Search</span>}
          </button>
        </div>

        {/* User Profile Footer (matching shadcn CN block in reference) */}
        <div className="p-3 border-t border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D]">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-[#CBD5CF] dark:bg-[#292D33] text-[#17211D] dark:text-[#F3F4F6] font-semibold text-xs flex items-center justify-center shrink-0 font-sans">
              RC
            </div>
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#17211D] dark:text-[#F3F4F6] truncate font-sans">
                    Research Crew
                  </div>
                  <div className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] truncate font-mono">
                    crew@rc.local
                  </div>
                </div>
                <button
                  className="p-1 text-[#4E5C55] hover:text-[#17211D] dark:hover:text-white rounded cursor-pointer"
                  title="User Menu"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
