import OpenAI from "openai";

// Server-side proxy for OpenRouter — Growth & Commerce Agent, Phase 1
// (Understand & Recommend). Runs as its own Vercel serverless function
// (this file lives under /api, Vercel's convention), so OPENROUTER_API_KEY
// never appears in the client bundle.
//
// This is intentionally a SEPARATE function from api/generate.js rather than
// a shared module: Vercel traces each function's own file for what gets
// bundled, and api/generate.js's existing behavior/contract must not change.
// The system prompt, model config, and OpenRouter client setup are
// duplicated here on purpose, matching the pattern already established in
// api/generate.js.
//
// Unlike /api/generate (free-form Markdown), this endpoint returns a single
// structured JSON object matching a fixed schema — see ANALYSIS_SCHEMA below
// — so the client can render dedicated UI (score, action, steps, proposed
// payment-link parameters) instead of parsing Markdown.
//
// Phase 1 scope: this endpoint only produces a READ-ONLY recommendation.
// It never creates a Razorpay Payment Link, never touches Razorpay
// credentials, and has no concept of approval/execution/status/evaluation —
// those arrive in later phases.

const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1";

// Documents the exact contract the model must return and that the server
// validates against. Keep in sync with the shape validated in
// validateAnalysis() below and with src/components/growth/OpportunityResult.jsx
// on the client.
const ANALYSIS_SCHEMA_DESCRIPTION = `
Return ONLY a single valid JSON object (no Markdown, no code fences, no commentary before or after it) with EXACTLY this shape:

{
  "businessUnderstanding": "string — 2-4 sentences summarizing what this business is and does, grounded in the context given",
  "customerSegment": "string — 1-3 sentences describing the founder's primary customer segment",
  "growthOpportunities": ["string", "string", "..."],
  "opportunityScore": 0,
  "recommendedAction": {
    "title": "string — a short name for the ONE recommended commerce action",
    "description": "string — 1-3 sentences describing exactly what this action is"
  },
  "reasoning": "string — 2-5 sentences explaining why this is the single best action right now",
  "executionSteps": ["string", "string", "..."],
  "proposedPaymentLink": {
    "productName": "string",
    "amount": 0,
    "currency": "INR",
    "description": "string — short line item description suitable for a payment link"
  }
}

Rules:
- "growthOpportunities" must contain 2 to 5 short items (each a single sentence or phrase).
- "opportunityScore" must be an integer from 0 to 100 reflecting how strong and immediately actionable the opportunity is.
- "recommendedAction" must describe exactly ONE action — never a list of multiple options.
- "executionSteps" must contain 3 to 6 concrete, ordered, founder-doable steps (no vague advice).
- "proposedPaymentLink" must be filled in with your best-guess parameters even when the recommended action is not itself a payment link (e.g. base it on the best-selling product/service and price given). These are PROPOSED parameters only — nothing will be created from them.
- Do not invent specific customer names, exact revenue figures, or facts not supported by the given context — keep numeric claims generic/approximate where the context doesn't specify them.
- Output must be valid, parseable JSON. Do not wrap it in Markdown code fences. Do not include any text outside the JSON object.
`.trim();

const SYSTEM_PROMPT = `
You are the ShePilot Growth & Commerce Agent, an AI growth advisor for first-time women entrepreneurs.

You are currently in the "Understand & Recommend" phase: read the founder's business context and growth intake answers, then identify their single strongest, most immediately actionable growth opportunity and recommend ONE specific commerce action for it.

This phase is READ-ONLY. You are not executing anything, not creating any payment link, and not asking for approval — you are only analyzing and recommending.

${ANALYSIS_SCHEMA_DESCRIPTION}
`.trim();

// Read at request time (not module load time) so a missing key produces a
// clean 500 response instead of a cold-start crash.
function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
}

function errorMessageForStatus(status, error) {
  const upstreamMessage = error?.error?.message || error?.message || "";

  switch (status) {
    case 400:
      return upstreamMessage
        ? `Invalid request to OpenRouter: ${upstreamMessage}`
        : "Invalid request to OpenRouter (check the configured model).";
    case 401:
      return "Invalid OpenRouter API key.";
    case 402:
      return "OpenRouter account has insufficient credits.";
    case 404:
      return "The configured OpenRouter model was not found. Check OPENROUTER_MODEL.";
    case 429:
      return "Rate limit exceeded. Please try again in a moment.";
    case 500:
    case 502:
    case 503:
      return "OpenRouter is temporarily unavailable. Please try again.";
    default:
      return upstreamMessage || "Unable to generate growth analysis. Please try again.";
  }
}

// ---- Request body validation -----------------------------------------

function validationError(message) {
  const err = new Error(message);
  err.isValidationError = true;
  return err;
}

function parseRequestBody(body) {
  const businessContext =
    typeof body?.businessContext === "string" ? body.businessContext.trim().slice(0, 8000) : "";

  const productNameRaw = body?.bestSellingProduct?.name;
  const productName = typeof productNameRaw === "string" ? productNameRaw.trim() : "";
  if (!productName || productName.length < 2) {
    throw validationError("Please provide your best-selling product or service name.");
  }
  if (productName.length > 200) {
    throw validationError("Product/service name is too long (max 200 characters).");
  }

  const priceRaw = body?.bestSellingProduct?.price;
  const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw);
  if (!Number.isFinite(price) || price <= 0) {
    throw validationError("Please provide a valid price for your best-selling product or service.");
  }

  const pastCustomersRaw = body?.pastCustomers;
  const pastCustomers = typeof pastCustomersRaw === "number" ? pastCustomersRaw : Number(pastCustomersRaw);
  if (!Number.isFinite(pastCustomers) || pastCustomers < 0) {
    throw validationError("Please provide a valid approximate number of past/repeat customers (0 or more).");
  }

  const blockerRaw = body?.biggestBlocker;
  const biggestBlocker = typeof blockerRaw === "string" ? blockerRaw.trim() : "";
  if (!biggestBlocker || biggestBlocker.length < 5) {
    throw validationError(
      "Please describe your biggest blocker to getting paid or getting repeat purchases (at least 5 characters)."
    );
  }
  if (biggestBlocker.length > 1000) {
    throw validationError("Biggest blocker description is too long (max 1000 characters).");
  }

  return {
    businessContext,
    bestSellingProduct: { name: productName, price },
    pastCustomers: Math.round(pastCustomers),
    biggestBlocker,
  };
}

function buildUserPrompt({ businessContext, bestSellingProduct, pastCustomers, biggestBlocker }) {
  const contextSection = businessContext
    ? `Existing business context already built up on ShePilot OS:\n${businessContext}\n\n---\n\n`
    : "";

  return `${contextSection}Growth intake answers from the founder:
- Best-selling product/service: ${bestSellingProduct.name}
- Price of that product/service: ${bestSellingProduct.price}
- Approximate number of past/repeat customers: ${pastCustomers}
- Biggest blocker to getting paid or getting repeat purchases: ${biggestBlocker}

Analyze this and respond with the JSON object described in your instructions.`;
}

// ---- JSON extraction & schema validation -------------------------------

function extractJSON(rawText) {
  if (typeof rawText !== "string") return null;

  let cleaned = rawText.trim();
  // Strip ```json ... ``` or ``` ... ``` fences if the model added them
  // despite instructions.
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall through to a best-effort extraction below.
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const sub = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(sub);
    } catch {
      return null;
    }
  }

  return null;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string");
}

// Validates shape + coerces/clamps values into the exact contract the
// client expects. Returns { valid: true, data } or { valid: false, errors }.
function validateAndNormalizeAnalysis(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object") {
    return { valid: false, errors: ["Response was not a JSON object."] };
  }

  if (!isNonEmptyString(obj.businessUnderstanding)) errors.push("businessUnderstanding");
  if (!isNonEmptyString(obj.customerSegment)) errors.push("customerSegment");
  if (!isStringArray(obj.growthOpportunities)) errors.push("growthOpportunities");
  if (typeof obj.opportunityScore !== "number" && Number.isNaN(Number(obj.opportunityScore))) {
    errors.push("opportunityScore");
  }
  if (!obj.recommendedAction || !isNonEmptyString(obj.recommendedAction.title) || !isNonEmptyString(obj.recommendedAction.description)) {
    errors.push("recommendedAction");
  }
  if (!isNonEmptyString(obj.reasoning)) errors.push("reasoning");
  if (!isStringArray(obj.executionSteps)) errors.push("executionSteps");
  if (
    !obj.proposedPaymentLink ||
    !isNonEmptyString(obj.proposedPaymentLink.productName) ||
    (typeof obj.proposedPaymentLink.amount !== "number" && Number.isNaN(Number(obj.proposedPaymentLink.amount)))
  ) {
    errors.push("proposedPaymentLink");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const score = Math.round(Number(obj.opportunityScore));
  const amount = Number(obj.proposedPaymentLink.amount);

  const data = {
    businessUnderstanding: obj.businessUnderstanding.trim(),
    customerSegment: obj.customerSegment.trim(),
    growthOpportunities: obj.growthOpportunities.map((s) => s.trim()).filter(Boolean).slice(0, 5),
    opportunityScore: Math.min(100, Math.max(0, score)),
    recommendedAction: {
      title: obj.recommendedAction.title.trim(),
      description: obj.recommendedAction.description.trim(),
    },
    reasoning: obj.reasoning.trim(),
    executionSteps: obj.executionSteps.map((s) => s.trim()).filter(Boolean).slice(0, 6),
    proposedPaymentLink: {
      productName: obj.proposedPaymentLink.productName.trim(),
      amount: Number.isFinite(amount) ? Math.max(0, amount) : 0,
      currency:
        isNonEmptyString(obj.proposedPaymentLink.currency) ? obj.proposedPaymentLink.currency.trim() : "INR",
      description: isNonEmptyString(obj.proposedPaymentLink.description)
        ? obj.proposedPaymentLink.description.trim()
        : "",
    },
  };

  if (data.growthOpportunities.length === 0 || data.executionSteps.length === 0) {
    return { valid: false, errors: ["growthOpportunities/executionSteps empty after normalization"] };
  }

  return { valid: true, data };
}

// ---- OpenRouter call ----------------------------------------------------

async function callModel(client, messages) {
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.6,
    max_tokens: 2000,
    messages,
  });

  const text = completion?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    const err = new Error("AI returned an empty response.");
    err.isEmptyResponse = true;
    throw err;
  }
  return text;
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

  let parsedInput;
  try {
    parsedInput = parseRequestBody(req.body);
  } catch (err) {
    if (err.isValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Unexpected validation error:", err);
    return res.status(400).json({ error: "Invalid request." });
  }

  const userPrompt = buildUserPrompt(parsedInput);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  let rawText;
  try {
    rawText = await callModel(client, messages);
  } catch (error) {
    if (error.isEmptyResponse) {
      return res.status(502).json({ error: error.message });
    }
    console.error("OpenRouter Error (analyze-growth, first attempt):", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return res.status(status).json({ error: errorMessageForStatus(status, error) });
  }

  let parsed = extractJSON(rawText);
  let validation = validateAndNormalizeAnalysis(parsed);

  // Malformed/invalid JSON handling: give the model one chance to repair
  // its own output before giving up, rather than failing on the first
  // formatting slip.
  if (!validation.valid) {
    console.warn("Growth analysis: first response failed validation, retrying once.", validation.errors);
    try {
      const repairMessages = [
        ...messages,
        { role: "assistant", content: rawText },
        {
          role: "user",
          content: `That response was not valid JSON matching the required schema (problem fields: ${validation.errors.join(
            ", "
          )}). Reply again with ONLY the corrected, valid JSON object — no Markdown, no code fences, no extra text.`,
        },
      ];
      const repairedText = await callModel(client, repairMessages);
      parsed = extractJSON(repairedText);
      validation = validateAndNormalizeAnalysis(parsed);
    } catch (error) {
      console.error("OpenRouter Error (analyze-growth, repair attempt):", error);
      // Fall through — validation.valid is still false, handled below.
    }
  }

  if (!validation.valid) {
    console.error("Growth analysis: response still invalid after retry.", validation.errors);
    return res.status(502).json({
      error: "The AI analysis could not be understood. Please try again.",
    });
  }

  return res.status(200).json({ analysis: validation.data });
}
