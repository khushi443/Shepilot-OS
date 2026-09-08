import { Sparkles, Target, ShieldCheck, Zap, Compass, Rocket, BarChart3, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorCard from "../components/ui/ErrorCard";
import Skeleton from "../components/ui/Skeleton";
import GrowthSection from "../components/growth/GrowthSection";
import AgentTimeline from "../components/growth/AgentTimeline";
import GrowthIntakeForm from "../components/growth/GrowthIntakeForm";
import OpportunityResult from "../components/growth/OpportunityResult";
import ApprovalPanel from "../components/growth/ApprovalPanel";
import ExecutionResult from "../components/growth/ExecutionResult";
import EvaluationResult from "../components/growth/EvaluationResult";
import NextBestAction from "../components/growth/NextBestAction";
import { useGrowthAnalysis } from "../hooks/useGrowthAnalysis";
import { useApprovalExecution } from "../hooks/useApprovalExecution";
import { useEvaluation } from "../hooks/useEvaluation";
import {
  getBusinessContext,
  hasBusinessContext,
  getJourneyProgress,
  getCurrentStage,
} from "../utils/businessContext";

// Phase 0 scaffolded the page's structure (Context Summary, Agent Timeline,
// Opportunity & Recommendation, Approval Panel, Execution Result,
// Evaluation / Next Best Action) with no agent logic behind any of it.
//
// Phase 1 — Understand & Recommend — wired up the "Opportunity &
// Recommendation" step: a growth intake form (existing business context +
// 3 growth-specific fields) that calls /api/analyze-growth and renders its
// structured, READ-ONLY recommendation.
//
// Phase 2 — Approval + Mock Execution — wired up "Approval Panel" and
// "Execution Result" against a fully deterministic LOCAL SANDBOX
// (api/execute-mock-payment-link.js). That endpoint still exists in the
// repo as an explicit, separate mock implementation, but is no longer used
// by this page.
//
// Phase 3 — Approval + Real Razorpay Test Mode Execution — the founder can
// edit the Phase 1 recommendation's proposed payment-link parameters
// (INR only in this phase), then explicitly Approve or Decline. Approving
// calls /api/growth/execute, which creates a REAL Razorpay Payment Link
// using Razorpay TEST MODE credentials, server-side only. "Check Status"
// calls /api/growth/status, which queries Razorpay server-side.
//
// Phase 4 — Evaluation + Next Best Action — once a Phase 3 execution
// result exists, the founder can run an evaluation (/api/growth/evaluate,
// server-side AI call) that is grounded in the real Razorpay Test Mode
// status rather than any claim the AI makes on its own, plus a specific,
// contextual Next Best Action. Approving the Next Best Action only
// records that decision — it does NOT execute anything; running a next
// action is out of scope until a later phase.
//
// Phase 5 — Final Polish + Demo Readiness — no new agent behavior. The
// Agent Timeline now reflects real state instead of a static preview,
// "Start New Growth Analysis" cascades a full reset across all three
// hooks (previously only the Step 3 result was cleared, leaving stale
// execution/evaluation state behind), and stale Phase 0/1 UI (the
// "Coming Soon" badge, the permanently-disabled bottom CTA, and the
// duplicate disabled "Create Payment Link" button in OpportunityResult)
// has been removed since the flow it was hedging against is now live.
export default function GrowthAgent() {
  const navigate = useNavigate();
  const founderHasContext = hasBusinessContext();
  const context = founderHasContext ? getBusinessContext() : null;
  const ideaPreview = context?.ideaText ? context.ideaText.slice(0, 220) : "";

  // Reuses the same journey-progress mechanism the Dashboard already uses
  // for its "Current Stage" KPI — no new context storage, no new fields,
  // just surfacing what getJourneyProgress()/getCurrentStage() already
  // compute from the existing businessContext.
  const journeyProgress = founderHasContext ? getJourneyProgress() : null;
  const currentStage = journeyProgress ? getCurrentStage(journeyProgress) : null;

  const {
    fields,
    setField,
    fieldErrors,
    result,
    loading,
    error,
    runAnalysis,
    reset,
    resultRef,
  } = useGrowthAnalysis();

  const {
    fields: approvalFields,
    setField: setApprovalField,
    fieldErrors: approvalFieldErrors,
    decision,
    executing,
    executionError,
    executionResult,
    checkingStatus,
    statusError,
    approve,
    retryExecute,
    decline,
    checkStatus,
    resetAll: resetApproval,
  } = useApprovalExecution(result);

  const {
    evaluation,
    evaluating,
    evaluationError,
    runEvaluation,
    nextActionDecision,
    approveNextAction,
    declineNextAction,
    resetAll: resetEvaluation,
  } = useEvaluation({ analysis: result, intake: fields, executionResult });

  // "Start New Growth Analysis" — clears Step 3's result AND cascades a
  // full reset through Steps 4-7 so a new run never shows a stale
  // recommendation, execution result, evaluation, or Next Best Action
  // from the previous run (see Phase 5 comment above).
  const startNewAnalysis = () => {
    reset();
    resetApproval();
    resetEvaluation();
  };

  return (
    <DashboardShell
      title="Growth Agent"
      subtitle="Your AI Growth & Agentic Commerce co-pilot"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="AI Growth Agent"
          title="🚀 Growth & Commerce Agent"
          description="Give the agent your business context and it will identify your strongest growth opportunity, recommend a specific commerce action, and — with your approval — carry it out."
          action={
            result && (
              <button
                type="button"
                onClick={startNewAnalysis}
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
              >
                <RotateCcw size={13} />
                Start New Growth Analysis
              </button>
            )
          }
        />

        {/* Screen-reader-only announcements for async state changes — the
            visible loading text lives on the relevant buttons/skeletons,
            but those don't reliably get announced on their own, so this
            gives assistive tech a single place to hear what's happening. */}
        <p className="sr-only" role="status" aria-live="polite">
          {loading && "Analyzing your growth opportunity…"}
          {executing && "Creating Razorpay Test Mode payment link…"}
          {checkingStatus && "Checking payment status…"}
          {evaluating && "Evaluating the result…"}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {/* Context Summary — reuses the existing, already-shared business
              context (read-only, no AI call, no network request). */}
          <GrowthSection
            eyebrow="Step 1"
            title="Context Summary"
            description="What the agent already knows about your business, pulled from your Startup Journey."
            icon={Compass}
          >
            {founderHasContext ? (
              <div
                className="rounded-[14px] border p-4"
                style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
              >
                <div
                  className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-medium"
                  style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
                >
                  <Sparkles size={12} />
                  Context ready — using your startup idea from earlier
                </div>

                {/* Only fields that genuinely exist in the shared business
                    context are shown here — the idea text itself, and the
                    current stage already computed by getCurrentStage()
                    (the same one the Dashboard shows). No new fields are
                    invented and nothing is parsed out of the idea text. */}
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--sp-text-faint)]">
                      Business / idea
                    </dt>
                    <dd className="mt-1 text-[13px] leading-6 text-[var(--sp-text-muted)]">
                      {ideaPreview}
                      {context?.ideaText && context.ideaText.length > 220 ? "…" : ""}
                    </dd>
                  </div>
                  {currentStage && (
                    <div>
                      <dt className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--sp-text-faint)]">
                        Current stage
                      </dt>
                      <dd className="mt-1 text-[13px] font-semibold text-[var(--sp-text)]">
                        {currentStage.stage}
                      </dd>
                      <dd className="text-[12px] leading-5 text-[var(--sp-text-faint)]">
                        {currentStage.description}
                      </dd>
                    </div>
                  )}
                  {journeyProgress && (
                    <div>
                      <dt className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--sp-text-faint)]">
                        Startup Journey progress
                      </dt>
                      <dd className="mt-1 text-[13px] text-[var(--sp-text-muted)]">
                        {journeyProgress.completedCount} of {journeyProgress.total} milestones complete (
                        {journeyProgress.percent}%)
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <div
                className="rounded-[16px] border border-dashed p-8 text-center sm:p-10"
                style={{ borderColor: "var(--sp-border-strong)", background: "var(--sp-surface-muted)" }}
              >
                <div className="mb-3 text-4xl" aria-hidden="true">💡</div>
                <h3 className="text-[15px] font-semibold text-[var(--sp-text)]">No business context yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-5 text-[var(--sp-text-muted)]">
                  Complete the Business Idea tool first so the Growth Agent has something to work with.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/business-idea")}
                  className="mt-5 inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--sp-primary)" }}
                >
                  Build Business Context
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </GrowthSection>

          {/* Agent Timeline — driven by the real state of this run. */}
          <GrowthSection
            eyebrow="Step 2"
            title="Agent Timeline"
            description="Live progress of this Growth Agent run, based on what has actually happened so far."
            icon={Zap}
          >
            <AgentTimeline
              contextReady={founderHasContext}
              analysisLoading={loading}
              hasAnalysis={Boolean(result)}
              decision={decision}
              executing={executing}
              hasExecution={Boolean(executionResult)}
              checkingStatus={checkingStatus}
              hasStatusChecked={Boolean(executionResult?.checkedAt)}
              evaluating={evaluating}
              hasEvaluation={Boolean(evaluation)}
              hasNextAction={Boolean(evaluation?.nextBestAction)}
            />
          </GrowthSection>

          {/* Opportunity & Recommendation */}
          <GrowthSection
            eyebrow="Step 3"
            title="Opportunity & Recommendation"
            description="Tell the agent about your best-selling product, your customer base, and what's blocking growth — it will identify your strongest opportunity and recommend ONE action."
            icon={Target}
          >
            <div ref={resultRef}>
              {!result && (
                <GrowthIntakeForm
                  fields={fields}
                  fieldErrors={fieldErrors}
                  onFieldChange={setField}
                  onSubmit={runAnalysis}
                  loading={loading}
                />
              )}

              {loading && !result && (
                <div className="mt-6">
                  <Skeleton lines={6} />
                </div>
              )}

              {error && !loading && <ErrorCard message={error} onRetry={runAnalysis} />}

              {result && !loading && <OpportunityResult analysis={result} onRunAgain={startNewAnalysis} />}
            </div>
          </GrowthSection>

          {/* Approval Panel */}
          <GrowthSection
            eyebrow="Step 4"
            title="Approval Panel"
            description="Nothing the agent proposes will ever run without your explicit approval."
            icon={ShieldCheck}
          >
            {result ? (
              <ApprovalPanel
                fields={approvalFields}
                fieldErrors={approvalFieldErrors}
                onFieldChange={setApprovalField}
                decision={decision}
                executing={executing}
                executionError={executionError}
                hasExecuted={Boolean(executionResult)}
                onApprove={approve}
                onDecline={decline}
                onRetry={retryExecute}
              />
            ) : (
              <EmptyState
                emoji="✅"
                title="Nothing awaiting your approval"
                description="Any consequential action — like creating a payment link — will be shown here, with editable details, for you to approve or decline first."
              />
            )}
          </GrowthSection>

          {/* Execution Result */}
          <GrowthSection
            eyebrow="Step 5"
            title="Execution Result"
            description="The outcome of an approved action will be shown here — a real Razorpay Test Mode payment link."
            icon={Rocket}
          >
            {executionResult ? (
              <ExecutionResult
                result={executionResult}
                onCheckStatus={checkStatus}
                checkingStatus={checkingStatus}
                statusError={statusError}
              />
            ) : (
              <EmptyState
                emoji="⚡"
                title="No action executed yet"
                description="Once you approve a recommended action, its Razorpay Test Mode result will appear here."
              />
            )}
          </GrowthSection>

          {/* Evaluation */}
          <GrowthSection
            eyebrow="Step 6"
            title="Evaluation"
            description="Once an action has executed, the agent evaluates the observed Razorpay Test Mode outcome — never real business performance."
            icon={BarChart3}
          >
            {!executionResult ? (
              <EmptyState
                emoji="🧭"
                title="Nothing to evaluate yet"
                description="Evaluation runs after you approve and execute a recommended action in Step 5."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {!evaluation && !evaluating && (
                  <button
                    type="button"
                    onClick={runEvaluation}
                    className="inline-flex w-fit items-center gap-2 rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--sp-primary)" }}
                  >
                    <BarChart3 size={14} />
                    Run Evaluation
                  </button>
                )}

                {evaluating && !evaluation && (
                  <div>
                    <Skeleton lines={4} />
                  </div>
                )}

                {evaluationError && !evaluating && <ErrorCard message={evaluationError} onRetry={runEvaluation} />}

                {evaluation && !evaluating && <EvaluationResult evaluation={evaluation} />}
              </div>
            )}
          </GrowthSection>

          {/* Next Best Action */}
          <GrowthSection
            eyebrow="Step 7"
            title="Next Best Action"
            description="A specific, contextual next step — nothing here runs automatically. Any external action needs your explicit approval."
            icon={Compass}
          >
            {evaluation ? (
              <NextBestAction
                action={evaluation.nextBestAction}
                decision={nextActionDecision}
                onApprove={approveNextAction}
                onDecline={declineNextAction}
              />
            ) : (
              <EmptyState
                emoji="🧭"
                title="No next step yet"
                description="A recommended next move will appear here once Step 6's evaluation has run."
              />
            )}
          </GrowthSection>
        </div>

        {/* Once the run has produced a Next Best Action, offer a clear way
            to start a fresh one instead of leaving the founder at a dead
            end — this is the only "what next" prompt on the page, so it
            doesn't duplicate the header's reset button while a run is
            still in progress. */}
        {evaluation && (
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={startNewAnalysis}
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--sp-primary)" }}
            >
              <RotateCcw size={15} />
              Start New Growth Analysis
            </button>
            <p className="text-[12px] text-[var(--sp-text-faint)]">
              This clears the recommendation, execution result, evaluation, and next step above.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
