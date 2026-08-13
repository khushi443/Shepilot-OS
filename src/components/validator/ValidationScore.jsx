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

  let color = "from-red-500 to-red-400";
  let badge = "Needs Improvement";
  let badgeColor = "bg-red-500/20 text-red-300";

  if (score >= 90) {
    color = "from-emerald-500 to-green-400";
    badge = "Excellent Startup";
    badgeColor = "bg-emerald-500/20 text-emerald-300";
  } else if (score >= 75) {
    color = "from-cyan-500 to-blue-500";
    badge = "Strong Potential";
    badgeColor = "bg-cyan-500/20 text-cyan-300";
  } else if (score >= 60) {
    color = "from-yellow-500 to-orange-400";
    badge = "Average";
    badgeColor = "bg-yellow-500/20 text-yellow-300";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2040] to-[#232B4A] p-8 shadow-xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[3px] text-cyan-300">
            AI Validation
          </p>

          <h3 className="mt-2 text-3xl font-black text-white">
            Startup Validation Score
          </h3>

          <p className="mt-2 text-white/60">
            Overall feasibility of your startup idea.
          </p>

        </div>

        <div
          className={`rounded-full px-5 py-2 text-sm font-semibold ${badgeColor}`}
        >
          {badge}
        </div>

      </div>

      <div className="mt-10"></div>
            <div className="flex flex-col items-center justify-center">

        {/* Score */}

        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-7xl font-black text-white"
        >
          {score}
          <span className="text-4xl text-cyan-300">/100</span>
        </motion.h1>

        <p className="mt-2 text-white/60">
          Overall AI Evaluation
        </p>

        {/* Progress */}

        <div className="mt-8 w-full">

          <div className="mb-2 flex justify-between text-sm text-white/60">

            <span>Validation Progress</span>

            <span>{score}%</span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-white/10">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progress }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
            />

          </div>

        </div>

      </div>

      {/* Bottom Stats */}

      <div className="mt-10 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">

          <h4 className="text-sm uppercase tracking-wide text-white/50">
            AI Confidence
          </h4>

          <p className="mt-2 text-2xl font-bold text-cyan-300">
            High
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">

          <h4 className="text-sm uppercase tracking-wide text-white/50">
            Feasibility
          </h4>

          <p className="mt-2 text-2xl font-bold text-green-300">
            {score >= 75 ? "Strong" : "Moderate"}
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">

          <h4 className="text-sm uppercase tracking-wide text-white/50">
            Recommendation
          </h4>

          <p className="mt-2 text-2xl font-bold text-purple-300">
            {score >= 75 ? "Build It 🚀" : "Improve First"}
          </p>

        </div>

      </div>

    </motion.div>
  );
}