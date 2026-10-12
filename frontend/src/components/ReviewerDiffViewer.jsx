import React from 'react';
import { ShieldAlert, AlertCircle, ArrowRight } from 'lucide-react';

export function ReviewerDiffViewer({ rejections }) {
  if (!rejections || rejections.length === 0) return null;

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#1C2025] border border-[#CBD5CF] dark:border-[#292D33] rounded-xl p-4 my-4 text-xs font-sans card-shadow">
      <div className="flex items-center justify-between border-b border-[#CBD5CF] dark:border-[#292D33] pb-2.5 mb-3">
        <div className="flex items-center gap-2 text-[#17211D] dark:text-[#F3F4F6] font-semibold uppercase tracking-wider text-xs">
          <ShieldAlert className="w-4 h-4 text-[#17211D] dark:text-[#F3F4F6]" />
          Reviewer Rejection Audit Log (&ldquo;The Teeth&rdquo;)
        </div>
        <span className="bg-[#17211D] dark:bg-white text-white dark:text-[#17211D] px-2 py-0.5 rounded-md text-[10px] font-mono font-medium">
          {rejections.length} Rejection Notice(s) Logged
        </span>
      </div>

      <div className="space-y-3">
        {rejections.map((rej, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#181A1D] border border-[#CBD5CF] dark:border-[#292D33] rounded-lg p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#17211D] dark:text-[#F3F4F6] font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#4E5C55] dark:text-[#9CA3AF]" />
                Iteration {rej.iteration} Audit Failure: {rej.audit_dimension || 'Claim Verification'}
              </span>
              <span className="text-[#4E5C55] dark:text-[#9CA3AF] text-[10px]">{rej.timestamp}</span>
            </div>

            {/* Line-item failed claim */}
            {rej.failed_line && (
              <div className="bg-[#EEF1EF] dark:bg-[#22262B] border-l-2 border-[#17211D] dark:border-[#F3F4F6] p-2.5 text-[#17211D] dark:text-[#F3F4F6] text-xs">
                <div className="text-[10px] text-[#4E5C55] dark:text-[#9CA3AF] font-mono font-medium uppercase mb-0.5">
                  Rejected Draft Assertion:
                </div>
                <div className="italic font-mono text-xs">&ldquo;{rej.failed_line}&rdquo;</div>
              </div>
            )}

            {/* Line-item remediation note */}
            {rej.remediation_note && (
              <div className="bg-[#F4F7F5] dark:bg-[#1C2025] border border-[#CBD5CF] dark:border-[#292D33] p-2.5 rounded-md text-[#17211D] dark:text-[#D1D5DB] text-xs">
                <div className="text-[10px] text-[#176B4D] dark:text-[#34D399] font-mono font-semibold uppercase mb-0.5 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#176B4D] dark:text-[#34D399]" />
                  Mandatory Writer Remediation Instruction:
                </div>
                <div className="font-sans font-normal leading-relaxed">{rej.remediation_note}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
