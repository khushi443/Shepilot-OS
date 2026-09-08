// Client-side service for the Growth & Commerce Agent's analysis endpoint.
// Mirrors src/services/aiService.js's shape (same-origin fetch, no key, no
// AI SDK in the browser) but targets the dedicated /api/analyze-growth
// endpoint and returns a parsed, structured object instead of Markdown text.
export async function analyzeGrowthOpportunity({
  businessContext,
  bestSellingProduct,
  pastCustomers,
  biggestBlocker,
}) {
  let res;
  try {
    res = await fetch("/api/analyze-growth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessContext: businessContext || "",
        bestSellingProduct,
        pastCustomers,
        biggestBlocker,
      }),
    });
  } catch (error) {
    console.error("Growth analysis request failed:", error);
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
    throw new Error(data?.error || "Unable to generate growth analysis. Please try again.");
  }

  const analysis = data?.analysis;
  if (!analysis) {
    throw new Error("AI returned an empty analysis.");
  }

  return analysis;
}
