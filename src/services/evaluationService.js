// Client-side service for the Growth & Commerce Agent's Phase 4 evaluation
// endpoint. Mirrors src/services/growthAgentService.js and
// src/services/paymentLinkService.js's shape (same-origin fetch, no key,
// no AI SDK in the browser) but targets /api/growth/evaluate and returns
// the structured evaluation object.
export async function evaluateGrowthOutcome(payload) {
  let res;
  try {
    res = await fetch("/api/growth/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Growth evaluation request failed:", error);
    throw new Error("Unable to reach the AI service. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. a platform-level error page) — fall through
    // to the generic error below.
  }

  if (!res.ok) {
    throw new Error(data?.error || "Unable to generate the evaluation. Please try again.");
  }

  const evaluation = data?.evaluation;
  if (!evaluation) {
    throw new Error("AI returned an empty evaluation.");
  }

  return evaluation;
}
