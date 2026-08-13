import { motion } from "framer-motion";

// KPI card: label, big number, small trend/description, icon, optional
// progress bar. Pass `percent` (0-100) to render the mini progress track.
export default function StatCard({ label, value, description, icon: Icon, percent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-[16px] border p-4.5 sm:p-5"
      style={{
        background: "var(--sp-surface)",
        borderColor: "var(--sp-border)",
        boxShadow: "var(--sp-shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-[var(--sp-text-muted)]">{label}</p>
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px]"
            style={{ background: "var(--sp-primary-soft)" }}
          >
            <Icon size={15} className="text-[var(--sp-primary)]" strokeWidth={2.25} />
          </div>
        )}
      </div>

      <p className="mt-3 text-[26px] font-bold leading-none tracking-tight text-[var(--sp-text)]">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-[12px] text-[var(--sp-text-faint)]">{description}</p>
      )}

      {typeof percent === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--sp-border)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--sp-primary)" }}
          />
        </div>
      )}
    </motion.div>
  );
}
