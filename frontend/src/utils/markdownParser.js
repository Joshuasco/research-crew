/**
 * Markdown Parser Utility for Executive Briefings
 * Converts markdown text into structured blocks and inline tokens for PDF/DOCX generation.
 */

export function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

export function tokenizeInline(text) {
  if (!text) return [];
  const tokens = [];
  // Regex matching inline markdown elements: code, bold, italic, links
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+(?<!\*)\*|(?<!_)_[^_]+(?<!_)_|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.substring(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({ text: raw.slice(1, -1), code: true });
    } else if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push({ text: raw.slice(2, -2), bold: true });
    } else if (raw.startsWith('__') && raw.endsWith('__')) {
      tokens.push({ text: raw.slice(2, -2), bold: true });
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push({ text: raw.slice(1, -1), italic: true });
    } else if (raw.startsWith('_') && raw.endsWith('_')) {
      tokens.push({ text: raw.slice(1, -1), italic: true });
    } else if (match[2]) {
      tokens.push({ text: match[2], link: match[3] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ text: text.substring(lastIndex) });
  }

  return tokens;
}

export function parseMarkdownBlocks(markdown) {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Headings: #, ##, ###, etc.
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim()
      });
      i++;
      continue;
    }

    // Blockquote or Alert Callout: > [!NOTE]
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      let tag = null;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        let content = lines[i].trim().replace(/^>\s?/, '');
        const alertMatch = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (alertMatch) {
          tag = alertMatch[1].toUpperCase();
          content = content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i, '').trim();
        }
        if (content) quoteLines.push(content);
        i++;
      }
      blocks.push({
        type: 'callout',
        tag: tag || 'NOTE',
        text: quoteLines.join(' ')
      });
      continue;
    }

    // Tables: | col1 | col2 | ... |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const splitRow = (r) => r.slice(1, -1).split('|').map(c => c.trim());
        const headers = splitRow(tableLines[0]);
        const rows = [];
        for (let r = 2; r < tableLines.length; r++) {
          rows.push(splitRow(tableLines[r]));
        }
        blocks.push({ type: 'table', headers, rows });
        continue;
      }
    }

    // Unordered List items (- item, * item, + item)
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        const listMatch = curr.match(/^[-*+]\s+(.+)$/);
        if (listMatch) {
          items.push(listMatch[1].trim());
          i++;
        } else if (
          curr &&
          !curr.startsWith('#') &&
          !curr.startsWith('|') &&
          !curr.startsWith('>') &&
          !curr.match(/^\d+\.\s+/) &&
          items.length > 0
        ) {
          items[items.length - 1] += ' ' + curr;
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    // Ordered List items (1. item, 2. item, etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        const listMatch = curr.match(/^\d+\.\s+(.+)$/);
        if (listMatch) {
          items.push(listMatch[1].trim());
          i++;
        } else if (
          curr &&
          !curr.startsWith('#') &&
          !curr.startsWith('|') &&
          !curr.startsWith('>') &&
          !curr.match(/^[-*+]\s+/) &&
          items.length > 0
        ) {
          items[items.length - 1] += ' ' + curr;
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    // Regular Paragraphs
    const paraLines = [];
    while (i < lines.length) {
      const curr = lines[i].trim();
      if (
        !curr ||
        curr.startsWith('#') ||
        curr.startsWith('>') ||
        (curr.startsWith('|') && curr.endsWith('|')) ||
        curr.match(/^[-*+]\s+/) ||
        curr.match(/^\d+\.\s+/) ||
        /^(---|___|\*\*\*)$/.test(curr)
      ) {
        break;
      }
      paraLines.push(curr);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paraLines.join(' ')
      });
    }
  }

  return blocks;
}
