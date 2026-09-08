import { createHash } from "node:crypto";

// Server-side endpoint for the Growth & Commerce Agent's Phase 2
// (Approval + Mock Execution). Runs as its own Vercel serverless function
// (this file lives under /api), separate from api/generate.js and
// api/analyze-growth.js — nothing here is imported by or imports those
// files, and neither of those files is touched.
//
// IMPORTANT: this is a fully deterministic, local SANDBOX implementation.
// There is no Razorpay integration, no Razorpay credentials, and no call
// to any real payment gateway anywhere in this file. Every "payment link"
// this endpoint returns is synthetic, generated from a hash of the
// request's own inputs, and every response is explicitly marked
// `sandbox: true` plus a human-readable disclaimer. Nothing here should
// ever be presented to a user as a real, payable link.
//
// Two actions share this one endpoint (kept together since they're two
// tightly-coupled operations on the same mock resource, with no
// persistence layer to split across):
//   - action "create": mints a deterministic mock payment link from the
//     approved parameters.
//   - action "status": recomputes that mock link's status purely as a
//     function of elapsed time since creation (no database, no
//     filesystem, no Firestore — nothing is actually stored server-side).

const SANDBOX_DOMAIN = "sandbox.shepilot.mock";
const SANDBOX_NOTE =
  "This is a simulated sandbox payment link for demo purposes only. It is not connected to Razorpay or any real payment gateway, and cannot be used to accept a real payment.";

const SUPPORTED_CURRENCIES = new Set(["INR", "USD", "GBP", "EUR"]);

// Deterministic status timeline, purely a function of elapsed time since
// creation — this is what lets "Check Status" show a believable state
// change without any server-side storage.
const STATUS_TIMELINE = [
  { afterMs: 0, status: "created" },
  { afterMs: 8_000, status: "issued" },
  { afterMs: 25_000, status: "paid" },
];

function validationError(message) {
  const err = new Error(message);
  err.isValidationError = true;
  return err;
}

function requireNonEmptyString(value, label, { max = 500 } = {}) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) throw validationError(`${label} is required.`);
  if (str.length > max) throw validationError(`${label} is too long (max ${max} characters).`);
  return str;
}

function requirePositiveAmount(value) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw validationError("Amount must be a valid number greater than 0.");
  }
  return Math.round(amount * 100) / 100;
}

function requireCurrency(value) {
  const currency = typeof value === "string" ? value.trim().toUpperCase() : "";
  if (!SUPPORTED_CURRENCIES.has(currency)) {
    throw validationError(`Currency must be one of: ${Array.from(SUPPORTED_CURRENCIES).join(", ")}.`);
  }
  return currency;
}

function requireFutureISODate(value, label) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) throw validationError(`${label} is required.`);
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    throw validationError(`${label} is not a valid date.`);
  }
  if (date.getTime() <= Date.now()) {
    throw validationError(`${label} must be in the future.`);
  }
  return date.toISOString();
}

function requirePastOrValidISODate(value, label) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) throw validationError(`${label} is required.`);
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    throw validationError(`${label} is not a valid date.`);
  }
  return date.toISOString();
}

// Deterministic id: same idempotency key + same core parameters always
// produce the same mock link, so a resent/retried request (e.g. our own
// client-side retry-on-error) resolves to the same sandbox resource
// instead of minting a new one.
function deriveMockId({ idempotencyKey, amount, currency, description }) {
  const hash = createHash("sha256")
    .update(`${idempotencyKey}|${amount}|${currency}|${description}`)
    .digest("hex");
  return { id: `plink_sandbox_${hash.slice(0, 20)}`, shortSlug: hash.slice(0, 10) };
}

function computeStatus({ createdAt, expiryAt }) {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const expiry = new Date(expiryAt).getTime();

  if (Number.isFinite(expiry) && now > expiry) {
    return "expired";
  }

  const elapsed = now - created;
  let status = STATUS_TIMELINE[0].status;
  for (const step of STATUS_TIMELINE) {
    if (elapsed >= step.afterMs) status = step.status;
  }
  return status;
}

function handleCreate(body) {
  const idempotencyKey = requireNonEmptyString(body?.idempotencyKey, "Idempotency key", { max: 200 });
  const amount = requirePositiveAmount(body?.amount);
  const currency = requireCurrency(body?.currency);
  const description = requireNonEmptyString(body?.description, "Description", { max: 500 });
  const expiryAt = requireFutureISODate(body?.expiryAt, "Expiry");
  const targetAudienceNote =
    typeof body?.targetAudienceNote === "string" ? body.targetAudienceNote.trim().slice(0, 500) : "";

  const { id, shortSlug } = deriveMockId({ idempotencyKey, amount, currency, description });
  const createdAt = new Date().toISOString();

  const paymentLink = {
    id,
    shortUrl: `https://${SANDBOX_DOMAIN}/pl/${shortSlug}`,
    status: "created",
    amount,
    currency,
    description,
    expiryAt,
    targetAudienceNote,
    createdAt,
    sandbox: true,
  };

  return { paymentLink, sandbox: true, note: SANDBOX_NOTE };
}

function handleStatus(body) {
  const id = requireNonEmptyString(body?.id, "Payment link id", { max: 200 });
  const createdAt = requirePastOrValidISODate(body?.createdAt, "Created time");
  const expiryAt = requirePastOrValidISODate(body?.expiryAt, "Expiry");

  const status = computeStatus({ createdAt, expiryAt });

  return {
    id,
    status,
    checkedAt: new Date().toISOString(),
    sandbox: true,
    note: SANDBOX_NOTE,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const action = req.body?.action;

  try {
    if (action === "create") {
      return res.status(200).json(handleCreate(req.body));
    }
    if (action === "status") {
      return res.status(200).json(handleStatus(req.body));
    }
    return res.status(400).json({ error: 'Invalid action. Expected "create" or "status".' });
  } catch (error) {
    if (error.isValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Mock payment link endpoint error:", error);
    return res.status(500).json({ error: "Unable to process the sandbox payment link request. Please try again." });
  }
}
