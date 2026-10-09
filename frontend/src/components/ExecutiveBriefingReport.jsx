import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Eye,
  Code
} from 'lucide-react';
import { ExportActions } from './ExportActions';
import { parseMarkdownBlocks, stripMarkdown } from '../utils/markdownParser';

export function ExecutiveBriefingReport({ markdownContent, topic, agentStatus }) {
  const [viewMode, setViewMode] = useState('executive'); // 'executive' | 'raw'

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
    let title = 'Identified Risk';
    let body = rawItem;
    let mitigation = null;

    const boldMatch = rawItem.match(/^[*_]{2}([^*_]+)[*_]{2}[:–—\s]*(.+)$/);
    if (boldMatch) {
      title = boldMatch[1].trim();
      body = boldMatch[2].trim();
    } else {
      const dashMatch = rawItem.match(/^([^:–—]+)[:–—]\s*(.+)$/);
      if (dashMatch) {
        title = dashMatch[1].trim();
        body = dashMatch[2].trim();
      }
    }

    const mitMatch = body.match(/[*_]?Mitigation[:*_\s]*([^*_\n]+)[*_]?/i);
    if (mitMatch) {
      mitigation = mitMatch[1].trim();
      body = body.replace(/[*_]?Mitigation[:*_\s]*([^*_\n]+)[*_]?/i, '').trim();
    }

    return { title, body, mitigation };
  };

  // Helper to highlight bold text inside regular strings
  const renderInlineStyled = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-emerald-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="text-neutral-300 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="font-mono text-xs px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-teal-300">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col overflow-hidden shadow-2xl">
      {/* Top Document Header Bar with View Toggle and Export Toolbar */}
      <div className="bg-neutral-900/90 px-5 py-3.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/neo-rc-logo.png"
            alt="The Research Crew Logo"
            className="w-4 h-4 object-contain"
          />
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-white">
            Verified Executive Briefing Document
          </h2>
          {agentStatus === 'passed' && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Audited & Approved
            </span>
          )}
        </div>

        {/* View Toggle & Export Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle between Executive Presentation and Raw Markdown */}
          <div className="flex items-center bg-neutral-950 rounded border border-neutral-800 p-0.5 font-sans text-xs font-medium">
            <button
              onClick={() => setViewMode('executive')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'executive'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Editorial Executive Presentation View"
            >
              <Eye className="w-3 h-3" />
              Executive View
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Raw Markdown Source View"
            >
              <Code className="w-3 h-3" />
              Raw Source
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
      <div className="p-6 md:p-8 overflow-y-auto max-h-[850px] scrollbar-thin text-neutral-200">
        {viewMode === 'raw' ? (
          /* Raw Markdown View */
          <article className="prose prose-invert prose-neutral max-w-none prose-headings:font-mono prose-headings:uppercase prose-h1:text-xl prose-table:border prose-table:border-neutral-800 prose-th:bg-neutral-900 prose-td:border-neutral-800 text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </article>
        ) : (
          /* High-End Editorial Executive Report View */
          <div className="space-y-10 max-w-5xl mx-auto">
            {sections.map((section, sIdx) => {
              const headingLower = section.heading.toLowerCase();

              // 1. EXECUTIVE SUMMARY
              if (headingLower.includes('executive summary')) {
                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-bold">
                        Section 01
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'paragraph') {
                        return (
                          <p key={bIdx} className="text-base md:text-lg text-neutral-200 font-sans leading-relaxed">
                            {renderInlineStyled(b.text)}
                          </p>
                        );
                      }
                      if (b.type === 'callout') {
                        return (
                          <div
                            key={bIdx}
                            className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-emerald-200 text-xs md:text-sm leading-relaxed flex items-start gap-3 glow-emerald-sm my-3"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
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
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-bold">
                        Section 02
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'paragraph') {
                        return (
                          <p key={bIdx} className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed">
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
                                  className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800/90 flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                      {title}
                                    </div>
                                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
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
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-bold">
                        Section 03
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    {section.blocks.map((b, bIdx) => {
                      if (b.type === 'table') {
                        return (
                          <div key={bIdx} className="my-4 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950">
                            <table className="w-full text-left font-sans text-xs border-collapse">
                              <thead>
                                <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-300 font-semibold uppercase tracking-wider">
                                  {b.headers.map((h, hIdx) => (
                                    <th key={hIdx} className="px-4 py-3 font-semibold">
                                      {stripMarkdown(h)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-900">
                                {b.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className={`transition-colors hover:bg-neutral-900/50 ${
                                      rIdx % 2 === 1 ? 'bg-neutral-950' : 'bg-neutral-900/30'
                                    }`}
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-4 py-3 text-neutral-300 font-normal">
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
                          <h3 key={bIdx} className="text-sm font-sans font-semibold uppercase tracking-wider text-neutral-300 mt-6 mb-2">
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
                                  className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800 flex items-start gap-3"
                                >
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                                  <div>
                                    <div className="font-sans text-xs font-semibold text-white uppercase">
                                      {title}
                                    </div>
                                    <div className="text-xs text-neutral-400 font-sans font-normal mt-0.5 leading-relaxed">
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
                          <p key={bIdx} className="text-xs md:text-sm text-neutral-400 font-sans leading-relaxed">
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
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase font-bold">
                        Section 04
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
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
                                className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-start justify-between gap-4"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 font-sans text-xs font-semibold text-amber-300 uppercase">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>{title}</span>
                                  </div>
                                  <div className="text-xs text-neutral-300 font-sans font-normal leading-relaxed pl-5">
                                    <span className="text-neutral-500 uppercase font-mono text-[10px] font-medium block mb-0.5">
                                      Risk Vector:
                                    </span>
                                    {renderInlineStyled(body)}
                                  </div>
                                </div>

                                {mitigation && (
                                  <div className="w-full md:w-80 bg-neutral-950 p-3 rounded border border-neutral-800 shrink-0 text-xs font-sans">
                                    <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                                      Verified Mitigation Protocol:
                                    </span>
                                    <span className="text-neutral-300 font-sans font-normal leading-relaxed">
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
                            <p key={bIdx} className="text-xs md:text-sm text-neutral-400 font-sans font-normal leading-relaxed">
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
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-semibold">
                        Section 05
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
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
                                className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-neutral-800/80">
                                    <span className="font-sans text-xs font-semibold text-white uppercase">
                                      {title}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-emerald-400">
                                      0{itemIdx + 1}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-300 font-sans font-normal leading-relaxed">
                                    {renderInlineStyled(body)}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        }
                        if (b.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="col-span-3 text-xs md:text-sm text-neutral-400 font-sans font-normal leading-relaxed">
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
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-semibold">
                        Section 06
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold font-sans text-white uppercase tracking-tight">
                        {section.heading}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      {section.blocks.map((b, bIdx) => {
                        if (b.type === 'list') {
                          return b.items.map((item, itemIdx) => {
                            const badgeMatch = item.match(/^(?:\d+\.\s*)?(?:\*\*|\*)?\[([^\]]+)\](?:\*\*|\*)?\s*(.+)$/);
                            const badge = badgeMatch ? badgeMatch[1] : `Source ${itemIdx + 1}`;
                            const citation = badgeMatch ? badgeMatch[2] : item;

                            return (
                              <div
                                key={`${bIdx}-${itemIdx}`}
                                className="p-3 rounded-md bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-neutral-800 text-teal-300 border border-neutral-700">
                                    {badge}
                                  </span>
                                  <span className="text-neutral-300 font-sans font-normal text-xs leading-relaxed">
                                    {renderInlineStyled(citation)}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono font-medium text-neutral-500 uppercase shrink-0">
                                  Verified
                                </span>
                              </div>
                            );
                          });
                        }
                        if (b.type === 'paragraph') {
                          return (
                            <p key={bIdx} className="text-xs text-neutral-400 font-mono">
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
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight border-b border-neutral-800 pb-1">
                    {section.heading}
                  </h2>
                  {section.blocks.map((b, bIdx) => {
                    if (b.type === 'paragraph') {
                      return (
                        <p key={bIdx} className="text-sm text-neutral-300 leading-relaxed font-sans">
                          {renderInlineStyled(b.text)}
                        </p>
                      );
                    }
                    if (b.type === 'list') {
                      return (
                        <ul key={bIdx} className="space-y-1.5 pl-4 list-disc text-xs text-neutral-300">
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
