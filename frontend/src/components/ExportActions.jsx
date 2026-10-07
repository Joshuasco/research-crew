import React, { useState } from 'react';
import { Download, FileText, Check, Copy, Share2 } from 'lucide-react';
import { downloadDocument, sanitizeFilename } from '../utils/fileExport';

export function ExportActions({ markdownContent, topic }) {
  const [copied, setCopied] = useState(false);

  if (!markdownContent) return null;

  const baseFilename = sanitizeFilename(topic);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <button
        onClick={() => downloadDocument(markdownContent, baseFilename, 'md')}
        className="px-3 py-1.5 rounded bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        title="Download Client-Side Blob (.md)"
      >
        <Download className="w-3.5 h-3.5" />
        Download .MD
      </button>

      <button
        onClick={() => downloadDocument(markdownContent, baseFilename, 'txt')}
        className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Download Client-Side Blob (.txt)"
      >
        <FileText className="w-3.5 h-3.5" />
        Download .TXT
      </button>

      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Copy Markdown to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy Text
          </>
        )}
      </button>
    </div>
  );
}
