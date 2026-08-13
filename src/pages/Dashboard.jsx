import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lightbulb,
  SearchCheck,
  Grid3x3,
  Wallet,
  Presentation,
  Megaphone,
  Map,
  Bot,
  ArrowRight,
} from "lucide-react";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";
import JourneyStepper from "../components/app/JourneyStepper";
import ToolCard from "../components/app/ToolCard";
import RecentActivityCard from "../components/app/RecentActivityCard";
import AnalyticsCards from "../components/AnalyticsCards";
import { useAuth } from "../context/AuthContext";
import { getJourneyProgress, getNextBestMove } from "../utils/businessContext";

const TOOL_CATEGORIES = [
  {
    key: "discover",
    label: "Discover",
    description: "Find and validate your idea.",
    tools: [
      { title: "Business Idea", desc: "Generate a full startup concept with AI.", path: "/business-idea", icon: Lightbulb },
      { title: "Market Validation", desc: "Stress-test demand before you build.", path: "/startup-validator", icon: SearchCheck },
    ],
  },
  {
    key: "build",
    label: "Build",
    description: "Turn the idea into a real plan.",
    tools: [
      { title: "Business Canvas", desc: "Map your full business model on one page.", path: "/startup-canvas", icon: Grid3x3 },
      { title: "Finance Planner", desc: "Budget, revenue and profit forecasts.", path: "/finance", icon: Wallet },
      { title: "Pitch Deck", desc: "Generate an investor-ready deck.", path: "/pitch", icon: Presentation },
    ],
  },
  {
    key: "grow",
    label: "Grow",
    description: "Launch, market and keep moving.",
    tools: [
      { title: "Content Studio", desc: "A 30-day AI marketing plan.", path: "/marketing", icon: Megaphone },
      { title: "Launch Roadmap", desc: "Step-by-step path from plan to launch.", path: "/roadmap", icon: Map },
      { title: "AI Mentor", desc: "Ask anything about your startup, anytime.", path: "/mentor", icon: Bot },
    ],
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(() => getJourneyProgress());

  useEffect(() => {
    const refresh = () => setProgress(getJourneyProgress());
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  // Sidebar links to /dashboard#ai-workspace and /dashboard#startup-journey —
  // scroll to the matching section once it's mounted.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [location.hash]);

  const firstName =
    currentUser?.displayName?.split(" ")[0] || currentUser?.email?.split("@")[0] || "there";

  // Single source of truth for "what should this founder do next" — reused
  // for both the hero CTA and the Next Best Move callout below, so the two
  // never disagree with each other.
  const nextMove = getNextBestMove(progress);

  return (
    <DashboardShell title="Overview" subtitle="Your startup, at a glance">
      <div className="mx-auto max-w-7xl space-y-9">
        {/* Hero / Welcome — compact, not a marketing banner: greeting, one
            founder-facing line, progress context, and a single primary CTA. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: "var(--sp-border)" }}
        >
          <div>
            <p className="text-[12.5px] font-medium text-[var(--sp-text-faint)]">
              {getGreeting()}, {firstName} 👋
            </p>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[var(--sp-text)] sm:text-[26px]">
              {progress.hasStarted ? "Here's where your startup stands." : "Let's build your startup."}
            </h1>
            <p className="mt-1.5 max-w-lg text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
              Your AI co-pilot keeps your startup context connected across every step.
            </p>
            <p className="mt-2.5 text-[12px] font-semibold text-[var(--sp-text-faint)]">
              {progress.completedCount} of {progress.total} milestones complete
            </p>
          </div>
          <button
            onClick={() => navigate(nextMove.path)}
            className="inline-flex shrink-0 items-center gap-2 rounded-[12px] px-5 py-3 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--sp-primary)" }}
          >
            {nextMove.cta}
            <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* KPI Section */}
        <AnalyticsCards progress={progress} />

        {/* Startup Journey */}
        <section id="startup-journey" className="scroll-mt-20">
          <SectionHeader
            eyebrow="Startup Journey"
            title={progress.hasStarted ? "Your Startup, Connected" : "Start Your Startup Journey"}
            description="One idea flows through every AI tool below — validate it, plan it, pitch it and launch it without retyping a thing."
          />

          {/* No outer bordered card here on purpose — the progress bar,
              stepper and next-move callout read as one open flow via
              spacing alone, rather than a card nested inside a card. */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[12.5px] text-[var(--sp-text-muted)]">
              <span>Startup completion</span>
              <span className="font-semibold text-[var(--sp-text)]">{progress.percent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--sp-border)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "var(--sp-primary)" }}
              />
            </div>

            <div className="mt-6">
              <JourneyStepper steps={progress.journey} nextKey={progress.nextStep?.key} />
            </div>

            {/* Next best move — a left-accent callout, not a second bordered
                box, so the recommendation reads as part of the same flow. */}
            <div
              className="mt-6 flex flex-col gap-3 border-l-2 pl-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--sp-accent)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-accent)]">
                  Next Best Move
                </p>
                <p className="mt-1 max-w-xl text-[13.5px] font-medium leading-6 text-[var(--sp-text)]">
                  {nextMove.headline}
                </p>
              </div>
              <button
                onClick={() => navigate(nextMove.path)}
                className="shrink-0 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--sp-accent)" }}
              >
                {nextMove.cta}
              </button>
            </div>
          </div>
        </section>

        {/* AI Workspace */}
        <section id="ai-workspace" className="scroll-mt-20">
          <SectionHeader
            eyebrow="Workspace"
            title="AI Workspace"
            description="Every tool is designed to help you move from idea to launch."
          />

          <div className="mt-6 space-y-7">
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.key}>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-faint)]">
                    {category.label}
                  </h3>
                  <span className="text-[11.5px] text-[var(--sp-text-faint)]">— {category.description}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {category.tools.map((tool, i) => (
                    <ToolCard key={tool.title} tool={tool} delay={i * 0.04} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Work */}
        <section className="pb-4">
          <RecentActivityCard />
        </section>
      </div>
    </DashboardShell>
  );
}
