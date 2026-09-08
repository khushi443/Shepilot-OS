import { motion } from "framer-motion";
import { FlaskConical, CheckCircle2, AlertCircle } from "lucide-react";

// Same outcome vocabulary as ExecutionResult.jsx's STATUS_STYLES, plus
// "unknown" — this is a Razorpay Test Mode payment-link outcome, not a
// business/revenue outcome. See api/growth/evaluate.js for how `outcome`
// is derived directly from the real Razorpay status rather than from the
// AI's own judgment.
const OUTCOME_STYLES = {
  created: { bg: "var(--sp-primary-soft)", color: "var(--sp-primary-dark)", label: "Created" },
  partially_paid: { bg: "var(--sp-accent-soft)", color: "var(--sp-accent)", label: "Partially Paid (Test Mode)" },
  paid: { bg: "var(--sp-success-soft)", color: "var(--sp-success)", label: "Paid (Test Mode)" },
  cancelled: { bg: "var(--sp-danger-soft)", color: "var(--sp-danger)", label: "Cancelled" },
  expired: { bg: "var(--sp-danger-soft)", color: "var(--sp-danger)", label: "Expired" },
  unknown: { bg: "var(--sp-surface-muted)", color: "var(--sp-text-faint)", label: "Unknown" },
};

/**
 * Result of the Phase 4 evaluation. Displays only what the server actually
 * returned — outcome, summary, what worked/didn't, business signal, and a
 * confidence score. Deliberately does NOT interpret or embellish any of
 * this further on the client; the Test Mode honesty rules live server-side
 * in api/growth/evaluate.js.
 */
export default function EvaluationResult({ evaluation }) {
  if (!evaluation) return null;

  const outcomeStyle = OUTCOME_STYLES[evaluation.outcome] || OUTCOME_STYLES.unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[16px] border p-5 sm:p-6"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
    >
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em]"
        style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
      >
        <FlaskConical size={13} />
        Based on Razorpay Test Mode data only — not verified business revenue
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
          style={{ background: outcomeStyle.bg, color: outcomeStyle.color }}
        >
          {outcomeStyle.label}
        </span>
        <span className="text-[12px] text-[var(--sp-text-faint)]">
          Confidence: <strong className="text-[var(--sp-text)]">{evaluation.confidence}%</strong>
        </span>
      </div>

      <p className="mt-4 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{evaluation.summary}</p>

      {evaluation.what_worked.length > 0 && (
        <div className="mt-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            What worked
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {evaluation.what_worked.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-5 text-[var(--sp-text)]">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--sp-success)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.what_did_not_work.length > 0 && (
        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            What needs improvement
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {evaluation.what_did_not_work.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-5 text-[var(--sp-text)]">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-[var(--sp-warning)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="mt-5 rounded-[12px] border p-3.5"
        style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
      >
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
          Business signal
        </p>
        <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">{evaluation.business_signal}</p>
      </div>
    </motion.div>
  );
}
