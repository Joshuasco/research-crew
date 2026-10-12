import React, { useState } from 'react';
import { Download, FileText, Check, Copy, FileDown, Loader2, AlertCircle } from 'lucide-react';
import {
  exportMarkdown,
  exportText,
  exportPdf,
  exportDocx
} from '../utils/fileExport';

export function ExportActions({ markdownContent, topic, agentStatus }) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [toast, setToast] = useState(null);

  if (!markdownContent) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await exportPdf(markdownContent, topic, { isAudited: agentStatus === 'passed' });
    } catch (err) {
      console.error('PDF export failed:', err);
      setToast({ type: 'error', message: 'Failed to generate PDF document. Please try again.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsGeneratingDocx(true);
      await exportDocx(markdownContent, topic, { isAudited: agentStatus === 'passed' });
    } catch (err) {
      console.error('DOCX export failed:', err);
      setToast({ type: 'error', message: 'Failed to generate DOCX document. Please try again.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 font-sans text-xs">
        {/* Download .MD (Primary Action) */}
        <button
          onClick={() => exportMarkdown(markdownContent, topic)}
          className="px-2.5 py-1.5 rounded-lg bg-[#176B4D] hover:bg-[#12563D] text-white dark:bg-white dark:text-[#17211D] dark:hover:bg-neutral-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Download Client-Side Blob (.md)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>.MD</span>
        </button>

        {/* Download .TXT */}
        <button
          onClick={() => exportText(markdownContent, topic)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Download Plain Text (.txt)"
        >
          <FileText className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
          <span>.TXT</span>
        </button>

        {/* Download .PDF */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Download Formatted PDF (.pdf)"
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#176B4D]" />
          ) : (
            <FileDown className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
          )}
          <span>.PDF</span>
        </button>

        {/* Download .DOCX */}
        <button
          onClick={handleDownloadDocx}
          disabled={isGeneratingDocx}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Download Microsoft Word Document (.docx)"
        >
          {isGeneratingDocx ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#176B4D]" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
          )}
          <span>.DOCX</span>
        </button>

        {/* Copy Text */}
        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181A1D] text-[#17211D] dark:text-[#D1D5DB] hover:bg-[#F4F7F5] dark:hover:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Copy Markdown to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#34D399]" />
              <span className="text-[#176B4D] dark:text-[#34D399] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Non-blocking error notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#17211D] text-white border border-[#374151] text-xs font-sans shadow-xl">
          <AlertCircle className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-[#9CA3AF] hover:text-white cursor-pointer font-bold"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
