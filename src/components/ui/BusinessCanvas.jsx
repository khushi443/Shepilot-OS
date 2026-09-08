import { motion } from "framer-motion";
import { parseBusinessSnapshot } from "../../utils/blueprintParser";

export default function BusinessCanvas({ content }) {
  const nodes = parseBusinessSnapshot(content);

  if (!nodes.length) return null;

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[12px] text-xl"
          style={{ background: "var(--sp-accent-soft)" }}
        >
          📊
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-[var(--sp-text)]">Business Snapshot</h2>
          <p className="text-[12.5px] text-[var(--sp-text-muted)]">
            AI extracted the most important business insights from your idea.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg"
                style={{ background: node.color }}
              >
                {node.icon}
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--sp-text)]">{node.key}</h3>
                <div className="mt-1.5 h-1 w-9 rounded-full" style={{ background: node.color }} />
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-[var(--sp-text-muted)]">
              {node.text || "AI generated summary."}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
