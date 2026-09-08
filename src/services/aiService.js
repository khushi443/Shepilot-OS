// Client-side AI service. This used to call OpenRouter directly from the
// browser via the OpenAI SDK with `dangerouslyAllowBrowser: true`, which
// shipped the OpenRouter API key into the public bundle. The actual
// OpenRouter call — model, system prompt, and the API key — now lives
// server-side in api/generate.js (a Vercel serverless function). This file
// just calls that same-origin endpoint; no key, no AI SDK, nothing secret
// ever touches the browser.
export async function generateAIContent(prompt) {
  const trimmed = typeof prompt === "string" ? prompt.trim() : "";
  if (!trimmed) {
    throw new Error("A prompt is required.");
  }

  let res;
  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: trimmed }),
    });
  } catch (error) {
    console.error("AI proxy request failed:", error);
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
    throw new Error(data?.error || "Unable to generate AI response. Please try again.");
  }

  const response = data?.response;
  if (!response) {
    throw new Error("AI returned an empty response.");
  }

  return response;
}

export const generateBusinessIdea = generateAIContent;
