/**
 * Client-Side Document Export Utility
 * Uses HTML5 Blob API to trigger instant zero-backend browser downloads.
 */

export function downloadDocument(content, filename, format = 'md') {
  if (!content) return;

  const mimeTypes = {
    md: 'text/markdown;charset=utf-8;',
    txt: 'text/plain;charset=utf-8;'
  };

  const extension = format.startsWith('.') ? format : `.${format}`;
  const finalFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`;
  
  const blob = new Blob([content], { type: mimeTypes[format] || mimeTypes.md });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', finalFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function sanitizeFilename(topic) {
  if (!topic) return 'research_briefing';
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 40) + '_briefing';
}
