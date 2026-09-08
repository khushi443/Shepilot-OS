import { ShieldCheck, XCircle, CheckCircle2, FlaskConical } from "lucide-react";
import ErrorCard from "../ui/ErrorCard";

const inputStyle = {
  borderColor: "var(--sp-border)",
  background: "var(--sp-surface)",
  color: "var(--sp-text)",
};

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-[12.5px] font-semibold text-[var(--sp-text)]">
      {children}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[11.5px] font-medium text-[var(--sp-danger)]">{message}</p>;
}

/**
 * Phase 3 approval panel. Every field is editable before the founder
 * approves. Nothing is executed until they explicitly click Approve — see
 * useApprovalExecution for the guard that makes double-clicking safe.
 * Approving creates a REAL Razorpay Test Mode payment link (server-side);
 * currency is fixed to INR in this phase.
 */
export default function ApprovalPanel({
  fields,
  fieldErrors,
  onFieldChange,
  decision,
  executing,
  executionError,
  hasExecuted,
  onApprove,
  onDecline,
  onRetry,
}) {
  const locked = executing || hasExecuted;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold"
          style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
        >
          <ShieldCheck size={13} />
          Nothing is created until you approve — review and edit freely first
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold"
          style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
        >
          <FlaskConical size={13} />
          Razorpay Test Mode
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="approval-amount">Amount (INR)</FieldLabel>
          <input
            id="approval-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={fields.amount}
            disabled={locked}
            onChange={(e) => onFieldChange("amount", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)] disabled:opacity-60"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.amount} />
        </div>

        <div>
          <FieldLabel htmlFor="approval-currency">Currency</FieldLabel>
          <input
            id="approval-currency"
            type="text"
            value="INR"
            disabled
            readOnly
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none disabled:opacity-60"
            style={inputStyle}
          />
          <p className="mt-1.5 text-[11.5px] text-[var(--sp-text-faint)]">
            Only INR is supported in this phase.
          </p>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="approval-description">Description</FieldLabel>
          <textarea
            id="approval-description"
            rows={2}
            maxLength={500}
            value={fields.description}
            disabled={locked}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="mt-2 w-full resize-none rounded-[12px] border px-3.5 py-2.5 text-[13.5px] leading-6 outline-none transition-colors focus:border-[var(--sp-primary)] disabled:opacity-60"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div>
          <FieldLabel htmlFor="approval-expiry">Expiry</FieldLabel>
          <input
            id="approval-expiry"
            type="datetime-local"
            value={fields.expiryAt}
            disabled={locked}
            onChange={(e) => onFieldChange("expiryAt", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)] disabled:opacity-60"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.expiryAt} />
        </div>

        <div>
          <FieldLabel htmlFor="approval-audience">Target audience note</FieldLabel>
          <input
            id="approval-audience"
            type="text"
            maxLength={500}
            value={fields.targetAudienceNote}
            disabled={locked}
            placeholder="e.g. Past customers who bought before"
            onChange={(e) => onFieldChange("targetAudienceNote", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)] disabled:opacity-60"
            style={inputStyle}
          />
        </div>
      </div>

      {hasExecuted ? (
        <div
          className="mt-6 inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12.5px] font-semibold"
          style={{ background: "var(--sp-success-soft)", color: "var(--sp-success)" }}
        >
          <CheckCircle2 size={14} />
          Approved — Razorpay Test Mode result below
        </div>
      ) : decision === "declined" ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] font-medium text-[var(--sp-text-muted)]">
            You declined this action. Edit the details above and approve when ready.
          </p>
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--sp-primary)" }}
          >
            ✅ Approve
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onApprove}
            disabled={executing}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--sp-primary)" }}
          >
            {executing ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Creating Razorpay Test Mode link…
              </span>
            ) : (
              "✅ Approve"
            )}
          </button>
          <button
            type="button"
            onClick={onDecline}
            disabled={executing}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] border px-6 py-3 text-[14px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
          >
            <XCircle size={16} />
            Decline
          </button>
        </div>
      )}

      {executionError && !executing && <ErrorCard message={executionError} onRetry={onRetry} />}
    </div>
  );
}
