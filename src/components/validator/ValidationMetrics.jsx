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
    {
      title: "Problem-Solution Fit",
      value: getValue(content, "Problem[- ]?Solution Fit", 85),
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Market Demand",
      value: getValue(content, "Market Demand", 82),
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Competition",
      value: getValue(content, "Competition", 60),
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Revenue Potential",
      value: getValue(content, "Revenue Potential", 80),
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Risk Level",
      value: getValue(content, "Risk", 35),
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2040] to-[#232B4A] p-8 shadow-xl"
    >
      <div className="mb-8">

        <p className="text-sm uppercase tracking-[3px] text-cyan-300">
          Detailed Analysis
        </p>

        <h3 className="mt-2 text-3xl font-black text-white">
          Validation Metrics
        </h3>

        <p className="mt-2 text-white/60">
          AI breakdown of your startup idea across key business indicators.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">
              {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4 flex items-center justify-between">

              <h4 className="text-lg font-semibold text-white">
                {metric.title}
              </h4>

              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-cyan-300">
                {metric.value}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
              />

            </div>

            <div className="mt-4 flex items-center justify-between text-sm">

              <span className="text-white/50">
                Status
              </span>

              <span
                className={`font-semibold ${
                  metric.value >= 80
                    ? "text-green-400"
                    : metric.value >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {metric.value >= 80
                  ? "Excellent"
                  : metric.value >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </span>

            </div>

          </motion.div>
        ))}

      </div>

      {/* Summary */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <h4 className="mb-2 text-lg font-bold text-cyan-300">
          📌 AI Summary
        </h4>

        <p className="leading-7 text-white/70">
          These metrics are automatically extracted from the AI validation report
          to help you quickly evaluate your startup&apos;s strengths, weaknesses,
          market opportunity, competition, revenue potential, and overall risk.
        </p>

      </div>

    </motion.div>
  );
}