import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Copy, Check, RotateCw } from "lucide-react";
import ErrorCard from "../ui/ErrorCard";

// Razorpay Payment Link statuses: https://razorpay.com/docs/payment-links/
const STATUS_STYLES = {
  created: { bg: "var(--sp-primary-soft)", color: "var(--sp-primary-dark)", label: "Created" },
  partially_paid: { bg: "var(--sp-accent-soft)", color: "var(--sp-accent)", label: "Partially Paid" },
  paid: { bg: "var(--sp-success-soft)", color: "var(--sp-success)", label: "Paid" },
  cancelled: { bg: "var(--sp-danger-soft)", color: "var(--sp-danger)", label: "Cancelled" },
  expired: { bg: "var(--sp-danger-soft)", color: "var(--sp-danger)", label: "Expired" },
};

function formatAmount(amount, currency) {
  const symbol = currency === "INR" ? "₹" : `${currency} `;
  const value = Number.isFinite(amount) ? amount.toLocaleString("en-IN") : amount;
  return `${symbol}${value}`;
}

/**
 * Result of the Phase 3 real execution — a genuine Razorpay Payment Link,
 * created in Razorpay TEST MODE only (see api/growth/execute.js). This
 * component displays it and lets the founder poll (via "Check Status")
 * its live status from Razorpay, via api/growth/status.js.
 */
export default function ExecutionResult({ result, onCheckStatus, checkingStatus, statusError }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const statusStyle = STATUS_STYLES[result.status] || STATUS_STYLES.created;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

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
        Razorpay Test Mode — real payment link behavior, no real money
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            Razorpay Payment Link
          </p>
          <p className="mt-1 truncate text-[13.5px] font-medium text-[var(--sp-primary)]">{result.shortUrl}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
          style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
        >
          {copied ? (
            <>
              <Check size={14} className="text-[var(--sp-success)]" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border p-3.5" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Status</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {statusStyle.label}
            </span>
          </div>
        </div>

        <div className="rounded-[12px] border p-3.5" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Amount</p>
          <p className="mt-1.5 text-[13.5px] font-semibold text-[var(--sp-text)]">
            {formatAmount(result.amount, result.currency)}
          </p>
        </div>

        <div className="rounded-[12px] border p-3.5 sm:col-span-2" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Description</p>
          <p className="mt-1.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">{result.description}</p>
        </div>

        <div className="rounded-[12px] border p-3.5 sm:col-span-2" style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">Created</p>
          <p className="mt-1.5 text-[13px] text-[var(--sp-text-muted)]">
            {new Date(result.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckStatus}
        disabled={checkingStatus}
        className="mt-5 inline-flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
      >
        <RotateCw size={13} className={checkingStatus ? "animate-spin" : ""} />
        {checkingStatus ? "Checking…" : "Check Status"}
      </button>
      {result.checkedAt && !checkingStatus && (
        <span className="ml-3 text-[11px] text-[var(--sp-text-faint)]">
          Last checked {new Date(result.checkedAt).toLocaleTimeString()}
        </span>
      )}

      {statusError && !checkingStatus && <ErrorCard message={statusError} onRetry={onCheckStatus} />}
    </motion.div>
  );
}
