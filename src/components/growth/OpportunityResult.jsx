import { motion } from "framer-motion";
import { Lightbulb, Target, ShieldCheck, ListChecks, Link2, RotateCcw } from "lucide-react";

function scoreColors(score) {
  if (score >= 75) {
    return { bar: "var(--sp-success)", badgeBg: "var(--sp-success-soft)", badgeColor: "var(--sp-success)", badge: "Strong Opportunity" };
  }
  if (score >= 50) {
    return { bar: "var(--sp-primary)", badgeBg: "var(--sp-primary-soft)", badgeColor: "var(--sp-primary-dark)", badge: "Good Opportunity" };
  }
  if (score >= 30) {
    return { bar: "var(--sp-warning)", badgeBg: "var(--sp-warning-soft)", badgeColor: "var(--sp-warning)", badge: "Modest Opportunity" };
  }
  return { bar: "var(--sp-danger)", badgeBg: "var(--sp-danger-soft)", badgeColor: "var(--sp-danger)", badge: "Needs Groundwork" };
}

function formatCurrency(amount, currency) {
  const symbol = currency === "INR" ? "₹" : `${currency} `;
  const value = Number.isFinite(amount) ? amount.toLocaleString("en-IN") : amount;
  return `${symbol}${value}`;
}

/**
 * Renders the structured JSON result from POST /api/analyze-growth.
 * Phase 1 is strictly read-only: everything here is a proposal for the
 * founder to review, never something the agent has (or will, on this
 * screen) act on.
 */
export default function OpportunityResult({ analysis, onRunAgain }) {
  if (!analysis) return null;

  const colors = scoreColors(analysis.opportunityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <div
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold"
        style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
      >
        <ShieldCheck size={13} />
        Read-only recommendation — nothing has been created or sent
      </div>

      {/* Business understanding + customer segment */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[14px] border p-4" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            Business Understanding
          </p>
          <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">{analysis.businessUnderstanding}</p>
        </div>
        <div className="rounded-[14px] border p-4" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            Customer Segment
          </p>
          <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">{analysis.customerSegment}</p>
        </div>
      </div>

      {/* Opportunity score */}
      <div className="rounded-[16px] border p-5 sm:p-6" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary)]">
              Opportunity Score
            </p>
            <h3 className="mt-1 text-[15.5px] font-bold text-[var(--sp-text)]">
              How strong &amp; actionable this opportunity is
            </h3>
          </div>
          <div
            className="shrink-0 self-start rounded-full px-4 py-1.5 text-[12.5px] font-semibold sm:self-auto"
            style={{ background: colors.badgeBg, color: colors.badgeColor }}
          >
            {colors.badge}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="text-[36px] font-black leading-none text-[var(--sp-text)]">
            {analysis.opportunityScore}
            <span className="text-[18px] text-[var(--sp-primary)]">/100</span>
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: "var(--sp-border)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.opportunityScore}%` }}
              transition={{ duration: 0.7 }}
              className="h-full rounded-full"
              style={{ background: colors.bar }}
            />
          </div>
        </div>
      </div>

      {/* Growth opportunities */}
      <div className="rounded-[14px] border p-4 sm:p-5" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}>
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-[var(--sp-accent)]" />
          <h4 className="text-[13.5px] font-bold text-[var(--sp-text)]">Growth Opportunities</h4>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {analysis.growthOpportunities.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-6 text-[var(--sp-text-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--sp-accent)" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended action + reasoning */}
      <div
        className="rounded-[16px] border p-5 sm:p-6"
        style={{ borderColor: "var(--sp-primary)", background: "var(--sp-primary-soft)" }}
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[var(--sp-primary-dark)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary-dark)]">
            Recommended Commerce Action
          </p>
        </div>
        <h3 className="mt-1.5 text-[16px] font-bold text-[var(--sp-text)]">{analysis.recommendedAction.title}</h3>
        <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text)]">{analysis.recommendedAction.description}</p>

        <div className="mt-4 rounded-[10px] p-3.5" style={{ background: "rgba(255,255,255,0.55)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-primary-dark)]">
            Why this action
          </p>
          <p className="mt-1 text-[12.5px] leading-6 text-[var(--sp-text-muted)]">{analysis.reasoning}</p>
        </div>
      </div>

      {/* Execution steps */}
      <div className="rounded-[14px] border p-4 sm:p-5" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}>
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-[var(--sp-accent)]" />
          <h4 className="text-[13.5px] font-bold text-[var(--sp-text)]">Execution Steps</h4>
        </div>
        <ol className="mt-3 flex flex-col gap-2.5">
          {analysis.executionSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Proposed payment-link parameters (read-only, Phase 1) */}
      <div className="rounded-[14px] border p-4 sm:p-5" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-[var(--sp-text-faint)]" />
          <h4 className="text-[13.5px] font-bold text-[var(--sp-text)]">Proposed Payment-Link Parameters</h4>
        </div>
        <p className="mt-1 text-[12px] leading-5 text-[var(--sp-text-faint)]">
          A starting point for the Approval Panel below — nothing is created until you review, edit if needed, and
          explicitly approve there.
        </p>

        <dl className="mt-3.5 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Product</dt>
            <dd className="mt-0.5 text-[13px] font-medium text-[var(--sp-text)]">{analysis.proposedPaymentLink.productName}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Amount</dt>
            <dd className="mt-0.5 text-[13px] font-medium text-[var(--sp-text)]">
              {formatCurrency(analysis.proposedPaymentLink.amount, analysis.proposedPaymentLink.currency)}
            </dd>
          </div>
          {analysis.proposedPaymentLink.description && (
            <div className="sm:col-span-2">
              <dt className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Description</dt>
              <dd className="mt-0.5 text-[13px] text-[var(--sp-text-muted)]">{analysis.proposedPaymentLink.description}</dd>
            </div>
          )}
        </dl>
      </div>

      {onRunAgain && (
        <button
          type="button"
          onClick={onRunAgain}
          className="inline-flex w-fit items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
          style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
        >
          <RotateCcw size={13} />
          Edit answers &amp; run again
        </button>
      )}
    </motion.div>
  );
}
