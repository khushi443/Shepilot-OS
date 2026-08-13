import OpenAI from "openai";

// Server-side proxy for OpenRouter. Runs as a Vercel serverless function
// (this file lives under /api, Vercel's convention for that), so this code
// never ships to the browser and OPENROUTER_API_KEY never appears in the
// client bundle. This replaces the old approach in src/services/aiService.js
// where the OpenAI client ran in the browser with
// `dangerouslyAllowBrowser: true` and the key was inlined via a
// VITE_-prefixed env var (anything VITE_-prefixed is public by design —
// Vite bakes it into the shipped JS).
//
// The system prompt and model are intentionally duplicated from the old
// client-side aiService.js rather than imported from src/ — Vercel traces
// each function's own file, and keeping this file self-contained avoids any
// ambiguity about what gets bundled into the function.

const MODEL = "deepseek/deepseek-chat-v3-0324";

const SYSTEM_PROMPT = `
You are ShePilot AI, the world's best AI startup mentor for first-time women entrepreneurs.

Your mission is to help users discover, validate, launch, manage, and grow successful businesses.

Rules:

- Always answer in professional English.
- Always use Markdown formatting.
- Use clear headings.
- Use bullet points whenever possible.
- Use numbered steps when explaining a process.
- Keep answers practical and actionable.
- Never give vague advice.
- Always think like a startup mentor, business consultant, investor, and product strategist.
- Whenever possible include:
  • Business insights
  • Risks
  • Opportunities
  • Action Plan
  • Next Steps
- If financial estimates are requested, clearly state they are approximate.
- Make every response structured and visually easy to read.
`;

// Read at request time (not module load time) so a missing key produces a
// clean 500 response instead of a cold-start crash.
function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
}

function errorMessageForStatus(status) {
  switch (status) {
    case 401:
      return "Invalid OpenRouter API key.";
    case 402:
      return "OpenRouter account has insufficient credits.";
    case 429:
      return "Rate limit exceeded. Please try again in a moment.";
    case 500:
      return "AI server error. Please try again.";
    default:
      return "Unable to generate AI response. Please try again.";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const client = getClient();
  if (!client) {
    console.error("OPENROUTER_API_KEY is not set on the server.");
    return res.status(500).json({ error: "AI service is not configured." });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) {
    return res.status(400).json({ error: "A prompt is required." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 2500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const response = completion?.choices?.[0]?.message?.content?.trim();
    if (!response) {
      return res.status(502).json({ error: "AI returned an empty response." });
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return res.status(status).json({ error: errorMessageForStatus(status) });
  }
}
