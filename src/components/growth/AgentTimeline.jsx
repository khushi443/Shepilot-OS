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

function statusLabel({ done, active }) {
  if (done) return "Done";
  if (active) return "In progress";
  return "Upcoming";
}

export default function AgentTimeline(props) {
  const stages = computeStages(props);

  return (
    <div
      className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0"
      role="list"
      aria-label="Growth Agent run progress"
    >
      {stages.map((stage, i) => {
        const label = statusLabel(stage);
        return (
          <div key={stage.label} className="flex flex-1 flex-col lg:flex-row lg:items-center">
            <div
              role="listitem"
              className="w-full rounded-[12px] border p-3.5 text-left lg:min-h-[116px]"
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
                <StageIcon done={stage.done} active={stage.active} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.06em]"
                  style={{
                    color: stage.done
                      ? "var(--sp-success)"
                      : stage.active
                      ? "var(--sp-primary)"
                      : "var(--sp-text-faint)",
                  }}
                >
                  {label}
                </span>
              </div>
              <p className="mt-2.5 text-[13px] font-semibold text-[var(--sp-text)]">{stage.label}</p>
              <p className="mt-1 text-[11.5px] leading-4 text-[var(--sp-text-faint)]">{stage.description}</p>
            </div>

            {i < stages.length - 1 && (
              <div
                className="mx-auto my-1 h-5 w-px shrink-0 lg:mx-2 lg:my-0 lg:h-px lg:w-5"
                style={{ background: "var(--sp-border-strong)" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
