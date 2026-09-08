import { useCallback, useEffect, useRef, useState } from "react";
import { createPaymentLink, checkPaymentLinkStatus } from "../services/paymentLinkService";

const DEFAULT_EXPIRY_DAYS = 7;
// Phase 3 explicitly narrows scope to INR only (no multi-currency expansion).
const CURRENCIES = ["INR"];

function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + DEFAULT_EXPIRY_DAYS);
  return toDatetimeLocalValue(d);
}

function buildInitialFields(proposedPaymentLink, customerSegment) {
  return {
    amount: proposedPaymentLink?.amount ? String(proposedPaymentLink.amount) : "",
    currency: CURRENCIES.includes(proposedPaymentLink?.currency) ? proposedPaymentLink.currency : "INR",
    description: proposedPaymentLink?.description || proposedPaymentLink?.productName || "",
    expiryAt: defaultExpiry(),
    targetAudienceNote: customerSegment || "",
  };
}

function validateFields(fields) {
  const errors = {};

  const amount = Number(fields.amount);
  if (fields.amount.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Enter an amount greater than 0.";
  }

  if (!CURRENCIES.includes(fields.currency)) {
    errors.currency = "Choose a valid currency.";
  }

  const description = fields.description.trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > 500) {
    errors.description = "Description is too long (max 500 characters).";
  }

  if (!fields.expiryAt) {
    errors.expiryAt = "Expiry is required.";
  } else {
    const expiryDate = new Date(fields.expiryAt);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate.getTime() <= Date.now()) {
      errors.expiryAt = "Expiry must be a valid future date/time.";
    }
  }

  return errors;
}

/**
 * Growth & Commerce Agent — Phase 3 (Approval + Real Razorpay Test Mode
 * Execution).
 *
 * Owns the editable approval fields (prefilled from Phase 1's proposed
 * payment-link parameters), the Approve/Decline decision, the real
 * Razorpay Test Mode execution call, duplicate-submit protection, and the
 * "Check Status" interaction. All Razorpay calls happen server-side — see
 * src/services/paymentLinkService.js, api/growth/execute.js, and
 * api/growth/status.js. Currency is fixed to INR in this phase.
 */
export function useApprovalExecution(analysis) {
  const [fields, setFields] = useState(() =>
    buildInitialFields(analysis?.proposedPaymentLink, analysis?.customerSegment)
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [decision, setDecision] = useState(null); // null | "approved" | "declined"
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState("");
  const [executionResult, setExecutionResult] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  const idempotencyKeyRef = useRef(null);
  const executeInFlightRef = useRef(false);
  const statusInFlightRef = useRef(false);
  const lastAnalysisRef = useRef(analysis);

  // Re-prefill only when a genuinely NEW Phase 1 analysis arrives (not on
  // every render) — running a fresh analysis should reset any prior
  // approval/execution state so a stale sandbox link never lingers next to
  // a different recommendation.
  useEffect(() => {
    if (analysis && analysis !== lastAnalysisRef.current) {
      lastAnalysisRef.current = analysis;
      setFields(buildInitialFields(analysis.proposedPaymentLink, analysis.customerSegment));
      setFieldErrors({});
      setDecision(null);
      setExecuting(false);
      setExecutionError("");
      setExecutionResult(null);
      setStatusError("");
      idempotencyKeyRef.current = null;
    }
  }, [analysis]);

  const setField = useCallback((key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Editing after a decline puts the panel back into "awaiting decision".
    setDecision((prev) => (prev === "declined" ? null : prev));
  }, []);

  const decline = useCallback(() => {
    if (executing) return;
    setDecision("declined");
    setExecutionError("");
  }, [executing]);

  const execute = useCallback(async () => {
    const errors = validateFields(fields);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setExecutionError("Please fix the highlighted fields before approving.");
      return;
    }

    // Duplicate-submit protection: a single in-flight guard plus disabling
    // the Approve control (handled by the component using `executing`)
    // means a double click can never fire two create requests. The same
    // idempotency key is kept for the lifetime of this approval, so even a
    // client-side retry after a failed attempt resolves to the same
    // sandbox resource instead of minting a second one.
    if (executeInFlightRef.current || executionResult) return;
    executeInFlightRef.current = true;

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idem_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    setExecuting(true);
    setExecutionError("");

    try {
      const amount = Number(fields.amount);
      const paymentLink = await createPaymentLink({
        idempotencyKey: idempotencyKeyRef.current,
        amount,
        currency: fields.currency,
        description: fields.description.trim(),
        expiryAt: new Date(fields.expiryAt).toISOString(),
        targetAudienceNote: fields.targetAudienceNote.trim(),
      });

      setExecutionResult(paymentLink);
      setDecision("approved");
    } catch (err) {
      console.error(err);
      setExecutionError(
        err?.message || "Something went wrong creating the Razorpay Test Mode payment link. Please try again."
      );
    } finally {
      setExecuting(false);
      executeInFlightRef.current = false;
    }
  }, [fields, executionResult]);

  // Explicit full reset for "Start New Growth Analysis". The effect above
  // only re-prefills when a NEW analysis object arrives; it does nothing
  // when the founder clears the analysis back to null (Step 3's reset),
  // which previously left a stale executionResult/decision from the prior
  // run visible in Steps 4-5 even though Step 3 looked empty. This is
  // called directly from GrowthAgent.jsx alongside the other hooks' resets.
  const resetAll = useCallback(() => {
    lastAnalysisRef.current = null;
    setFields(buildInitialFields(undefined, undefined));
    setFieldErrors({});
    setDecision(null);
    setExecuting(false);
    setExecutionError("");
    setExecutionResult(null);
    setCheckingStatus(false);
    setStatusError("");
    idempotencyKeyRef.current = null;
  }, []);

  const checkStatus = useCallback(async () => {
    if (!executionResult || statusInFlightRef.current) return;
    statusInFlightRef.current = true;
    setCheckingStatus(true);
    setStatusError("");

    try {
      const { status, checkedAt } = await checkPaymentLinkStatus({
        id: executionResult.id,
      });
      setExecutionResult((prev) => (prev ? { ...prev, status, checkedAt } : prev));
    } catch (err) {
      console.error(err);
      setStatusError(err?.message || "Unable to check status right now. Please try again.");
    } finally {
      setCheckingStatus(false);
      statusInFlightRef.current = false;
    }
  }, [executionResult]);

  return {
    fields,
    setField,
    fieldErrors,
    decision,
    executing,
    executionError,
    executionResult,
    checkingStatus,
    statusError,
    approve: execute,
    retryExecute: execute,
    decline,
    checkStatus,
    resetAll,
  };
}
