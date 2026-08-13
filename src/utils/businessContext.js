// Shared business context so every AI tool builds on what came before,
// instead of asking the founder to re-type their idea on every page.
const STORAGE_KEY = "shepilot_business_context";

const STEP_LABELS = {
  "Business Idea": "Business Idea",
  "Startup Validator": "Validation",
  "Startup Canvas": "Business Model Canvas",
  "Finance Plan": "Finance Plan",
  "Marketing Plan": "Marketing Plan",
  "Pitch Deck": "Pitch Deck",
  "Roadmap": "Launch Roadmap",
};

// The canonical Startup Journey order, shared by the Dashboard and anything
// else that needs to reason about "what's next" for a founder.
export const JOURNEY_STEPS = [
  { key: "Business Idea", label: "Business Idea", short: "Idea", path: "/business-idea", emoji: "💡" },
  { key: "Startup Validator", label: "Validation", short: "Validate", path: "/startup-validator", emoji: "🔍" },
  { key: "Startup Canvas", label: "Business Canvas", short: "Canvas", path: "/startup-canvas", emoji: "📊" },
  { key: "Finance Plan", label: "Finance", short: "Finance", path: "/finance", emoji: "💰" },
  { key: "Marketing Plan", label: "Marketing", short: "Marketing", path: "/marketing", emoji: "📢" },
  { key: "Pitch Deck", label: "Pitch Deck", short: "Pitch", path: "/pitch", emoji: "🚀" },
  { key: "Roadmap", label: "Launch Roadmap", short: "Launch", path: "/roadmap", emoji: "🗺️" },
];

export function getBusinessContext() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Failed to read business context:", err);
    return {};
  }
}

export function updateBusinessContext(historyType, input, result) {
  try {
    const ctx = getBusinessContext();
    ctx.steps = ctx.steps || {};
    ctx.steps[historyType] = { input, result, updatedAt: Date.now() };

    // The idea is the seed every other tool should reuse.
    if (historyType === "Business Idea") {
      ctx.ideaText = input;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch (err) {
    console.error("Failed to save business context:", err);
  }
}

// What should already be sitting in the textarea when a founder opens a
// downstream tool, so they never have to retype their idea from scratch.
// Tools whose input box is NOT "describe your business idea" — either the
// idea originates here (Business Idea) or the box is a free-form question
// (AI Mentor) — so it should never be silently prefilled with the idea text.
const NO_PREFILL_TYPES = new Set(["Business Idea", "AI Mentor"]);

export function getPrefillInput(historyType) {
  if (NO_PREFILL_TYPES.has(historyType)) return "";
  const ctx = getBusinessContext();
  return ctx.ideaText || "";
}

// A block of prior AI outputs to feed into the next prompt, so tools stay
// connected instead of generating in isolation.
export function buildContextBlock(historyType) {
  const ctx = getBusinessContext();
  if (!ctx.steps) return "";

  const parts = Object.entries(STEP_LABELS)
    .filter(([key]) => key !== historyType && ctx.steps[key]?.result)
    .map(([key, label]) => `${label} (already generated for this founder):\n${ctx.steps[key].result.slice(0, 800)}`);

  if (!parts.length) return "";

  return (
    "The founder already has the following business context built up on ShePilot OS. " +
    "Use it directly and stay consistent with it — do not ask the founder to repeat it:\n\n" +
    parts.join("\n\n") +
    "\n\n---\n\n"
  );
}

// Everything the Dashboard needs to render the Startup Journey: per-step
// completion, overall percentage, current/next step, and a snapshot of the
// idea itself.
export function getJourneyProgress() {
  const ctx = getBusinessContext();
  const steps = ctx.steps || {};

  const journey = JOURNEY_STEPS.map((step) => {
    const entry = steps[step.key];
    return {
      ...step,
      done: Boolean(entry?.result),
      updatedAt: entry?.updatedAt || null,
      preview: entry?.result ? entry.result.slice(0, 160) : null,
    };
  });

  const completedCount = journey.filter((s) => s.done).length;
  const percent = Math.round((completedCount / journey.length) * 100);

  // Next recommended step: first one in order that isn't done yet.
  const nextStep = journey.find((s) => !s.done) || null;

  // Continue where you left off: the most recently touched step, otherwise
  // fall back to the first step.
  const mostRecent = journey
    .filter((s) => s.updatedAt)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const continueStep = mostRecent || journey[0];

  return {
    journey,
    completedCount,
    total: journey.length,
    percent,
    nextStep,
    continueStep,
    ideaText: ctx.ideaText || null,
    hasStarted: completedCount > 0,
    isComplete: completedCount === journey.length,
  };
}

// Maps each Startup Journey tool onto the higher-level Ideate → Validate →
// Plan → Launch → Grow stage it belongs to, plus a short, human description
// of what the founder is doing at that point. Used by the dashboard's
// "Current Stage" KPI and hero copy — derived entirely from real journey
// progress, never invented.
const STAGE_INFO = {
  "Business Idea": { stage: "Ideate", description: "Shaping your business idea" },
  "Startup Validator": { stage: "Validate", description: "Validating market demand" },
  "Startup Canvas": { stage: "Plan", description: "Mapping your business model" },
  "Finance Plan": { stage: "Plan", description: "Building your financial plan" },
  "Marketing Plan": { stage: "Grow", description: "Building your marketing plan" },
  "Pitch Deck": { stage: "Grow", description: "Building your pitch deck" },
  "Roadmap": { stage: "Launch", description: "Preparing your launch roadmap" },
};

// Where is this founder right now, in plain terms? Takes the same `progress`
// object returned by getJourneyProgress() so there's a single source of
// truth for "what's next" — nothing here recomputes journey state.
export function getCurrentStage(progress) {
  if (!progress.hasStarted) {
    return { stage: "Ideate", description: "Shape your first business idea" };
  }
  if (progress.isComplete) {
    return { stage: "Grow", description: "Every milestone complete" };
  }
  const target = progress.nextStep || progress.journey[0];
  return STAGE_INFO[target.key] || { stage: "Ideate", description: "Getting started" };
}

// Copy for the dashboard's "Next Best Move" callout, keyed by the tool that
// comes next in the journey. Kept separate from STAGE_INFO since this is
// action-oriented ("do this next") rather than descriptive.
const NEXT_MOVE_COPY = {
  "Business Idea": {
    headline: "Generate your first business idea to kick off your startup journey.",
    cta: "Generate Business Idea",
  },
  "Startup Validator": {
    headline: "Your idea exists — validate the market before you build any further.",
    cta: "Validate Your Market",
  },
  "Startup Canvas": {
    headline: "Validation's done. Turn it into a full business model canvas.",
    cta: "Build Your Canvas",
  },
  "Finance Plan": {
    headline: "Forecast your budget, revenue and runway.",
    cta: "Plan Your Finances",
  },
  "Marketing Plan": {
    headline: "Build a 30-day marketing plan to create momentum.",
    cta: "Create Marketing Plan",
  },
  "Pitch Deck": {
    headline: "Turn your plan into an investor-ready pitch deck.",
    cta: "Build Pitch Deck",
  },
  "Roadmap": {
    headline: "Planning's complete — prepare your step-by-step launch roadmap.",
    cta: "Build Launch Roadmap",
  },
};

// The single next action a founder should take, computed from their real
// journey progress (never a static, generic recommendation). Reuses
// getJourneyProgress()'s output instead of re-deriving journey state.
export function getNextBestMove(progress) {
  if (progress.isComplete) {
    const last = progress.journey[progress.journey.length - 1];
    return {
      headline: "Every milestone is logged — revisit any tool to sharpen your plan.",
      cta: "Revisit Roadmap",
      path: last.path,
    };
  }

  const target = progress.nextStep || progress.journey[0];
  const copy = NEXT_MOVE_COPY[target.key] || {
    headline: `Continue with ${target.label}.`,
    cta: `Start ${target.short}`,
  };

  return { headline: copy.headline, cta: copy.cta, path: target.path };
}

export function hasBusinessContext() {
  return Boolean(getBusinessContext().ideaText);
}

export function clearBusinessContext() {
  localStorage.removeItem(STORAGE_KEY);
}
