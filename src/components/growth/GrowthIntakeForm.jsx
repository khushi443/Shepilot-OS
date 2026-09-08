import { Sparkles } from "lucide-react";
import { hasBusinessContext } from "../../utils/businessContext";

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
 * Phase 1 intake form for the Growth Agent. Reuses the founder's existing
 * ShePilot business context (shown as a badge, same as AIToolPage's
 * "Using your startup idea from earlier" pattern) and collects the 3
 * growth-specific fields the analysis needs.
 */
export default function GrowthIntakeForm({ fields, fieldErrors, onFieldChange, onSubmit, loading }) {
  const founderHasContext = hasBusinessContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {founderHasContext && (
        <div
          className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
          style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
        >
          <Sparkles size={13} />
          Using your existing ShePilot business context
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="growth-product-name">Best-selling product or service</FieldLabel>
          <input
            id="growth-product-name"
            type="text"
            value={fields.productName}
            maxLength={200}
            placeholder="e.g. Handmade jute tote bags"
            onChange={(e) => onFieldChange("productName", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)]"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.productName} />
        </div>

        <div>
          <FieldLabel htmlFor="growth-price">Price (₹)</FieldLabel>
          <input
            id="growth-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={fields.price}
            placeholder="e.g. 799"
            onChange={(e) => onFieldChange("price", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)]"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.price} />
        </div>

        <div>
          <FieldLabel htmlFor="growth-past-customers">Approximate past/repeat customers</FieldLabel>
          <input
            id="growth-past-customers"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={fields.pastCustomers}
            placeholder="e.g. 40"
            onChange={(e) => onFieldChange("pastCustomers", e.target.value)}
            className="mt-2 w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[var(--sp-primary)]"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.pastCustomers} />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="growth-blocker">
            Biggest blocker to getting paid or getting repeat purchases
          </FieldLabel>
          <textarea
            id="growth-blocker"
            rows={4}
            maxLength={1000}
            value={fields.biggestBlocker}
            placeholder="e.g. Customers ask for UPI/bank transfer manually and I keep chasing payments, or I have no easy way to reach past buyers again."
            onChange={(e) => onFieldChange("biggestBlocker", e.target.value)}
            className="mt-2 w-full resize-none rounded-[12px] border px-3.5 py-2.5 text-[13.5px] leading-6 outline-none transition-colors focus:border-[var(--sp-primary)]"
            style={inputStyle}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <FieldError message={fieldErrors.biggestBlocker} />
            <span className="ml-auto text-[11px] text-[var(--sp-text-faint)]">
              {fields.biggestBlocker.length}/1000
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        style={{ background: "var(--sp-primary)" }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Analyzing your business…
          </span>
        ) : (
          "🔍 Analyze My Growth Opportunity"
        )}
      </button>
    </form>
  );
}
