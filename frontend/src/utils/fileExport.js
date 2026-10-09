/**
 * Client-Side Document Export Utility
 * Uses HTML5 Blob API and client-side document generators to trigger instant browser downloads.
 * Supports Markdown (.md), Plain Text (.txt), Portable Document Format (.pdf), and Microsoft Word (.docx).
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  Packer
} from 'docx';
import { parseMarkdownBlocks, tokenizeInline, stripMarkdown } from './markdownParser.js';

/**
 * Downloads a document in browser using HTML5 Blob & ObjectURL.
 * Supports string content and binary Blob instances.
 */
export function downloadDocument(content, filename, format = 'md') {
  if (!content) return content;
  if (typeof document === 'undefined') return content;

  const mimeTypes = {
    md: 'text/markdown;charset=utf-8;',
    txt: 'text/plain;charset=utf-8;',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };

  const extension = format.startsWith('.') ? format : `.${format}`;
  const finalFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`;

  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: mimeTypes[format] || mimeTypes.md });

  if (typeof window !== 'undefined' && window.URL) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', finalFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return blob;
}

/**
 * Clean and sanitize a topic string into a web-safe, OS-safe filename.
 * Produces clean hyphen-delimited slugs: e.g. commercial-fusion-energy-reactor-benchmarks-timeline
 */
export function sanitizeFilename(topic) {
  if (!topic) return 'research-briefing';
  const clean = topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
    .replace(/-+$/, '');
  return clean || 'research-briefing';
}

/**
 * Export briefing document as Markdown (.md)
 */
export function exportMarkdown(content, topic) {
  if (!content) return;
  const filename = sanitizeFilename(topic);
  downloadDocument(content, filename, 'md');
}

/**
 * Export briefing document as Plain Text (.txt)
 */
export function exportText(content, topic) {
  if (!content) return;
  const filename = sanitizeFilename(topic);
  downloadDocument(content, filename, 'txt');
}

/**
 * Measures styled token line count to calculate box height before drawing.
 */
function measureStyledTokens(doc, tokens, maxWidth, lineHeight, fontSize) {
  doc.setFontSize(fontSize);
  let lineX = 0;
  let linesCount = 1;
  const words = [];
  tokens.forEach((tok) => {
    const parts = tok.text.split(/(\s+)/);
    parts.forEach((p) => {
      if (p) words.push({ ...tok, text: p, isSpace: /^\s+$/.test(p) });
    });
  });

  for (const w of words) {
    const fontStyle = w.bold && w.italic ? 'bolditalic' : (w.bold ? 'bold' : (w.italic ? 'italic' : 'normal'));
    doc.setFont('helvetica', fontStyle);
    const wWidth = doc.getTextWidth(w.text);

    if (!w.isSpace && lineX + wWidth > maxWidth) {
      linesCount++;
      lineX = 0;
    }

    if (!w.isSpace || lineX > 0) {
      lineX += wWidth;
    }
  }
  return linesCount * lineHeight;
}

/**
 * Export briefing document as a professional PDF (.pdf)
 */
export async function exportPdf(content, topic, options = {}) {
  if (!content) return;

  const blocks = parseMarkdownBlocks(content);
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const pageWidth = 612;
  const pageHeight = 792;
  const leftMargin = 44;
  const rightMargin = 44;
  const topMargin = 50;
  const bottomMargin = 48;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  const maxY = pageHeight - bottomMargin;
  let curY = topMargin;

  const isAudited = options.isAudited !== false;
  const topicTitle = topic || 'Verified Executive Briefing';

  function checkPageBreak(neededSpace = 20) {
    if (curY + neededSpace > maxY) {
      doc.addPage();
      curY = topMargin;
      return true;
    }
    return false;
  }

  // --- Document Header on Page 1 ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('THE RESEARCH CREW  |  AUTONOMOUS RESEARCH BRIEFING', leftMargin, curY);
  curY += 16;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(topicTitle, contentWidth);
  doc.text(titleLines, leftMargin, curY);
  curY += titleLines.length * 20 + 4;

  // Metadata & Status Badge
  if (isAudited) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.75);
    doc.roundedRect(leftMargin, curY, 118, 18, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105);
    doc.text('AUDITED & APPROVED', leftMargin + 8, curY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Multi-Agent OpenRouter Free Pipeline`, leftMargin + 128, curY + 12);
    curY += 28;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Deterministic Multi-Agent Synthesis`, leftMargin, curY + 10);
    curY += 24;
  }

  // Accent Rule
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(leftMargin, curY, leftMargin + contentWidth, curY);
  curY += 16;

  // Helper to render styled inline tokens
  function renderStyledTokens(tokens, startX, maxWidth, lineHeight, fontSize = 9.5) {
    doc.setFontSize(fontSize);
    let lineX = startX;
    const words = [];
    tokens.forEach((tok) => {
      const parts = tok.text.split(/(\s+)/);
      parts.forEach((p) => {
        if (p) words.push({ ...tok, text: p, isSpace: /^\s+$/.test(p) });
      });
    });

    for (const w of words) {
      const fontStyle = w.bold && w.italic ? 'bolditalic' : (w.bold ? 'bold' : (w.italic ? 'italic' : 'normal'));
      doc.setFont('helvetica', fontStyle);
      const wWidth = doc.getTextWidth(w.text);

      if (!w.isSpace && lineX + wWidth > startX + maxWidth) {
        curY += lineHeight;
        if (curY > maxY) {
          doc.addPage();
          curY = topMargin + 10;
        }
        lineX = startX;
      }

      if (!w.isSpace || lineX > startX) {
        doc.text(w.text, lineX, curY);
        lineX += wWidth;
      }
    }
    curY += lineHeight;
  }

  // --- Render Parsed Blocks ---
  for (const block of blocks) {
    if (block.type === 'heading') {
      checkPageBreak(block.level === 1 ? 55 : 35);
      curY += block.level === 1 ? 14 : 10;
      doc.setFont('helvetica', 'bold');

      if (block.level === 1) {
        doc.setFontSize(12.5);
        doc.setTextColor(15, 23, 42);
        doc.text(block.text.toUpperCase(), leftMargin, curY);
        curY += 5;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.75);
        doc.line(leftMargin, curY, leftMargin + contentWidth, curY);
        curY += 12;
      } else if (block.level === 2) {
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(block.text, leftMargin, curY);
        curY += 10;
      } else {
        checkPageBreak(25);
        curY += 6;
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text(block.text, leftMargin, curY);
        curY += 12;
      }
      doc.setTextColor(51, 65, 85);
    } else if (block.type === 'paragraph') {
      checkPageBreak(25);
      doc.setTextColor(51, 65, 85);
      const tokens = tokenizeInline(block.text);
      renderStyledTokens(tokens, leftMargin, contentWidth, 13.5, 9.5);
      curY += 6;
    } else if (block.type === 'callout') {
      checkPageBreak(40);
      const tokens = tokenizeInline(block.text);
      const boxX = leftMargin;
      const boxW = contentWidth;
      const allTokens = [{ text: `[${block.tag}] `, bold: true }, ...tokens];
      const boxH = measureStyledTokens(doc, allTokens, boxW - 24, 13, 9) + 16;

      checkPageBreak(boxH);
      const boxStartY = curY;

      // Draw background & left accent border
      doc.setFillColor(248, 250, 252);
      doc.rect(boxX, boxStartY, boxW, boxH, 'F');
      doc.setFillColor(16, 185, 129);
      doc.rect(boxX, boxStartY, 3, boxH, 'F');

      curY = boxStartY + 12;
      doc.setTextColor(30, 41, 59);
      renderStyledTokens(allTokens, boxX + 12, boxW - 24, 13, 9);
      curY = boxStartY + boxH + 10;
    } else if (block.type === 'list') {
      checkPageBreak(20);
      doc.setTextColor(51, 65, 85);
      block.items.forEach((item, idx) => {
        checkPageBreak(18);
        const prefix = block.ordered ? `${idx + 1}. ` : '• ';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(prefix, leftMargin + 2, curY);

        const tokens = tokenizeInline(item);
        const indentX = leftMargin + 16;
        renderStyledTokens(tokens, indentX, contentWidth - 16, 13.5, 9.5);
        curY += 3;
      });
      curY += 6;
    } else if (block.type === 'table') {
      checkPageBreak(60);
      const head = [block.headers.map((h) => stripMarkdown(h))];
      const body = block.rows.map((row) => row.map((cell) => stripMarkdown(cell)));

      autoTable(doc, {
        startY: curY,
        head,
        body,
        margin: { left: leftMargin, right: rightMargin },
        theme: 'plain',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
          cellPadding: 5.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
          cellPadding: 5,
          lineColor: [226, 232, 240],
          lineWidth: 0.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'auto'
        }
      });
      curY = doc.lastAutoTable.finalY + 22;
    } else if (block.type === 'hr') {
      checkPageBreak(15);
      curY += 4;
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, curY, leftMargin + contentWidth, curY);
      curY += 12;
    }
  }

  // --- Running Headers & Footers across all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);

    // Running footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, pageHeight - 34, leftMargin + contentWidth, pageHeight - 34);

    doc.text('Confidential  •  The Research Crew Multi-Agent Pipeline', leftMargin, pageHeight - 22);
    const pageStr = `Page ${p} of ${totalPages}`;
    doc.text(pageStr, pageWidth - rightMargin - doc.getTextWidth(pageStr), pageHeight - 22);

    // Running header on page 2+
    if (p > 1) {
      doc.text('THE RESEARCH CREW  •  VERIFIED EXECUTIVE BRIEFING', leftMargin, 30);
      const hdrStatus = 'AUDITED & APPROVED';
      doc.text(hdrStatus, pageWidth - rightMargin - doc.getTextWidth(hdrStatus), 30);
      doc.line(leftMargin, 36, leftMargin + contentWidth, 36);
    }
  }

  const blob = doc.output('blob');
  const filename = sanitizeFilename(topic);
  downloadDocument(blob, filename, 'pdf');
}

/**
 * Export briefing document as a professional Microsoft Word document (.docx)
 */
export async function exportDocx(content, topic, options = {}) {
  if (!content) return;

  const blocks = parseMarkdownBlocks(content);
  const isAudited = options.isAudited !== false;
  const topicTitle = topic || 'Verified Executive Briefing';

  const docxChildren = [
    new Paragraph({
      text: topicTitle,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: isAudited ? 'STATUS: AUDITED & APPROVED' : 'STATUS: SYNTHESIS COMPLETE',
          bold: true,
          color: isAudited ? '059669' : '4B5563'
        }),
        new TextRun({
          text: `  |  Date: ${new Date().toLocaleDateString()}  |  Architecture: Deterministic Audit Engine`,
          color: '6B7280'
        })
      ],
      spacing: { after: 260 }
    })
  ];

  for (const block of blocks) {
    if (block.type === 'heading') {
      const headingLevel = block.level === 1
        ? HeadingLevel.HEADING_1
        : (block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3);

      docxChildren.push(new Paragraph({
        text: block.text,
        heading: headingLevel,
        spacing: { before: block.level === 1 ? 260 : 180, after: 120 }
      }));
    } else if (block.type === 'paragraph') {
      const tokens = tokenizeInline(block.text);
      docxChildren.push(new Paragraph({
        children: tokens.map((t) => new TextRun({
          text: t.text,
          bold: t.bold,
          italics: t.italic,
          font: t.code ? 'Consolas' : undefined
        })),
        spacing: { after: 140, line: 260 }
      }));
    } else if (block.type === 'callout') {
      const tokens = tokenizeInline(block.text);
      docxChildren.push(new Paragraph({
        children: [
          new TextRun({ text: `[${block.tag}] `, bold: true, color: '059669' }),
          ...tokens.map((t) => new TextRun({ text: t.text, bold: t.bold, italics: t.italic }))
        ],
        indent: { left: 720 },
        border: {
          left: { color: '10B981', size: 24, style: BorderStyle.SINGLE, space: 10 }
        },
        shading: { fill: 'F8FAFC' },
        spacing: { before: 120, after: 160 }
      }));
    } else if (block.type === 'list') {
      block.items.forEach((item, idx) => {
        const tokens = tokenizeInline(item);
        if (block.ordered) {
          docxChildren.push(new Paragraph({
            indent: { left: 720, hanging: 360 },
            children: [
              new TextRun({ text: `${idx + 1}. `, bold: true }),
              ...tokens.map((t) => new TextRun({
                text: t.text,
                bold: t.bold,
                italics: t.italic,
                font: t.code ? 'Consolas' : undefined
              }))
            ],
            spacing: { after: 80 }
          }));
        } else {
          docxChildren.push(new Paragraph({
            bullet: { level: 0 },
            children: tokens.map((t) => new TextRun({
              text: t.text,
              bold: t.bold,
              italics: t.italic,
              font: t.code ? 'Consolas' : undefined
            })),
            spacing: { after: 80 }
          }));
        }
      });
    } else if (block.type === 'table') {
      const tableRows = [];
      // Header row with dark fill & white text
      tableRows.push(new TableRow({
        tableHeader: true,
        children: block.headers.map((h) => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: stripMarkdown(h), bold: true, color: 'FFFFFF' })]
          })],
          shading: { fill: '0F172A' },
          margins: { top: 120, bottom: 120, left: 140, right: 140 }
        }))
      }));

      // Editable data rows with parsed inline bold formatting
      block.rows.forEach((row, rIdx) => {
        tableRows.push(new TableRow({
          children: row.map((cell) => {
            const tokens = tokenizeInline(cell);
            return new TableCell({
              children: [new Paragraph({
                children: tokens.map((t) => new TextRun({
                  text: t.text,
                  bold: t.bold,
                  italics: t.italic,
                  font: t.code ? 'Consolas' : undefined
                }))
              })],
              shading: rIdx % 2 === 1 ? { fill: 'F9FAFB' } : undefined,
              margins: { top: 100, bottom: 100, left: 140, right: 140 }
            });
          })
        }));
      });

      docxChildren.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows
      }));
      docxChildren.push(new Paragraph({ text: '', spacing: { after: 160 } }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            text: 'THE RESEARCH CREW — VERIFIED EXECUTIVE BRIEFING',
            alignment: AlignmentType.RIGHT
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun('Confidential • Audited & Approved Briefing                    Page '),
              PageNumber.CURRENT,
              new TextRun(' of '),
              PageNumber.TOTAL_PAGES
            ],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      children: docxChildren
    }]
  });

  const blob = await Packer.toBlob(doc);
  const filename = sanitizeFilename(topic);
  downloadDocument(blob, filename, 'docx');
}
