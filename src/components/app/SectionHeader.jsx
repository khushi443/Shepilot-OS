export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sp-primary)]">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-[19px] font-bold tracking-tight text-[var(--sp-text)] sm:text-[21px]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
