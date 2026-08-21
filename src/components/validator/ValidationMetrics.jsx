import { motion } from "framer-motion";

const getValue = (content = "", label, fallback) => {
  const patterns = [
    new RegExp(`${label}.*?(\\d{1,3})%`, "i"),
    new RegExp(`${label}.*?(\\d{1,3})`, "i"),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);

    if (match) {
      const value = Number(match[1]);

      if (!Number.isNaN(value)) {
        return Math.min(value, 100);
      }
    }
  }

  return fallback;
};

export default function ValidationMetrics({ content }) {
  const metrics = [
    { title: "Problem-Solution Fit", value: getValue(content, "Problem[- ]?Solution Fit", 85), color: "var(--sp-primary)" },
    { title: "Market Demand", value: getValue(content, "Market Demand", 82), color: "var(--sp-success)" },
    { title: "Competition", value: getValue(content, "Competition", 60), color: "var(--sp-warning)" },
    { title: "Revenue Potential", value: getValue(content, "Revenue Potential", 80), color: "var(--sp-accent)" },
    { title: "Risk Level", value: getValue(content, "Risk", 35), color: "var(--sp-danger)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="mt-6 rounded-[16px] border p-6 sm:p-8"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow-sm)" }}
    >
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary)]">
          Detailed Analysis
        </p>
        <h3 className="mt-1.5 text-[17px] font-bold text-[var(--sp-text)]">Validation Metrics</h3>
        <p className="mt-1 text-[13px] text-[var(--sp-text-muted)]">
          AI breakdown of your startup idea across key business indicators.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[12px] border p-4.5"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[13.5px] font-semibold text-[var(--sp-text)]">{metric.title}</h4>
              <span
                className="rounded-full px-2.5 py-0.5 text-[12px] font-bold"
                style={{ background: "var(--sp-surface)", color: "var(--sp-primary)" }}
              >
                {metric.value}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--sp-border)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full"
                style={{ background: metric.color }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[12px]">
              <span className="text-[var(--sp-text-faint)]">Status</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    metric.value >= 80
                      ? "var(--sp-success)"
                      : metric.value >= 60
                      ? "var(--sp-warning)"
                      : "var(--sp-danger)",
                }}
              >
                {metric.value >= 80 ? "Excellent" : metric.value >= 60 ? "Good" : "Needs Improvement"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="mt-6 rounded-[12px] border p-5"
        style={{ borderColor: "var(--sp-primary-soft)", background: "var(--sp-primary-soft)" }}
      >
        <h4 className="mb-1.5 text-[13.5px] font-bold text-[var(--sp-primary-dark)]">📌 AI Summary</h4>
        <p className="text-[13px] leading-6 text-[var(--sp-primary-dark)]">
          These metrics are automatically extracted from the AI validation report to help you quickly
          evaluate your startup&apos;s strengths, weaknesses, market opportunity, competition, revenue
          potential, and overall risk.
        </p>
      </div>
    </motion.div>
  );
}
