import { CheckCircle2, Circle, Loader2 } from "lucide-react";

// Phase 5 — the timeline now reflects REAL application state passed in from
// GrowthAgent.jsx (the same state driving Steps 1-7), instead of Phase 0's
// static "everything is upcoming" preview. A stage is only ever marked done
// once the corresponding real state actually exists - nothing here is
// fabricated or assumed ahead of time. Status is communicated through both
// an icon AND a text label (never color alone).
//
// A few adjacent stages share a single real signal because the backend
// produces them together in one response (e.g. "Opportunity identified"
// and "Recommendation generated" both come back from the same
// /api/analyze-growth call; "Approved" and "Payment Link created" both
// follow from a single successful execute() call). In those cases the
// earlier stage is shown as "In progress" while the request is in flight,
// and both stages flip to "Done" together once the real result lands -
// this never marks a step done before the state backing it exists.
function computeStages({
  contextReady,
  analysisLoading,
  hasAnalysis,
  decision,
  executing,
  hasExecution,
  checkingStatus,
  hasStatusChecked,
  evaluating,
  hasEvaluation,
  hasNextAction,
}) {
  const approved = decision === "approved";

  return [
    {
      label: "Context understood",
      description: "Read your business & customer context",
      done: contextReady,
      active: false,
    },
    {
      label: "Opportunity identified",
      description: "Identify the strongest growth opportunity",
      done: hasAnalysis,
      active: analysisLoading,
    },
    {
      label: "Recommendation generated",
      description: "Propose one specific action, with reasoning",
      done: hasAnalysis,
      active: false,
    },
    {
      label: "Awaiting approval",
      description: "Waiting for your explicit go-ahead",
      done: approved || hasExecution,
      active: hasAnalysis && !hasExecution && !executing,
    },
    {
      label: "Approved",
      description: "You approved the recommended action",
      done: approved,
      active: executing,
    },
    {
      label: "Payment Link created",
      description: "Razorpay Test Mode payment link created",
      done: hasExecution,
      active: executing,
    },
    {
      label: "Status checked",
      description: "Latest status pulled from Razorpay Test Mode",
      done: hasStatusChecked,
      active: checkingStatus,
    },
    {
      label: "Evaluation completed",
      description: "Result evaluated against the real outcome",
      done: hasEvaluation,
      active: evaluating,
    },
    {
      label: "Next Best Action generated",
      description: "A specific, contextual next step is ready",
      done: hasNextAction,
      active: false,
    },
  ];
}

function StageIcon({ done, active }) {
  if (done) {
    return <CheckCircle2 size={16} style={{ color: "var(--sp-success)" }} aria-hidden="true" />;
  }
  if (active) {
    return <Loader2 size={16} className="animate-spin" style={{ color: "var(--sp-primary)" }} aria-hidden="true" />;
  }
  return <Circle size={16} style={{ color: "var(--sp-text-faint)" }} aria-hidden="true" />;
}

// Text label shown alongside the icon — status is never conveyed by color
// alone. "Awaiting approval" gets its own, more specific in-progress label
// since that stage's whole job is sitting there waiting on the founder;
// every other stage just says "In progress" while its request is in flight.
// This only changes the words shown for the same done/active booleans
// computed above — it does not add a new state or touch the state logic.
function statusLabel({ done, active, label }) {
  if (done) return "Completed";
  if (active) return label === "Awaiting approval" ? "Awaiting approval" : "In progress";
  return "Upcoming";
}

// Phase 5 UI polish — presentation only. The 9 stages, their order, and the
// done/active booleans computed above are untouched; this just replaces the
// old single squeezed-in row with a readable, responsive card grid:
// 3 columns on desktop, 2 on tablet, 1 on mobile. Each card keeps the same
// icon + text-label status signal as before (never color alone).
export default function AgentTimeline(props) {
  const stages = computeStages(props);

  return (
    <div
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Growth Agent run progress"
    >
      {stages.map((stage, i) => {
        const label = statusLabel(stage);
        return (
          <div
            key={stage.label}
            role="listitem"
            className="flex flex-col rounded-[14px] border p-4"
            style={{
              background: stage.done
                ? "var(--sp-success-soft)"
                : stage.active
                ? "var(--sp-primary-soft)"
                : "var(--sp-surface-muted)",
              borderColor: stage.done
                ? "var(--sp-success)"
                : stage.active
                ? "var(--sp-primary)"
                : "var(--sp-border)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                style={{
                  background: "var(--sp-surface)",
                  color: stage.done
                    ? "var(--sp-success)"
                    : stage.active
                    ? "var(--sp-primary)"
                    : "var(--sp-text-faint)",
                  border: "1px solid var(--sp-border)",
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]"
                style={{
                  background: "var(--sp-surface)",
                  color: stage.done
                    ? "var(--sp-success)"
                    : stage.active
                    ? "var(--sp-primary)"
                    : "var(--sp-text-faint)",
                }}
              >
                <StageIcon done={stage.done} active={stage.active} />
                {label}
              </span>
            </div>

            <p className="mt-3 text-[13.5px] font-semibold text-[var(--sp-text)]">{stage.label}</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--sp-text-faint)]">{stage.description}</p>
          </div>
        );
      })}
    </div>
  );
}
