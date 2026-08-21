import { motion } from "framer-motion";

const extractScore = (content = "") => {
  if (!content) return 75;

  const patterns = [
    /Overall Startup Score.*?(\d{1,3})\s*\/\s*100/i,
    /Overall Startup Score.*?(\d{1,3})/i,
    /Validation Score.*?(\d{1,3})\s*\/\s*100/i,
    /Validation Score.*?(\d{1,3})/i,
    /Score.*?(\d{1,3})\s*\/\s*100/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);

    if (match) {
      const score = Number(match[1]);

      if (!Number.isNaN(score)) {
        return Math.min(score, 100);
      }
    }
  }

  return 75;
};

export default function ValidationScore({ content }) {
  const score = extractScore(content);
  const progress = `${score}%`;

  let barColor = "var(--sp-danger)";
  let badge = "Needs Improvement";
  let badgeBg = "var(--sp-danger-soft)";
  let badgeColor = "var(--sp-danger)";

  if (score >= 90) {
    barColor = "var(--sp-success)";
    badge = "Excellent Startup";
    badgeBg = "var(--sp-success-soft)";
    badgeColor = "var(--sp-success)";
  } else if (score >= 75) {
    barColor = "var(--sp-primary)";
    badge = "Strong Potential";
    badgeBg = "var(--sp-primary-soft)";
    badgeColor = "var(--sp-primary-dark)";
  } else if (score >= 60) {
    barColor = "var(--sp-warning)";
    badge = "Average";
    badgeBg = "var(--sp-warning-soft)";
    badgeColor = "var(--sp-warning)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-10 rounded-[16px] border p-6 sm:p-8"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow-sm)" }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary)]">
            AI Validation
          </p>
          <h3 className="mt-1.5 text-[19px] font-bold text-[var(--sp-text)]">Startup Validation Score</h3>
          <p className="mt-1 text-[13px] text-[var(--sp-text-muted)]">
            Overall feasibility of your startup idea.
          </p>
        </div>

        <div
          className="shrink-0 self-start rounded-full px-4 py-1.5 text-[12.5px] font-semibold sm:self-auto"
          style={{ background: badgeBg, color: badgeColor }}
        >
          {badge}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35 }}
          className="text-[52px] font-black leading-none text-[var(--sp-text)]"
        >
          {score}
          <span className="text-[24px] text-[var(--sp-primary)]">/100</span>
        </motion.h1>
        <p className="mt-2 text-[12.5px] text-[var(--sp-text-muted)]">Overall AI Evaluation</p>

        <div className="mt-6 w-full">
          <div className="mb-2 flex justify-between text-[12px] text-[var(--sp-text-muted)]">
            <span>Validation Progress</span>
            <span className="font-semibold text-[var(--sp-text)]">{score}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--sp-border)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progress }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: barColor }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div
          className="rounded-[12px] border p-4 text-center"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
        >
          <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            AI Confidence
          </h4>
          <p className="mt-1.5 text-[17px] font-bold text-[var(--sp-primary)]">High</p>
        </div>

        <div
          className="rounded-[12px] border p-4 text-center"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
        >
          <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            Feasibility
          </h4>
          <p className="mt-1.5 text-[17px] font-bold text-[var(--sp-success)]">
            {score >= 75 ? "Strong" : "Moderate"}
          </p>
        </div>

        <div
          className="rounded-[12px] border p-4 text-center"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
        >
          <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-faint)]">
            Recommendation
          </h4>
          <p className="mt-1.5 text-[17px] font-bold text-[var(--sp-accent)]">
            {score >= 75 ? "Build It 🚀" : "Improve First"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
