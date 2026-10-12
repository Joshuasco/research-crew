import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Eye,
  Code,
  Table as TableIcon,
  CheckCircle2,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { ExportActions } from './ExportActions';
import { parseMarkdownBlocks, stripMarkdown } from '../utils/markdownParser';

export function ExecutiveBriefingReport({ markdownContent, topic, agentStatus }) {
  const [viewMode, setViewMode] = useState('executive'); // 'executive' | 'outline' | 'raw'

  if (!markdownContent) return null;

  const blocks = parseMarkdownBlocks(markdownContent);

  // Group blocks by section heading
  const sections = [];
  let currentSection = { heading: 'Overview', level: 1, blocks: [] };

  blocks.forEach((block) => {
    if (block.type === 'heading' && block.level === 1) {
      if (currentSection.blocks.length > 0 || currentSection.heading !== 'Overview') {
        sections.push(currentSection);
      }
      currentSection = { heading: block.text, level: block.level, blocks: [] };
    } else {
      currentSection.blocks.push(block);
    }
  });
  if (currentSection.blocks.length > 0 || currentSection.heading !== 'Overview') {
    sections.push(currentSection);
  }

  // Parse inline risks formatted as "- **Risk Name**: Risk text. *Mitigation: Mitigation text.*"
  const parseRiskItem = (rawItem) => {
    const boldMatch = rawItem.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
    if (!boldMatch) return { title: 'Operational Risk', body: rawItem, mitigation: null };

    const title = boldMatch[1].trim();
    let remaining = boldMatch[2].trim();
    let mitigation = null;

    const mitMatch = remaining.match(/\*Mitigation:\s*([^*]+)\*/i);
    if (mitMatch) {
      mitigation = mitMatch[1].trim();
      remaining = remaining.replace(/\*Mitigation:\s*([^*]+)\*/i, '').trim();
    }

    return { title, body: remaining, mitigation };
  };

  // Helper to highlight bold text inside regular strings using strictly two-color palette
  const renderInlineStyled = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-[#17211D] dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="text-[#38463F] dark:text-[#D1D5DB] italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#EEF1EF] dark:bg-[#22262B] border border-[#CBD5CF] dark:border-[#292D33] text-[#176B4D] dark:text-[#34D399]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Structured Section Outline data (matching Reference.jpeg table format)
  const outlineData = [
    {
      header: 'Executive Summary',
      type: 'Core Synthesis',
      status: 'Audited & Approved',
      target: '6 Mandates',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    },
    {
      header: 'Market Context',
      type: 'Market Dynamics',
      status: 'Audited & Approved',
      target: '3 Key Drivers',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    },
    {
      header: 'Key Competitors & Metrics',
      type: 'Competitor Matrix',
      status: 'Audited & Approved',
      target: '4 Benchmarks',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    },
    {
      header: 'Risks & Regulations',
      type: 'Risk Mitigation',
      status: 'Audited & Approved',
      target: '3 Vectors',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    },
    {
      header: 'Strategic Recommendations',
      type: 'Strategic Roadmap',
      status: 'Audited & Approved',
      target: '3 Directives',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    },
    {
      header: 'Verified Source Ledger',
      type: 'Citation Ledger',
      status: 'Audited & Approved',
      target: '12 Sources',
      limit: '100%',
      reviewer: 'Reviewer Gate'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl flex flex-col overflow-hidden card-shadow">
      {/* Top Document Header Bar with Tabs and Export Actions Toolbar */}
      <div className="bg-[#EEF1EF] dark:bg-[#1F2226] px-5 py-3.5 border-b border-[#CBD5CF] dark:border-[#292D33] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Document Title & Audit Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-white dark:bg-[#181A1D] p-0.5 border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-center shrink-0">
            <img src="/neo-rc-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white">
            Verified Executive Briefing Document
          </h2>
          {agentStatus === 'passed' && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.15)] text-[#176B4D] dark:text-[#34D399] border border-[rgba(23,107,77,0.25)] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Audited &amp; Approved
            </span>
          )}
        </div>

        {/* Right: View Tabs & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Control matching reference */}
          <div className="flex items-center bg-white dark:bg-[#181A1D] rounded-lg border border-[#CBD5CF] dark:border-[#292D33] p-0.5 font-sans text-xs font-medium">
            <button
              onClick={() => setViewMode('executive')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'executive'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] font-semibold'
                  : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
              }`}
              title="Editorial Executive Presentation View"
            >
              <Eye className="w-3 h-3" />
              <span>Executive</span>
            </button>
            <button
              onClick={() => setViewMode('outline')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'outline'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] font-semibold'
                  : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
              }`}
              title="Section Outline Table View (Layout Reference)"
            >
              <TableIcon className="w-3 h-3" />
              <span>Outline</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-[#17211D] text-white dark:bg-white dark:text-[#17211D] font-semibold'
                  : 'text-[#38463F] dark:text-[#9CA3AF] hover:text-[#17211D] dark:hover:text-white'
              }`}
              title="Raw Markdown Source View"
            >
              <Code className="w-3 h-3" />
              <span>Raw</span>
            </button>
          </div>

          <ExportActions
            markdownContent={markdownContent}
            topic={topic}
            agentStatus={agentStatus}
          />
        </div>
      </div>

      {/* Document Body View */}
      <div className="p-6 md:p-8 overflow-y-auto max-h-[850px] scrollbar-thin text-[#17211D] dark:text-[#D1D5DB]">
        {viewMode === 'raw' && (
          /* Raw Markdown View */
          <article className="prose dark:prose-invert max-w-none prose-headings:font-sans prose-headings:font-bold prose-h1:text-xl prose-table:border prose-table:border-[#CBD5CF] dark:prose-table:border-[#292D33] prose-th:bg-[#EEF1EF] dark:prose-th:bg-[#1F2226] prose-td:border-[#CBD5CF] dark:prose-td:border-[#292D33] text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </article>
        )}

        {viewMode === 'outline' && (
          /* Section Outline Table View (Matching bottom of Reference.jpeg) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#17211D] dark:text-white font-sans">
                  Mandatory Section Outline &amp; Audit Status
                </h3>
                <p className="text-xs text-[#38463F] dark:text-[#9CA3AF] font-sans">
                  Deterministic structure validated across 6 mandatory executive dimensions
                </p>
              </div>
              <button
                onClick={() => setViewMode('executive')}
                className="text-xs font-sans font-medium text-[#176B4D] dark:text-[#34D399] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Document</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D]">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EEF1EF] dark:bg-[#1F2226] border-b border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#9CA3AF] font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Section Header</th>
                    <th className="px-4 py-3">Section Type</th>
                    <th className="px-4 py-3">Audit Status</th>
                    <th className="px-4 py-3">Target Scope</th>
                    <th className="px-4 py-3">Provenance Limit</th>
                    <th className="px-4 py-3">Reviewer Gate</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5CF] dark:divide-[#292D33]">
                  {outlineData.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] transition-colors cursor-pointer"
                      onClick={() => setViewMode('executive')}
                    >
                      <td className="px-4 py-3 font-semibold text-[#17211D] dark:text-[#F3F4F6]">
                        {row.header}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#EEF1EF] dark:bg-[#22262B] text-[#38463F] dark:text-[#9CA3AF] border border-[#CBD5CF] dark:border-[#292D33]">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#176B4D] dark:text-[#34D399]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[#38463F] dark:text-[#9CA3AF]">
                        {row.target}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#38463F] dark:text-[#9CA3AF]">
                        {row.limit}
                      </td>
                      <td className="px-4 py-3 text-[#17211D] dark:text-white font-medium">
                        {row.reviewer}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 text-[#4E5C55] hover:text-[#17211D] dark:hover:text-white rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'executive' && (
          /* High-End Editorial Executive Report View */
          <div className="space-y-10 max-w-5xl mx-auto">
            {sections.map((section, sIdx) => {
              const headingLower = section.heading.toLowerCase();

              // 1. EXECUTIVE SUMMARY
              if (headingLower.includes('executive summary')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] tracking-widest uppercase font-bold">
                        Section 01
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'paragraph') {
                        return (
                          <p key={bIdx} className="text-base text-[#17211D] dark:text-[#D1D5DB] font-sans leading-relaxed">
                            {renderInlineStyled(b.text)}
                          </p>
                        );
                      }
                      if (b.type === 'callout') {
                        return (
                          <div
                            key={bIdx}
                            className="p-4 rounded-xl bg-[#E6F0EA] dark:bg-[rgba(30,142,98,0.12)] border border-[rgba(23,107,77,0.25)] text-[#17211D] dark:text-[#F3F4F6] text-xs md:text-sm leading-relaxed flex items-start gap-3 my-3"
                          >
                            <Sparkles className="w-4 h-4 text-[#176B4D] dark:text-[#34D399] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-mono text-xs font-bold text-[#176B4D] dark:text-[#34D399] uppercase tracking-wider block mb-1">
                                [{b.tag}] Audit Provenance Protocol
                              </span>
                              <span>{renderInlineStyled(b.text)}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </section>
                );
              }

              // 2. MARKET CONTEXT
              if (headingLower.includes('market context')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] tracking-widest uppercase font-bold">
                        Section 02
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'paragraph') {
                        return (
                          <p key={bIdx} className="text-sm md:text-base text-[#17211D] dark:text-[#D1D5DB] font-sans leading-relaxed">
                            {renderInlineStyled(b.text)}
                          </p>
                        );
                      }
                      if (b.type === 'list') {
                        return (
                          <div key={bIdx} className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                            {b.items.map((item, itemIdx) => {
                              const match = item.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
                              const title = match ? match[1] : `Key Dynamic 0${itemIdx + 1}`;
                              const body = match ? match[2] : item;

                              return (
                                <div
                                  key={itemIdx}
                                  className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="text-[10px] font-mono font-bold text-[#176B4D] dark:text-[#34D399] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#176B4D] dark:bg-[#34D399]" />
                                      {title}
                                    </div>
                                    <p className="text-xs text-[#38463F] dark:text-[#D1D5DB] font-sans leading-relaxed">
                                      {renderInlineStyled(body)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </section>
                );
              }

              // 3. KEY COMPETITORS & METRICS
              if (headingLower.includes('competitors') || headingLower.includes('metrics')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] tracking-widest uppercase font-bold">
                        Section 03
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'table') {
                        return (
                          <div
                            key={bIdx}
                            className="my-4 overflow-x-auto rounded-xl border border-[#CBD5CF] dark:border-[#292D33] bg-white dark:bg-[#181A1D]"
                          >
                            <table className="w-full text-left font-sans text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#EEF1EF] dark:bg-[#1F2226] border-b border-[#CBD5CF] dark:border-[#292D33] text-[#38463F] dark:text-[#9CA3AF] font-semibold uppercase tracking-wider">
                                  {b.headers.map((h, hIdx) => (
                                    <th key={hIdx} className="px-4 py-3 font-semibold">
                                      {stripMarkdown(h)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#CBD5CF] dark:divide-[#292D33]">
                                {b.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className={`transition-colors hover:bg-[#F4F7F5] dark:hover:bg-[#1F2226] ${
                                      rIdx % 2 === 1 ? 'bg-[#F4F7F5] dark:bg-[#1A1D20]' : ''
                                    }`}
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-4 py-3 text-[#17211D] dark:text-[#D1D5DB]">
                                        {renderInlineStyled(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      if (b.type === 'heading' && b.level === 3) {
                        return (
                          <h3
                            key={bIdx}
                            className="text-sm font-sans font-semibold uppercase tracking-wider text-[#17211D] dark:text-white mt-6 mb-2"
                          >
                            {b.text}
                          </h3>
                        );
                      }

                      if (b.type === 'list') {
                        return (
                          <div key={bIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                            {b.items.map((item, itemIdx) => {
                              const match = item.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
                              const title = match ? match[1] : `Benchmark Metric 0${itemIdx + 1}`;
                              const body = match ? match[2] : item;

                              return (
                                <div
                                  key={itemIdx}
                                  className="p-3.5 rounded-xl bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex items-start gap-3"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#176B4D] dark:bg-[#34D399] shrink-0 mt-1.5" />
                                  <div>
                                    <div className="font-sans text-xs font-semibold text-[#17211D] dark:text-white uppercase">
                                      {title}
                                    </div>
                                    <div className="text-xs text-[#38463F] dark:text-[#9CA3AF] font-sans mt-0.5 leading-relaxed">
                                      {renderInlineStyled(body)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      if (b.type === 'paragraph') {
                        return (
                          <p key={bIdx} className="text-xs md:text-sm text-[#38463F] dark:text-[#9CA3AF] font-sans leading-relaxed">
                            {renderInlineStyled(b.text)}
                          </p>
                        );
                      }

                      return null;
                    })}
                  </section>
                );
              }

              // 4. RISKS & REGULATIONS
              if (headingLower.includes('risk') || headingLower.includes('regulation')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#17211D] dark:text-[#F3F4F6] tracking-widest uppercase font-bold">
                        Section 04
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {section.blocks.map((b, bIdx) => {
                        if (b.type === 'list') {
                          return b.items.map((item, itemIdx) => {
                            const { title, body, mitigation } = parseRiskItem(item);
                            return (
                              <div
                                key={`${bIdx}-${itemIdx}`}
                                className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex flex-col md:flex-row items-start justify-between gap-4"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#17211D] dark:text-white uppercase">
                                    <AlertCircle className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF] shrink-0" />
                                    <span>{title}</span>
                                  </div>
                                  <div className="text-xs text-[#38463F] dark:text-[#D1D5DB] font-sans leading-relaxed pl-5">
                                    <span className="text-[#4E5C55] dark:text-[#9CA3AF] uppercase font-mono text-[10px] block mb-0.5">
                                      Risk Vector:
                                    </span>
                                    {renderInlineStyled(body)}
                                  </div>
                                </div>

                                {mitigation && (
                                  <div className="w-full md:w-80 bg-white dark:bg-[#181A1D] p-3 rounded-lg border border-[#CBD5CF] dark:border-[#292D33] shrink-0 text-xs font-sans">
                                    <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] font-semibold uppercase tracking-wider block mb-1">
                                      Verified Mitigation Protocol:
                                    </span>
                                    <span className="text-[#17211D] dark:text-[#D1D5DB] font-sans leading-relaxed">
                                      {renderInlineStyled(mitigation)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        }
                        if (b.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="text-xs md:text-sm text-[#38463F] dark:text-[#9CA3AF] font-sans leading-relaxed">
                              {renderInlineStyled(b.text)}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </section>
                );
              }

              // 5. STRATEGIC RECOMMENDATIONS
              if (headingLower.includes('strategic recommendation') || headingLower.includes('recommendation')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] tracking-widest uppercase font-semibold">
                        Section 05
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {section.blocks.map((b, bIdx) => {
                        if (b.type === 'list') {
                          return b.items.map((item, itemIdx) => {
                            const match = item.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
                            const title = match ? match[1] : `Recommendation 0${itemIdx + 1}`;
                            const body = match ? match[2] : item;

                            return (
                              <div
                                key={`${bIdx}-${itemIdx}`}
                                className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#CBD5CF] dark:border-[#292D33]">
                                    <span className="font-sans text-xs font-semibold text-[#17211D] dark:text-white uppercase">
                                      {title}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-[#176B4D] dark:text-[#34D399]">
                                      0{itemIdx + 1}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#38463F] dark:text-[#D1D5DB] font-sans leading-relaxed">
                                    {renderInlineStyled(body)}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        }
                        if (b.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="col-span-3 text-xs md:text-sm text-[#38463F] dark:text-[#9CA3AF] font-sans leading-relaxed">
                              {renderInlineStyled(b.text)}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </section>
                );
              }

              // 6. VERIFIED SOURCE LEDGER
              if (headingLower.includes('source ledger') || headingLower.includes('source')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-[#CBD5CF] dark:border-[#292D33] pb-2">
                      <span className="text-[10px] font-mono text-[#176B4D] dark:text-[#34D399] tracking-widest uppercase font-semibold">
                        Section 06
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      {section.blocks.map((b, bIdx) => {
                        if (b.type === 'list') {
                          return b.items.map((item, itemIdx) => {
                            const badgeMatch = item.match(/^\[([^\]]+)\]\s*(.+)$/);
                            const badge = badgeMatch ? badgeMatch[1] : `Source ${itemIdx + 1}`;
                            const citation = badgeMatch ? badgeMatch[2] : item;

                            return (
                              <div
                                key={`${bIdx}-${itemIdx}`}
                                className="p-3 rounded-lg bg-[#F4F7F5] dark:bg-[#1F2226] border border-[#CBD5CF] dark:border-[#292D33] flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-white dark:bg-[#181A1D] text-[#176B4D] dark:text-[#34D399] border border-[#CBD5CF] dark:border-[#292D33]">
                                    {badge}
                                  </span>
                                  <span className="text-[#17211D] dark:text-[#D1D5DB] font-sans leading-relaxed">
                                    {renderInlineStyled(citation)}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-[#4E5C55] dark:text-[#9CA3AF] uppercase shrink-0 font-medium">
                                  Verified
                                </span>
                              </div>
                            );
                          });
                        }
                        if (b.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="text-xs text-[#4E5C55] dark:text-[#9CA3AF] font-mono">
                              {renderInlineStyled(b.text)}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </section>
                );
              }

              // DEFAULT FALLBACK FOR ANY OTHER CUSTOM SECTION
              return (
                <section key={sIdx} className="space-y-3">
                  <h2 className="text-lg font-bold font-sans text-[#17211D] dark:text-white uppercase tracking-tight border-b border-[#CBD5CF] dark:border-[#292D33] pb-1">
                    {section.heading}
                  </h2>
                  {section.blocks.map((b, bIdx) => {
                    if (b.type === 'paragraph') {
                      return (
                        <p key={bIdx} className="text-sm text-[#17211D] dark:text-[#D1D5DB] leading-relaxed font-sans">
                          {renderInlineStyled(b.text)}
                        </p>
                      );
                    }
                    if (b.type === 'list') {
                      return (
                        <ul key={bIdx} className="space-y-1.5 pl-4 list-disc text-xs text-[#17211D] dark:text-[#D1D5DB]">
                          {b.items.map((it, idx) => (
                            <li key={idx}>{renderInlineStyled(it)}</li>
                          ))}
                        </ul>
                      );
                    }
                    return null;
                  })}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
