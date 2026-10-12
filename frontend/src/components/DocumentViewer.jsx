import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { ExportActions } from './ExportActions';
import { ReviewerDiffViewer } from './ReviewerDiffViewer';

export function DocumentViewer({ markdownContent, topic, rejections, isStreaming, agentStatus }) {
  return (
    <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl flex flex-col h-full overflow-hidden card-shadow">
      {/* Header bar with Export Actions */}
      <div className="bg-[#EEF1EF] dark:bg-[#1F2226] px-5 py-3.5 border-b border-[#CBD5CF] dark:border-[#292D33] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4E5C55] dark:text-[#9CA3AF]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#17211D] dark:text-white">
            Verified Executive Briefing Document
          </h2>
          {markdownContent && agentStatus === 'passed' && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] border border-[#176B4D]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Audited &amp; Approved
            </span>
          )}
        </div>

        {markdownContent && (
          <ExportActions
            markdownContent={markdownContent}
            topic={topic}
            agentStatus={agentStatus}
          />
        )}
      </div>

      {/* Document Content View */}
      <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] scrollbar-thin">
        {/* Rejection Audit Log & Diff Display */}
        {rejections && rejections.length > 0 && (
          <ReviewerDiffViewer rejections={rejections} />
        )}

        {isStreaming && !markdownContent && (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#CBD5CF] dark:border-[#292D33] rounded-xl">
            <div className="w-8 h-8 border-2 border-[#176B4D] border-t-transparent rounded-full animate-spin mb-4" />
            <div className="font-mono text-sm font-bold text-[#17211D] dark:text-white uppercase tracking-wider mb-1">
              Research Crew Assembling Briefing...
            </div>
            <p className="text-xs text-[#38463F] dark:text-[#9CA3AF] max-w-md">
              The Researcher is gathering source data and extracting quantitative metrics. Draft synthesis and Reviewer audit will follow.
            </p>
          </div>
        )}

        {!isStreaming && !markdownContent && (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#CBD5CF] dark:border-[#292D33] rounded-xl">
            <Sparkles className="w-8 h-8 text-[#4E5C55] dark:text-[#9CA3AF] mb-3" />
            <div className="font-mono text-sm font-bold text-[#38463F] dark:text-[#9CA3AF] uppercase tracking-wider mb-1">
              No Briefing Loaded
            </div>
            <p className="text-xs text-[#38463F] dark:text-[#9CA3AF] max-w-md mb-4">
              Enter a research briefing topic above and click <span className="text-[#17211D] dark:text-white font-mono font-bold">Start Crew</span> or click <span className="text-[#176B4D] dark:text-[#34D399] font-mono">⚡ Load Demo Briefing</span>.
            </p>
          </div>
        )}

        {markdownContent && (
          <article className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
