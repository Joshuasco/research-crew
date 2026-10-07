import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export function ReviewerDiffViewer({ rejections }) {
  if (!rejections || rejections.length === 0) return null;

  return (
    <div className="bg-red-950/20 border border-red-900/60 rounded-lg p-4 my-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-red-900/40 pb-2.5 mb-3">
        <div className="flex items-center gap-2 text-red-300 font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          Reviewer Rejection Audit Log ("The Teeth")
        </div>
        <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px]">
          {rejections.length} Rejection Notice(s) Logged
        </span>
      </div>

      <div className="space-y-4">
        {rejections.map((rej, index) => (
          <div key={index} className="bg-neutral-950 border border-red-900/50 rounded-md p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Iteration {rej.iteration} Audit Failure: {rej.audit_dimension || 'Claim Verification'}
              </span>
              <span className="text-neutral-500 text-[10px]">{rej.timestamp}</span>
            </div>

            {/* Line-item failed claim */}
            {rej.failed_line && (
              <div className="bg-red-950/40 border-l-2 border-red-500 p-2 text-red-200 text-xs font-sans">
                <div className="text-[10px] text-red-400 font-mono uppercase mb-0.5">Rejected Draft Assertion:</div>
                <div className="italic font-mono">"{rej.failed_line}"</div>
              </div>
            )}

            {/* Line-item remediation note */}
            {rej.remediation_note && (
              <div className="bg-neutral-900 border border-neutral-800 p-2 rounded text-neutral-300 text-xs font-sans">
                <div className="text-[10px] text-emerald-400 font-mono uppercase mb-0.5 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  Mandatory Writer Remediation Instruction:
                </div>
                <div>{rej.remediation_note}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
