import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { ExportActions } from './ExportActions';
import { ReviewerDiffViewer } from './ReviewerDiffViewer';

export function DocumentViewer({ markdownContent, topic, rejections, isStreaming, agentStatus }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col h-full overflow-hidden">
      {/* Header bar with Export Actions */}
      <div className="bg-neutral-950 px-5 py-3.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-neutral-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Verified Executive Briefing Document
          </h2>
          {markdownContent && agentStatus === 'passed' && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Audited & Approved
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
      <div className="p-6 overflow-y-auto flex-1 bg-neutral-950 text-neutral-200 scrollbar-thin">
        {/* Rejection Audit Log & Diff Display */}
        {rejections && rejections.length > 0 && (
          <ReviewerDiffViewer rejections={rejections} />
        )}

        {isStreaming && !markdownContent && (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-800 rounded-lg">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1">
              Research Crew Assembling Briefing...
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              The Researcher is gathering source data and extracting quantitative metrics. Draft synthesis and Reviewer audit will follow.
            </p>
          </div>
        )}

        {!isStreaming && !markdownContent && (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-800 rounded-lg">
            <Sparkles className="w-8 h-8 text-neutral-600 mb-3" />
            <div className="font-mono text-sm font-bold text-neutral-300 uppercase tracking-wider mb-1">
              No Briefing Loaded
            </div>
            <p className="text-xs text-neutral-500 max-w-md mb-4">
              Enter a research briefing topic above and click <span className="text-white font-mono font-bold">Start Crew</span> or click <span className="text-amber-400 font-mono">⚡ Load Demo Briefing</span>.
            </p>
          </div>
        )}

        {markdownContent && (
          <article className="prose prose-invert prose-neutral max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wider prose-h1:text-xl prose-h1:border-b prose-h1:border-neutral-800 prose-h1:pb-2 prose-h1:mt-6 prose-h1:first:mt-0 prose-h2:text-base prose-table:border prose-table:border-neutral-800 prose-th:bg-neutral-900 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-neutral-800 text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
