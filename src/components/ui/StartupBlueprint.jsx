import { motion } from "framer-motion";
import { parseBlueprint } from "../../utils/blueprintParser";

export default function StartupBlueprint({ content }) {
  const nodes = parseBlueprint(content);

  if (!nodes.length) return null;

  return (
    <section className="mt-14">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg">
          🗺
        </div>

        <div>
          <h2 className="text-3xl font-black text-white">
            Startup Blueprint
          </h2>

          <p className="text-white/60 mt-1">
            AI-generated startup journey at a glance.
          </p>
        </div>
      </div>

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
              className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition"
              style={{ background: node.color }}
            />

            <div className="relative flex items-start gap-5">

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-lg"
                style={{
                  background: node.color,
                }}
              >
                {node.icon}
              </div>

              {/* Content */}
              <div className="flex-1">

                <h3 className="text-xl font-bold text-white">
                  {node.key}
                </h3>

                <div
                  className="w-12 h-1 rounded-full mt-2 mb-4"
                  style={{
                    background: node.color,
                  }}
                />

                <p className="text-white/75 text-sm leading-7">
                  {node.text}
                </p>

              </div>

            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}