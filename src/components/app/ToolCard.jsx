import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Consistent-height tool card used in the categorized AI Workspace grid.
// Hover: subtle elevation + slight translate + border highlight (no
// scale/rotate theatrics — this is a "calm" premium SaaS surface).
export default function ToolCard({ tool, delay = 0 }) {
  const navigate = useNavigate();
  const Icon = tool.icon;

  return (
    <motion.button
      onClick={() => navigate(tool.path)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      className="group flex h-full flex-col rounded-[16px] border p-4.5 text-left transition-colors duration-200"
      style={{
        background: "var(--sp-surface)",
        borderColor: "var(--sp-border)",
        boxShadow: "var(--sp-shadow-sm)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--sp-primary)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--sp-border)")}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "var(--sp-accent-soft)" }}
        >
          <Icon size={17} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
        </div>
        {tool.badge && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: "var(--sp-success-soft)", color: "var(--sp-success)" }}
          >
            {tool.badge}
          </span>
        )}
      </div>

      <h3 className="mt-3.5 text-[14.5px] font-semibold text-[var(--sp-text)]">
        {tool.title}
      </h3>
      <p className="mt-1 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">
        {tool.desc}
      </p>

      <div className="mt-3 flex flex-1 items-end">
        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--sp-primary)]">
          Open
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </motion.button>
  );
}
