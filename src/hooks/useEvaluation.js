import { useCallback, useEffect, useRef, useState } from "react";
import { evaluateGrowthOutcome } from "../services/evaluationService";

/**
 * Growth & Commerce Agent — Phase 4 (Evaluation + Next Best Action).
 *
 * Turns the Phase 3 execution result into an evaluation of what actually
 * happened (grounded in the real Razorpay Test Mode status — see
 * api/growth/evaluate.js for how that's kept honest) and a specific,
 * contextual Next Best Action.
 *
 * IMPORTANT: this hook never executes anything. `approveNextAction` /
 * `declineNextAction` only set local UI state — there is no code path
 * here that calls api/growth/execute.js or any other endpoint. Actually
 * running a Next Best Action is explicitly out of scope for Phase 4.
 */
export function useEvaluation({ analysis, intake, executionResult }) {
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState("");
  const [nextActionDecision, setNextActionDecision] = useState(null); // null | "approved" | "declined"

  const evaluateInFlightRef = useRef(false);
  const lastExecutionResultRef = useRef(executionResult);

  // A genuinely new execution (a fresh Approve, not just a Check Status
  // status refresh) should clear any prior evaluation so it never lingers
  // next to a different payment link. Check Status only mutates fields on
  // the existing executionResult object in useApprovalExecution, it
  // doesn't create a new one — a brand new execution (or a decline reset
  // back to null then a new approve) does, which is what we key off here.
  useEffect(() => {
    if (executionResult !== lastExecutionResultRef.current) {
      const isFreshExecution =
        !lastExecutionResultRef.current ||
        !executionResult ||
        executionResult.id !== lastExecutionResultRef.current.id;

      lastExecutionResultRef.current = executionResult;

      if (isFreshExecution) {
        setEvaluation(null);
        setEvaluationError("");
        setNextActionDecision(null);
      }
    }
  }, [executionResult]);

  const runEvaluation = useCallback(async () => {
    // Evaluation only ever runs once a real execution result exists —
    // there is nothing to evaluate before that.
    if (!executionResult || evaluateInFlightRef.current) return;
    evaluateInFlightRef.current = true;

    setEvaluating(true);
    setEvaluationError("");

    try {
      const result = await evaluateGrowthOutcome({
        businessUnderstanding: analysis?.businessUnderstanding || "",
        customerSegment: analysis?.customerSegment || "",
        biggestBlocker: intake?.biggestBlocker || "",
        pastCustomers:
          intake?.pastCustomers !== undefined && intake?.pastCustomers !== ""
            ? Number(intake.pastCustomers)
            : null,
        growthOpportunities: analysis?.growthOpportunities || [],
        recommendedAction: analysis?.recommendedAction || null,
        product: {
          name: intake?.productName || analysis?.proposedPaymentLink?.productName || "",
          price: intake?.price !== undefined && intake?.price !== "" ? Number(intake.price) : null,
        },
        paymentLink: {
          amount: executionResult.amount,
          currency: executionResult.currency,
          description: executionResult.description,
          targetAudienceNote: executionResult.targetAudienceNote,
          expiryAt: executionResult.expiryAt,
          createdAt: executionResult.createdAt,
          checkedAt: executionResult.checkedAt || "",
          status: executionResult.status,
        },
      });

      setEvaluation(result);
    } catch (err) {
      console.error(err);
      setEvaluationError(err?.message || "Something went wrong generating the evaluation. Please try again.");
    } finally {
      setEvaluating(false);
      evaluateInFlightRef.current = false;
    }
  }, [analysis, intake, executionResult]);

  // Explicit full reset for "Start New Growth Analysis" — see the matching
  // resetAll in useApprovalExecution.js for why this can't rely solely on
  // the executionResult-tracking effect above.
  const resetAll = useCallback(() => {
    lastExecutionResultRef.current = null;
    setEvaluation(null);
    setEvaluating(false);
    setEvaluationError("");
    setNextActionDecision(null);
  }, []);

  const approveNextAction = useCallback(() => {
    setNextActionDecision("approved");
  }, []);

  const declineNextAction = useCallback(() => {
    setNextActionDecision("declined");
  }, []);

  return {
    evaluation,
    evaluating,
    evaluationError,
    runEvaluation,
    nextActionDecision,
    approveNextAction,
    declineNextAction,
    resetAll,
  };
}
