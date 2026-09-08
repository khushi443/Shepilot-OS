import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { generateAIContent } from "../services/aiService";
import { saveAIHistory } from "../services/firestoreService";
import { auth } from "../firebase/firebase";
import {
  canGenerate,
  incrementUsage,
} from "../services/usageService";
import {
  buildContextBlock,
  getPrefillInput,
  updateBusinessContext,
} from "../utils/businessContext";
/**
 * Shared logic for every "describe your idea -> AI generates a plan" page.
 *
 * Handles: input state, in-flight duplicate-request prevention, loading state,
 * user-friendly error surfacing, saving to Firestore history, and scrolling
 * the freshly generated result into view.
 */
export function useAIGenerator({ historyType, buildPrompt, minInputLength = 10 }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);
  const inFlightRef = useRef(false);

  // Auto-fill from whatever the founder already built on a previous step
  // (e.g. their idea), so they don't have to retype it here.
  useEffect(() => {
    setInput((current) => current || getPrefillInput(historyType));
  }, [historyType]);

  const generate = useCallback(async () => {
    const trimmed = input.trim();

    if (!trimmed) {
      toast.error("Please describe your idea first.");
      return;
    }

    if (trimmed.length < minInputLength) {
      toast.error(`Please add a little more detail (at least ${minInputLength} characters).`);
      return;
    }

    // Prevent duplicate concurrent submissions (double-click, double-enter, etc.)
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setError("");
    setLoading(true);
try {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("Please login first.");
  }

  const allowed = await canGenerate(uid);

  if (!allowed) {
    toast.error("🚫 Daily AI limit reached (5/5). Upgrade to Pro.");
    return;
  }

      const prompt = buildPrompt(trimmed);
      const contextBlock = buildContextBlock(historyType);
      const fullPrompt = contextBlock ? `${contextBlock}${prompt}` : prompt;
      const response = await generateAIContent(fullPrompt);

      setResult(response);
      await incrementUsage(uid);

      // Make this result available to every downstream tool automatically.
      updateBusinessContext(historyType, trimmed, response);

      // History save failures shouldn't hide a successful generation from the user.
      try {
        await saveAIHistory(historyType, trimmed.slice(0, 80), fullPrompt, response);
      } catch (historyErr) {
        console.error("Failed to save AI history:", historyErr);
      }

      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      console.error(err);
      const message = err?.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [input, buildPrompt, historyType, minInputLength]);

  return { input, setInput, result, loading, error, generate, resultRef };
}
