import { motion } from "framer-motion";
import { ShieldCheck, ListChecks, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";

/**
 * Phase 4's Next Best Action — display + human approval state only.
 *
 * Nothing here executes anything: Approve just records that the founder
 * has signed off on this specific next action; it does not call
 * api/growth/execute.js or any other endpoint. Actually running a Next
 * Best Action is out of scope for this phase (see useEvaluation.js).
 */
export default function NextBestAction({ action, decision, onApprove, onDecline }) {
  if (!action) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[16px] border p-5 sm:p-6"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            {action.type}
          </p>
          <h4 className="mt-1 text-[15px] font-bold text-[var(--sp-text)]">{action.title}</h4>
        </div>
        {action.requiresApproval && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
          >
            <ShieldCheck size={12} />
            Approval required
          </span>
        )}
      </div>

      <p className="mt-3 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{action.reason}</p>

      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
          <ListChecks size={12} />
          Steps
        </p>
        <ol className="mt-2 flex flex-col gap-1.5">
          {action.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-5 text-[var(--sp-text)]">
              <span
                className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div
        className="mt-4 rounded-[12px] border p-3.5"
        style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
      >
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
          <TrendingUp size={12} />
          Expected impact
        </p>
        <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">{action.expectedImpact}</p>
      </div>

      {decision === "approved" ? (
        <div
          className="mt-5 rounded-[12px] border px-4 py-3 text-[12.5px] font-medium"
          style={{ borderColor: "var(--sp-success)", background: "var(--sp-success-soft)", color: "var(--sp-success)" }}
        >
          Approved — nothing has been executed automatically. Running this action is a future step.
        </div>
      ) : decision === "declined" ? (
        <div
          className="mt-5 rounded-[12px] border px-4 py-3 text-[12.5px] font-medium"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)", color: "var(--sp-text-muted)" }}
        >
          Declined. No action will be taken.
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--sp-primary)" }}
          >
            <ThumbsUp size={14} />
            Approve
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex items-center gap-1.5 rounded-[10px] border px-4 py-2.5 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
            style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
          >
            <ThumbsDown size={14} />
            Decline
          </button>
        </div>
      )}
    </motion.div>
  );
}
