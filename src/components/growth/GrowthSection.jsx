import { motion } from "framer-motion";

// Shared card chrome for every Growth Agent scaffold section (Context
// Summary, Agent Timeline, Opportunity, Approval, Execution, Evaluation).
// Phase 0 only supplies structure — each section's real content/logic
// arrives in later phases and simply replaces `children` here.
export default function GrowthSection({ eyebrow, title, description, icon: Icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[18px] border p-5 sm:p-7"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow)" }}
    >
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: "var(--sp-accent-soft)" }}
          >
            <Icon size={16} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary)]">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-0.5 text-[15.5px] font-bold text-[var(--sp-text)]">{title}</h3>
          {description && (
            <p className="mt-1 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </motion.section>
  );
}
