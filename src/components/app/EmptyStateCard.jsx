import { useNavigate } from "react-router-dom";

export default function EmptyStateCard({ icon: Icon, title, description, ctaLabel, ctaPath }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-[16px] border border-dashed p-8 text-center sm:p-10"
      style={{ borderColor: "var(--sp-border-strong)", background: "var(--sp-surface-muted)" }}
    >
      {Icon && (
        <div
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "var(--sp-primary-soft)" }}
        >
          <Icon size={19} className="text-[var(--sp-primary)]" />
        </div>
      )}
      <h3 className="mt-4 text-[14.5px] font-semibold text-[var(--sp-text)]">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-5 text-[var(--sp-text-muted)]">
          {description}
        </p>
      )}
      {ctaLabel && ctaPath && (
        <button
          onClick={() => navigate(ctaPath)}
          className="mt-4 rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--sp-primary)" }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
