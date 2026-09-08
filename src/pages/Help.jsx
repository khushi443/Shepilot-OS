import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Bot, Mail, Sparkles } from "lucide-react";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";

const TOPICS = [
  {
    title: "Getting Started",
    body:
      "Create your account, then head to Business Idea — that's the seed every other " +
      "tool builds on. Describe your idea in a sentence or two and generate; from there " +
      "the Dashboard shows your Startup Journey and the next recommended step.",
  },
  {
    title: "Startup Journey",
    body:
      "Your journey runs Business Idea → Validation → Business Canvas → Finance → " +
      "Marketing → Pitch Deck → Launch Roadmap. The Dashboard tracks how many steps " +
      "you've completed and always points you to the next best move — you can also " +
      "jump to any step directly from the sidebar.",
  },
  {
    title: "AI Workspace",
    body:
      "Each tool page (Business Idea, Validation, Canvas, Finance, Marketing, Pitch, " +
      "Roadmap, Mentor) works the same way: describe what you need, hit Generate, and " +
      "the AI mentor produces a structured, Markdown-formatted plan. You get 5 AI " +
      "generations per day; that resets daily.",
  },
  {
    title: "Context Continuity",
    body:
      "Once you generate a Business Idea, every downstream tool automatically reuses " +
      "it and the outputs from any steps you've already completed — you don't need to " +
      "retype your idea on every page. You'll see a \"Using your startup idea from " +
      "earlier\" badge on tools that are pulling in that context.",
  },
  {
    title: "AI Mentor",
    body:
      "AI Mentor is a free-form Q&A tool — ask anything about launching or growing " +
      "your startup. Unlike the other tools, it doesn't prefill your idea into the " +
      "box (so you can ask an open question), but it still uses your saved context " +
      "when answering.",
  },
  {
    title: "Activity History",
    body:
      "Every AI generation is saved to your Activity History, so you can revisit past " +
      "outputs without regenerating them. Find it from the sidebar to see everything " +
      "you've generated, grouped by tool.",
  },
];

function TopicItem({ title, body, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-[14px] border"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-[13.5px] font-semibold text-[var(--sp-text)]">{title}</span>
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform text-[var(--sp-text-faint)]"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <p className="px-5 pb-4 text-[12.5px] leading-6 text-[var(--sp-text-muted)]">{body}</p>
      )}
    </motion.div>
  );
}

const SUPPORT_EMAIL = "support@shepilot.app";

export default function Help() {
  const navigate = useNavigate();

  return (
    <DashboardShell title="Help & Support" subtitle="Your founder support center">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Support"
          title="Help & Support"
          description="Guides on getting the most out of every ShePilot tool."
        />

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/mentor")}
            className="flex items-center gap-3 rounded-[14px] border p-4.5 text-left transition-colors hover:bg-[var(--sp-surface-muted)]"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: "var(--sp-primary-soft)" }}
            >
              <Bot size={18} className="text-[var(--sp-primary)]" strokeWidth={2.1} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-[var(--sp-text)]">Ask AI Mentor</p>
              <p className="text-[12px] text-[var(--sp-text-faint)]">
                Get an instant answer about launching or growing your startup.
              </p>
            </div>
            <Sparkles size={14} className="ml-auto shrink-0 text-[var(--sp-primary)]" />
          </button>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ShePilot support request")}`}
            className="flex items-center gap-3 rounded-[14px] border p-4.5 text-left transition-colors hover:bg-[var(--sp-surface-muted)]"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: "var(--sp-accent-soft)" }}
            >
              <Mail size={18} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-[var(--sp-text)]">Contact Support</p>
              <p className="truncate text-[12px] text-[var(--sp-text-faint)]">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        </div>

        <div className="mt-8 space-y-2.5">
          {TOPICS.map((topic, i) => (
            <TopicItem key={topic.title} title={topic.title} body={topic.body} index={i} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
