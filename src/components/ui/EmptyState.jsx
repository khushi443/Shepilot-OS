export default function EmptyState({ emoji = "📂", title, description }) {
  return (
    <div
      className="rounded-[16px] border border-dashed p-8 text-center sm:p-10"
      style={{ borderColor: "var(--sp-border-strong)", background: "var(--sp-surface-muted)" }}
    >
      <div className="mb-3 text-4xl" aria-hidden="true">{emoji}</div>
      <h3 className="text-[15px] font-semibold text-[var(--sp-text)]">{title}</h3>
      {description && (
        <p className="mt-2 text-[13px] leading-5 text-[var(--sp-text-muted)]">{description}</p>
      )}
    </div>
  );
}
