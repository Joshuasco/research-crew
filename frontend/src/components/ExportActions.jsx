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
    navigator.clipboard.writeText(markdownContent);
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
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 font-sans text-xs">
        {/* Download .MD */}
        <button
          onClick={() => exportMarkdown(markdownContent, topic)}
          className="px-2.5 py-1.5 rounded bg-white text-black font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Download Client-Side Blob (.md)"
        >
          <Download className="w-3.5 h-3.5" />
          Download .MD
        </button>

        {/* Download .TXT */}
        <button
          onClick={() => exportText(markdownContent, topic)}
          className="px-2.5 py-1.5 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Download Client-Side Blob (.txt)"
        >
          <FileText className="w-3.5 h-3.5" />
          Download .TXT
        </button>

        {/* Download .PDF */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="px-2.5 py-1.5 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Download Professional Formatted Report (.pdf)"
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
          ) : (
            <FileDown className="w-3.5 h-3.5 text-neutral-300" />
          )}
          Download .PDF
        </button>

        {/* Download .DOCX */}
        <button
          onClick={handleDownloadDocx}
          disabled={isGeneratingDocx}
          className="px-2.5 py-1.5 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Download Microsoft Word Document (.docx)"
        >
          {isGeneratingDocx ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-neutral-300" />
          )}
          Download .DOCX
        </button>

        {/* Copy Text */}
        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Copy Markdown to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Text
            </>
          )}
        </button>
      </div>

      {/* Non-blocking error notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-red-700 text-red-200 text-xs font-sans font-normal shadow-2xl animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-neutral-400 hover:text-white cursor-pointer font-bold"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
