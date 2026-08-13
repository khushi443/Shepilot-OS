import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorCard({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-[14px] border p-5"
      style={{ borderColor: "var(--sp-danger-soft)", background: "var(--sp-danger-soft)" }}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--sp-danger)]" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold text-[var(--sp-danger)]">
          Something went wrong while generating your response.
        </p>
        <p className="mt-1 text-[12.5px] leading-5" style={{ color: "var(--sp-danger)", opacity: 0.8 }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-[9px] border px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:bg-white/40"
            style={{ borderColor: "var(--sp-danger)", color: "var(--sp-danger)" }}
          >
            <RotateCcw size={13} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
