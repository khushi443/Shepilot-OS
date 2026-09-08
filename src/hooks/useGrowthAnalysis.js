import { useCallback, useRef, useState } from "react";
import { analyzeGrowthOpportunity } from "../services/growthAgentService";
import { buildContextBlock, hasBusinessContext } from "../utils/businessContext";

const HISTORY_TYPE = "Growth Agent";

const initialFields = {
  productName: "",
  price: "",
  pastCustomers: "",
  biggestBlocker: "",
};

function validateFields(fields) {
  const errors = {};

  const productName = fields.productName.trim();
  if (!productName) {
    errors.productName = "Please enter your best-selling product or service.";
  } else if (productName.length < 2) {
    errors.productName = "That name looks too short.";
  }

  const price = Number(fields.price);
  if (fields.price.trim() === "" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Please enter a valid price greater than 0.";
  }

  const pastCustomers = Number(fields.pastCustomers);
  if (fields.pastCustomers.trim() === "" || !Number.isFinite(pastCustomers) || pastCustomers < 0) {
    errors.pastCustomers = "Please enter a valid number (0 or more).";
  }

  const biggestBlocker = fields.biggestBlocker.trim();
  if (!biggestBlocker) {
    errors.biggestBlocker = "Please describe your biggest blocker.";
  } else if (biggestBlocker.length < 5) {
    errors.biggestBlocker = "Please add a little more detail.";
  }

  return errors;
}

/**
 * Growth & Commerce Agent — Phase 1 (Understand & Recommend).
 *
 * Handles the 3 growth-specific intake fields, pulls in existing shared
 * business context (read-only), calls the dedicated analysis endpoint, and
 * exposes loading/error/result state plus retry. This is intentionally
 * separate from useAIGenerator: the intake here is a structured form (not a
 * single free-text box) and the result is structured JSON (not Markdown).
 */
export function useGrowthAnalysis() {
  const [fields, setFields] = useState(initialFields);
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlightRef = useRef(false);
  const resultRef = useRef(null);

  const setField = useCallback((key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runAnalysis = useCallback(async () => {
    const errors = validateFields(fields);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields before running the analysis.");
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setError("");
    setLoading(true);

    try {
      const businessContext = hasBusinessContext() ? buildContextBlock(HISTORY_TYPE) : "";

      const analysis = await analyzeGrowthOpportunity({
        businessContext,
        bestSellingProduct: {
          name: fields.productName.trim(),
          price: Number(fields.price),
        },
        pastCustomers: Number(fields.pastCustomers),
        biggestBlocker: fields.biggestBlocker.trim(),
      });

      setResult(analysis);

      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      console.error(err);
      const message = err?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [fields]);

  // "Start New Growth Analysis" — clears the form back to a genuinely blank
  // slate (not just the result), so a new run never shows leftover answers
  // from the previous one. Downstream state (approval/execution/evaluation)
  // is cleared separately in GrowthAgent.jsx via each hook's own reset, since
  // this hook has no visibility into them.
  const reset = useCallback(() => {
    setFields(initialFields);
    setResult(null);
    setError("");
    setFieldErrors({});
  }, []);

  return {
    fields,
    setField,
    fieldErrors,
    result,
    loading,
    error,
    runAnalysis,
    reset,
    resultRef,
  };
}
