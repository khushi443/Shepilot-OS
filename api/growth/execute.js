// Server-side endpoint for the Growth & Commerce Agent's Phase 3 (Real
// Razorpay Test Mode Execution). Runs as its own Vercel serverless function
// (this file lives under /api/growth), separate from api/generate.js,
// api/analyze-growth.js, and api/execute-mock-payment-link.js — nothing
// here is imported by or imports those files, and none of them are touched.
//
// This creates a REAL Razorpay Payment Link, but only ever in Razorpay
// TEST MODE. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are read from
// process.env on the server only — they are never sent to the client, and
// there is no VITE_-prefixed equivalent anywhere in this app (anything
// VITE_-prefixed is public by design; Vite bakes it into the shipped JS).
//
// Safety guard: this endpoint refuses to run unless RAZORPAY_KEY_ID starts
// with "rzp_test_". If Test Mode credentials aren't configured, this
// returns a clear 500 — it never falls back to inventing credentials and
// never silently switches to the mock endpoint
// (api/execute-mock-payment-link.js remains a separate, explicit,
// simulated implementation that this file does not call).
//
// Scope is intentionally narrow, per Phase 3: INR only (no multi-currency
// expansion), no persistence layer, no evaluation, no next-best-action.

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const TEST_KEY_PREFIX = "rzp_test_";

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

function requireFutureUnixSeconds(value, label) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) throw validationError(`${label} is required.`);
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    throw validationError(`${label} is not a valid date.`);
  }
  if (date.getTime() <= Date.now()) {
    throw validationError(`${label} must be in the future.`);
  }
  return Math.floor(date.getTime() / 1000);
}

// Reads and validates Test Mode credentials at request time (not module
// load time) so a missing/misconfigured key produces a clean error
// response instead of a cold-start crash, and so credentials are never
// cached across invocations in a way that could mask a config change.
function getTestModeCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { error: "Razorpay Test Mode credentials are not configured on the server." };
  }
  if (!keyId.startsWith(TEST_KEY_PREFIX)) {
    // Hard safety guard: refuse to run against anything that isn't
    // explicitly a Test Mode key. This app must never create a real,
    // payable payment link.
    return {
      error:
        "Refusing to execute: RAZORPAY_KEY_ID does not start with 'rzp_test_'. Only Razorpay Test Mode is allowed.",
    };
  }
  return { keyId, keySecret };
}

function authHeader(keyId, keySecret) {
  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${token}`;
}

// Idempotency: the same idempotencyKey is reused as Razorpay's
// `reference_id`, and — before calling Razorpay to create anything — we
// ask Razorpay for existing payment links and reuse one whose
// reference_id matches. This is what makes a duplicate Approve click (or a
// client-side retry after a failed attempt) resolve to the same real
// Razorpay Test Mode link instead of minting a second one.
async function findExistingLinkByReference({ keyId, keySecret, referenceId }) {
  const url = `${RAZORPAY_API_BASE}/payment_links?reference_id=${encodeURIComponent(referenceId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: authHeader(keyId, keySecret) },
  });

  if (!res.ok) {
    // Non-fatal: if the lookup itself fails, fall through and attempt a
    // normal create rather than blocking the whole request on it.
    return null;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    return null;
  }

  const match = Array.isArray(data?.items) ? data.items[0] : null;
  return match || null;
}

function toClientShape(razorpayLink) {
  return {
    id: razorpayLink.id,
    shortUrl: razorpayLink.short_url,
    status: razorpayLink.status,
    amount: razorpayLink.amount / 100,
    currency: razorpayLink.currency,
    description: razorpayLink.description,
    expiryAt: razorpayLink.expire_by
      ? new Date(razorpayLink.expire_by * 1000).toISOString()
      : null,
    targetAudienceNote:
      typeof razorpayLink.notes?.targetAudienceNote === "string"
        ? razorpayLink.notes.targetAudienceNote
        : "",
    createdAt: razorpayLink.created_at
      ? new Date(razorpayLink.created_at * 1000).toISOString()
      : new Date().toISOString(),
    testMode: true,
  };
}

async function handleCreate(body, credentials) {
  const { keyId, keySecret } = credentials;

  const idempotencyKey = requireNonEmptyString(body?.idempotencyKey, "Idempotency key", { max: 200 });
  const amount = requirePositiveAmount(body?.amount);

  // Phase 3 explicitly narrows scope to INR only.
  const currency = typeof body?.currency === "string" ? body.currency.trim().toUpperCase() : "INR";
  if (currency !== "INR") {
    throw validationError("Only INR is supported in this phase.");
  }

  const description = requireNonEmptyString(body?.description, "Description", { max: 500 });
  const expireBy = requireFutureUnixSeconds(body?.expiryAt, "Expiry");
  const targetAudienceNote =
    typeof body?.targetAudienceNote === "string" ? body.targetAudienceNote.trim().slice(0, 500) : "";

  // Idempotency check first — avoids creating a duplicate real Test Mode
  // link if this request is a retry/duplicate submit.
  const existing = await findExistingLinkByReference({ keyId, keySecret, referenceId: idempotencyKey });
  if (existing) {
    return { paymentLink: toClientShape(existing), testMode: true, reused: true };
  }

  const payload = {
    amount: Math.round(amount * 100),
    currency: "INR",
    description,
    reference_id: idempotencyKey,
    expire_by: expireBy,
    notify: { sms: false, email: false },
    reminder_enable: false,
    notes: targetAudienceNote ? { targetAudienceNote } : undefined,
  };

  const res = await fetch(`${RAZORPAY_API_BASE}/payment_links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(keyId, keySecret),
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // fall through to generic error below
  }

  if (!res.ok) {
    const upstreamMessage = data?.error?.description || data?.error?.reason;
    throw new Error(upstreamMessage || "Razorpay was unable to create the Test Mode payment link.");
  }

  return { paymentLink: toClientShape(data), testMode: true, reused: false };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const credentials = getTestModeCredentials();
  if (credentials.error) {
    console.error("Razorpay Test Mode credentials check failed:", credentials.error);
    return res.status(500).json({ error: credentials.error });
  }

  try {
    const result = await handleCreate(req.body, credentials);
    return res.status(200).json(result);
  } catch (error) {
    if (error.isValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Razorpay execute endpoint error:", error);
    return res
      .status(502)
      .json({ error: error.message || "Unable to create the Razorpay Test Mode payment link. Please try again." });
  }
}
