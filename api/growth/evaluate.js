import OpenAI from "openai";

// Server-side endpoint for the Growth & Commerce Agent's Phase 4
// (Evaluation + Next Best Action). Runs as its own Vercel serverless
// function (this file lives under /api/growth, alongside execute.js and
// status.js), separate from api/generate.js and api/analyze-growth.js —
// nothing here is imported by or imports those files, and none of them
// are touched. Matches the duplication convention already established by
// api/analyze-growth.js (its own OpenRouter client setup, its own copy of
// shared-shaped helpers) rather than sharing a module across functions.
//
// SAFETY DESIGN — read this before changing anything below:
//
// The single most important property of this endpoint is that it NEVER
// lets the AI decide what actually happened to the Razorpay Test Mode
// payment link. `outcome` is computed here, deterministically, from the
// `paymentLinkStatus` the client sends (which itself came from
// api/growth/execute.js / api/growth/status.js — real Razorpay Test Mode
// responses). The AI is only ever asked to narrate/explain an outcome
// that has ALREADY been fixed by this server; its own `outcome` field in
// the JSON it returns is discarded and overwritten. This makes it
// structurally impossible for the model to claim a customer paid when
// Razorpay never reported that.
//
// If the incoming status isn't a status Razorpay actually reports, this
// endpoint does not call the AI at all — it returns a fully deterministic
// "unknown" evaluation. No business/customer metrics are ever invented.

const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1";

// The only statuses Razorpay Test Mode payment links can actually report.
// See api/growth/execute.js / api/growth/status.js. "unknown" is never a
// real Razorpay status — it's our own fallback for "we don't know".
const KNOWN_RAZORPAY_STATUSES = new Set(["created", "partially_paid", "paid", "cancelled", "expired"]);

const EVALUATION_SCHEMA_DESCRIPTION = `
Return ONLY a single valid JSON object (no Markdown, no code fences, no commentary before or after it) with EXACTLY this shape:

{
  "outcome": "created | partially_paid | paid | cancelled | expired | unknown",
  "summary": "string — 2-4 sentences",
  "what_worked": ["string", "..."],
  "what_did_not_work": ["string", "..."],
  "business_signal": "string — 1-2 sentences",
  "confidence": 0,
  "nextBestAction": {
    "title": "string — a short name for ONE specific next action",
    "reason": "string — 1-3 sentences on why this action, referencing the actual business context given",
    "type": "string — short category label, e.g. payment_link, pricing, messaging, follow_up, content",
    "steps": ["string", "..."],
    "expectedImpact": "string — 1-2 sentences, no invented numbers",
    "requiresApproval": true
  }
}

Rules:
- The "outcome" value you return will be IGNORED and replaced by the server with the real, already-known Razorpay Test Mode status — do not worry about getting it "right", just write field content that is consistent with the outcome stated in the prompt below.
- "what_worked" and "what_did_not_work" may be empty arrays ([]) if there is genuinely nothing to report yet (e.g. a link that was just created has no outcome data at all) — do NOT pad them with invented content.
- "confidence" is an integer 0-100 reflecting how much real signal is actually available (a freshly created Test Mode link with no status change should get LOW confidence, since there is no observed customer behavior yet).
- "nextBestAction.steps" must contain 2 to 6 concrete, founder-doable steps.
- "nextBestAction.requiresApproval" must be true whenever the action would create another payment link, send anything to a customer, or take any other external/system action. Set it false only for a purely internal/manual suggestion that requires nothing from this system.
- Never invent specific customer names, real payment counts, revenue figures, or any business outcome that was not given to you or reported by Razorpay.
- Output must be valid, parseable JSON. Do not wrap it in Markdown code fences. Do not include any text outside the JSON object.
`.trim();

const SYSTEM_PROMPT = `
You are the ShePilot Growth & Commerce Agent, an AI growth advisor for first-time women entrepreneurs.

You are currently in the "Evaluation + Next Best Action" phase: given the founder's business context, the action that was recommended and approved, and what actually happened to the Razorpay Test Mode payment link that was created for it, you must (1) honestly evaluate the outcome and (2) recommend ONE specific, contextual next action.

CRITICAL — this is Razorpay TEST MODE, not a live payment gateway. You must always distinguish between:
- the observed Test Mode payment-link state (what Razorpay actually reports), and
- real business/customer performance (which this system has no way to observe and must never claim).

Follow these rules strictly:
- If the status is "created": say the payment link was created and no customer payment outcome has been observed yet. Do NOT say customers are not paying, are uninterested, or that the offer failed — none of that has been observed.
- If the status is "partially_paid" or "paid": describe this ONLY as a Razorpay Test Mode payment event. Do NOT describe it as real business revenue, real customer demand, or real money received.
- If the status is "cancelled" or "expired": say the link was cancelled/expired and suggest a concrete follow-up, without claiming to know why a real customer did or didn't act (Test Mode links are not necessarily interacted with by real customers).
- If the status is "unknown": say plainly that the payment status could not be confirmed and that evaluation is limited as a result. Do not guess at an outcome.
- Never fabricate customer counts, payment amounts beyond what was given to you, conversion rates, or any other business metric.

${EVALUATION_SCHEMA_DESCRIPTION}
`.trim();

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
      return upstreamMessage || "Unable to generate the evaluation. Please try again.";
  }
}

// ---- Request body validation -----------------------------------------

function validationError(message) {
  const err = new Error(message);
  err.isValidationError = true;
  return err;
}

function optionalString(value, max) {
  const str = typeof value === "string" ? value.trim() : "";
  return str.slice(0, max);
}

function parseRequestBody(body) {
  // Everything here is context ALREADY established in earlier phases
  // (Phase 1 analysis, the founder's edited/approved payment-link
  // parameters, and the real Razorpay Test Mode response) — this endpoint
  // does not accept or trust any new claims about business outcomes.
  const businessUnderstanding = optionalString(body?.businessUnderstanding, 4000);
  const customerSegment = optionalString(body?.customerSegment, 2000);
  const biggestBlocker = optionalString(body?.biggestBlocker, 1000);

  const pastCustomersRaw = body?.pastCustomers;
  const pastCustomers =
    pastCustomersRaw === undefined || pastCustomersRaw === null || pastCustomersRaw === ""
      ? null
      : Number(pastCustomersRaw);

  const recommendedActionTitle = optionalString(body?.recommendedAction?.title, 300);
  const recommendedActionDescription = optionalString(body?.recommendedAction?.description, 1000);

  const growthOpportunities = Array.isArray(body?.growthOpportunities)
    ? body.growthOpportunities.filter((s) => typeof s === "string" && s.trim()).slice(0, 5)
    : [];

  const productName = optionalString(body?.product?.name, 200);
  const priceRaw = body?.product?.price;
  const price = priceRaw === undefined || priceRaw === null || priceRaw === "" ? null : Number(priceRaw);

  const paymentLink = body?.paymentLink;
  if (!paymentLink || typeof paymentLink !== "object") {
    throw validationError("Payment link details are required to run an evaluation.");
  }

  const amountRaw = paymentLink.amount;
  const amount = amountRaw === undefined || amountRaw === null || amountRaw === "" ? null : Number(amountRaw);
  const currency = optionalString(paymentLink.currency, 10) || "INR";
  const description = optionalString(paymentLink.description, 500);
  const targetAudienceNote = optionalString(paymentLink.targetAudienceNote, 500);
  const expiryAt = optionalString(paymentLink.expiryAt, 100);
  const createdAt = optionalString(paymentLink.createdAt, 100);
  const checkedAt = optionalString(paymentLink.checkedAt, 100);

  // The one field this whole endpoint's honesty guarantee hinges on.
  const rawStatus = typeof paymentLink.status === "string" ? paymentLink.status.trim() : "";

  return {
    businessUnderstanding,
    customerSegment,
    biggestBlocker,
    pastCustomers: Number.isFinite(pastCustomers) ? pastCustomers : null,
    recommendedAction: {
      title: recommendedActionTitle,
      description: recommendedActionDescription,
    },
    growthOpportunities,
    product: {
      name: productName,
      price: Number.isFinite(price) ? price : null,
    },
    paymentLink: {
      amount: Number.isFinite(amount) ? amount : null,
      currency,
      description,
      targetAudienceNote,
      expiryAt,
      createdAt,
      checkedAt,
      rawStatus,
    },
  };
}

// ---- Deterministic outcome resolution -----------------------------------

// This is the load-bearing safety function in this file: it is the ONLY
// place `outcome` is decided, and it never consults the AI.
function resolveOutcome(rawStatus) {
  if (KNOWN_RAZORPAY_STATUSES.has(rawStatus)) {
    return { outcome: rawStatus, statusKnown: true };
  }
  return { outcome: "unknown", statusKnown: false };
}

// ---- Deterministic fallback (no AI call) --------------------------------

function buildUnknownFallback(input) {
  const productNote = input.product.name ? ` for ${input.product.name}` : "";
  return {
    outcome: "unknown",
    summary:
      "The Razorpay Test Mode payment link's status could not be confirmed, so this evaluation is limited. " +
      "No customer or payment outcome can be reported until the status is available.",
    what_worked: [],
    what_did_not_work: [],
    business_signal:
      "No business signal is available — the payment-link status is unknown, so nothing about real or Test Mode customer activity can be reported.",
    confidence: 0,
    nextBestAction: {
      title: `Confirm the Razorpay Test Mode payment link status${productNote}`,
      reason:
        "Evaluation and any next commerce action depend on knowing what actually happened to the payment link. Until the status is confirmed, recommending a specific next step would be guessing.",
      type: "verification",
      steps: [
        "Use Check Status on the Execution Result to query Razorpay again.",
        "If the status still can't be confirmed, verify the Razorpay Test Mode credentials and try again.",
      ],
      expectedImpact: "Unlocks a grounded evaluation and a specific next action once the real status is known.",
      requiresApproval: false,
    },
  };
}

// ---- JSON extraction & schema validation (mirrors analyze-growth.js) ----

function extractJSON(rawText) {
  if (typeof rawText !== "string") return null;

  let cleaned = rawText.trim();
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
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

// Validates shape + coerces/clamps values. Note: `obj.outcome` is
// deliberately NOT validated as authoritative here — the caller always
// overwrites it with the server-resolved value. Returns
// { valid: true, data } or { valid: false, errors }.
function validateAndNormalizeEvaluation(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object") {
    return { valid: false, errors: ["Response was not a JSON object."] };
  }

  if (!isNonEmptyString(obj.summary)) errors.push("summary");
  if (!isStringArray(obj.what_worked)) errors.push("what_worked");
  if (!isStringArray(obj.what_did_not_work)) errors.push("what_did_not_work");
  if (!isNonEmptyString(obj.business_signal)) errors.push("business_signal");
  if (typeof obj.confidence !== "number" && Number.isNaN(Number(obj.confidence))) errors.push("confidence");

  const nba = obj.nextBestAction;
  if (
    !nba ||
    !isNonEmptyString(nba.title) ||
    !isNonEmptyString(nba.reason) ||
    !isNonEmptyString(nba.type) ||
    !isStringArray(nba.steps) ||
    nba.steps.length === 0 ||
    !isNonEmptyString(nba.expectedImpact)
  ) {
    errors.push("nextBestAction");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const confidence = Math.round(Number(obj.confidence));

  const data = {
    summary: obj.summary.trim(),
    what_worked: obj.what_worked.map((s) => s.trim()).filter(Boolean),
    what_did_not_work: obj.what_did_not_work.map((s) => s.trim()).filter(Boolean),
    business_signal: obj.business_signal.trim(),
    confidence: Math.min(100, Math.max(0, confidence)),
    nextBestAction: {
      title: nba.title.trim(),
      reason: nba.reason.trim(),
      type: nba.type.trim(),
      steps: nba.steps.map((s) => s.trim()).filter(Boolean).slice(0, 6),
      expectedImpact: nba.expectedImpact.trim(),
      // Fail closed: anything other than a literal `false` is treated as
      // requiring approval. Phase 4 never auto-executes regardless, but
      // this keeps the UI's own labeling honest too.
      requiresApproval: nba.requiresApproval !== false,
    },
  };

  if (data.nextBestAction.steps.length === 0) {
    return { valid: false, errors: ["nextBestAction.steps empty after normalization"] };
  }

  return { valid: true, data };
}

// ---- Prompt construction -------------------------------------------------

function buildUserPrompt(input, outcome) {
  const lines = [];

  lines.push(`The real, already-confirmed Razorpay Test Mode outcome for this payment link is: "${outcome}".`);
  lines.push("Write your evaluation to be fully consistent with that exact outcome — do not contradict it.");
  lines.push("");

  if (input.businessUnderstanding) lines.push(`Business: ${input.businessUnderstanding}`);
  if (input.customerSegment) lines.push(`Customer segment: ${input.customerSegment}`);
  if (input.product.name) {
    lines.push(`Product/service: ${input.product.name}${input.product.price ? ` (₹${input.product.price})` : ""}`);
  }
  if (input.pastCustomers !== null) lines.push(`Approximate past/repeat customers: ${input.pastCustomers}`);
  if (input.biggestBlocker) lines.push(`Original blocker described by the founder: ${input.biggestBlocker}`);
  if (input.growthOpportunities.length > 0) {
    lines.push(`Growth opportunities identified earlier: ${input.growthOpportunities.join("; ")}`);
  }
  if (input.recommendedAction.title) {
    lines.push(
      `Recommended action that was approved: ${input.recommendedAction.title} — ${input.recommendedAction.description}`
    );
  }

  lines.push("");
  lines.push("Approved Razorpay Test Mode payment-link parameters:");
  lines.push(`- Amount: ${input.paymentLink.amount ?? "unknown"} ${input.paymentLink.currency}`);
  lines.push(`- Description: ${input.paymentLink.description || "(none given)"}`);
  if (input.paymentLink.targetAudienceNote) {
    lines.push(`- Target audience note: ${input.paymentLink.targetAudienceNote}`);
  }
  if (input.paymentLink.createdAt) lines.push(`- Created at: ${input.paymentLink.createdAt}`);
  if (input.paymentLink.expiryAt) lines.push(`- Expires at: ${input.paymentLink.expiryAt}`);
  if (input.paymentLink.checkedAt) lines.push(`- Status last checked at: ${input.paymentLink.checkedAt}`);

  lines.push("");
  lines.push("Respond with the JSON object described in your instructions.");

  return lines.join("\n");
}

// ---- OpenRouter call ----------------------------------------------------

async function callModel(client, messages) {
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.5,
    max_tokens: 1600,
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

  let input;
  try {
    input = parseRequestBody(req.body);
  } catch (err) {
    if (err.isValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Unexpected validation error (evaluate):", err);
    return res.status(400).json({ error: "Invalid request." });
  }

  const { outcome, statusKnown } = resolveOutcome(input.paymentLink.rawStatus);

  // Razorpay status unavailable/unrecognized: never fabricate an outcome,
  // never call the AI, return the deterministic fallback.
  if (!statusKnown) {
    return res.status(200).json(buildUnknownFallback(input));
  }

  const client = getClient();
  if (!client) {
    console.error("OPENROUTER_API_KEY is not set on the server.");
    return res.status(500).json({ error: "AI service is not configured." });
  }

  const userPrompt = buildUserPrompt(input, outcome);
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
    console.error("OpenRouter Error (evaluate, first attempt):", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return res.status(status).json({ error: errorMessageForStatus(status, error) });
  }

  let parsed = extractJSON(rawText);
  let validation = validateAndNormalizeEvaluation(parsed);

  if (!validation.valid) {
    console.warn("Growth evaluation: first response failed validation, retrying once.", validation.errors);
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
      validation = validateAndNormalizeEvaluation(parsed);
    } catch (error) {
      console.error("OpenRouter Error (evaluate, repair attempt):", error);
    }
  }

  if (!validation.valid) {
    console.error("Growth evaluation: response still invalid after retry.", validation.errors);
    return res.status(502).json({
      error: "The AI evaluation could not be understood. Please try again.",
    });
  }

  // Overwrite whatever the model said with the server-resolved outcome —
  // this is not optional. See resolveOutcome() and the file header.
  const evaluation = { ...validation.data, outcome };

  return res.status(200).json({ evaluation });
}
