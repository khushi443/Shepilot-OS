import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Bot, MessageCircle, Sparkles } from "lucide-react";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";

const CARDS = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides on getting the most out of every AI workspace tool.",
    status: "coming-soon",
  },
  {
    icon: Bot,
    title: "AI Mentor",
    description: "Ask your AI Mentor anything about launching or growing your startup.",
    status: "active",
    path: "/mentor",
    cta: "Ask AI Mentor",
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    description: "Reach a real human for account, billing or product questions.",
    status: "coming-soon",
  },
];

export default function Help() {
  const navigate = useNavigate();

  return (
    <DashboardShell title="Help & Support" subtitle="Your founder support center">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Support"
          title="Help & Support"
          description="Your founder support center is coming soon. In the meantime, here's what's available today."
        />

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const isActive = card.status === "active";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex flex-col rounded-[16px] border p-5"
                style={{
                  borderColor: "var(--sp-border)",
                  background: "var(--sp-surface)",
                  boxShadow: "var(--sp-shadow-sm)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                    style={{ background: "var(--sp-primary-soft)" }}
                  >
                    <Icon size={18} className="text-[var(--sp-primary)]" strokeWidth={2.1} />
                  </div>
                  {!isActive && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold"
                      style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>

                <h3 className="mt-3.5 text-[14.5px] font-semibold text-[var(--sp-text)]">{card.title}</h3>
                <p className="mt-1 flex-1 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">
                  {card.description}
                </p>

                <button
                  onClick={() => isActive && navigate(card.path)}
                  disabled={!isActive}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-[10px] px-4 py-2 text-[12.5px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  style={
                    isActive
                      ? { background: "var(--sp-primary)", color: "#fff" }
                      : { background: "var(--sp-surface-muted)", color: "var(--sp-text-faint)" }
                  }
                >
                  {isActive ? (
                    <>
                      <Sparkles size={13} />
                      {card.cta}
                    </>
                  ) : (
                    "Not yet available"
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
