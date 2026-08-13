import { motion } from "framer-motion";
import { parseBusinessSnapshot } from "../../utils/blueprintParser";

export default function BusinessCanvas({ content }) {
  const nodes = parseBusinessSnapshot(content);

  if (!nodes.length) return null;

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-3xl shadow-lg">
          📊
        </div>

        <div>
          <h2 className="text-3xl font-black text-white">
            Business Snapshot
          </h2>

          <p className="text-white/60 mt-1">
            AI extracted the most important business insights from your idea.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {nodes.map((node, index) => (
          <motion.div
            key={node.key}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-gradient-to-br
              from-[#1B2040]
              to-[#232B4A]
              p-6
              shadow-xl
              transition-all
              duration-300
              hover:border-cyan-400/60
            "
          >
            {/* Glow */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition"
              style={{
                background: node.color,
              }}
            />

            <div className="relative">

              {/* Top */}
              <div className="flex items-center gap-4">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{
                    background: node.color,
                  }}
                >
                  {node.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {node.key}
                  </h3>

                  <div
                    className="w-12 h-1 rounded-full mt-2"
                    style={{
                      background: node.color,
                    }}
                  />
                </div>

              </div>

              {/* Content */}
              <p className="mt-5 text-white/75 leading-7 text-sm">
                {node.text || "AI generated summary."}
              </p>

            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}