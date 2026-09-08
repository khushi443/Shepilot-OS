import { motion } from "framer-motion";
import { parseBlueprint } from "../../utils/blueprintParser";

export default function StartupBlueprint({ content }) {
  const nodes = parseBlueprint(content);

  if (!nodes.length) return null;

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[12px] text-xl"
          style={{ background: "var(--sp-primary-soft)" }}
        >
          🗺
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-[var(--sp-text)]">Startup Blueprint</h2>
          <p className="text-[12.5px] text-[var(--sp-text-muted)]">
            AI-generated startup journey at a glance.
          </p>
        </div>
      </div>

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {nodes.map((node, index) => (
          <motion.div
            key={node.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-[16px] border p-5 transition-colors duration-200"
            style={{
              borderColor: "var(--sp-border)",
              background: "var(--sp-surface)",
              boxShadow: "var(--sp-shadow-sm)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] text-xl"
                style={{ background: node.color }}
              >
                {node.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[14.5px] font-semibold text-[var(--sp-text)]">{node.key}</h3>
                <div className="mb-3 mt-2 h-1 w-10 rounded-full" style={{ background: node.color }} />
                <p className="text-[13px] leading-6 text-[var(--sp-text-muted)]">{node.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
