// Server-side endpoint for the Growth & Commerce Agent's Phase 3 (Real
// Razorpay Test Mode Execution) — "Check Status" step.
//
// Mirrors api/growth/execute.js: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are
// read from process.env on the server only, never exposed to the client,
// and this endpoint refuses to run unless RAZORPAY_KEY_ID starts with
// "rzp_test_". This file does not call, import, or fall back to
// api/execute-mock-payment-link.js.

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const TEST_KEY_PREFIX = "rzp_test_";

function validationError(message) {
  const err = new Error(message);
  err.isValidationError = true;
  return err;
}

function requireNonEmptyString(value, label, { max = 200 } = {}) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) throw validationError(`${label} is required.`);
  if (str.length > max) throw validationError(`${label} is too long (max ${max} characters).`);
  return str;
}

function getTestModeCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { error: "Razorpay Test Mode credentials are not configured on the server." };
  }
  if (!keyId.startsWith(TEST_KEY_PREFIX)) {
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

function toClientShape(razorpayLink) {
  return {
    id: razorpayLink.id,
    status: razorpayLink.status,
    shortUrl: razorpayLink.short_url,
    amount: razorpayLink.amount / 100,
    currency: razorpayLink.currency,
    description: razorpayLink.description,
    expiryAt: razorpayLink.expire_by
      ? new Date(razorpayLink.expire_by * 1000).toISOString()
      : null,
    checkedAt: new Date().toISOString(),
    testMode: true,
  };
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
    const id = requireNonEmptyString(req.body?.id, "Payment link id");
    const { keyId, keySecret } = credentials;

    const upstream = await fetch(`${RAZORPAY_API_BASE}/payment_links/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: authHeader(keyId, keySecret) },
    });

    let data = null;
    try {
      data = await upstream.json();
    } catch {
      // fall through to generic error below
    }

    if (!upstream.ok) {
      const upstreamMessage = data?.error?.description || data?.error?.reason;
      throw new Error(upstreamMessage || "Razorpay was unable to return this payment link's status.");
    }

    return res.status(200).json(toClientShape(data));
  } catch (error) {
    if (error.isValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Razorpay status endpoint error:", error);
    return res
      .status(502)
      .json({ error: error.message || "Unable to check the Razorpay Test Mode payment link status. Please try again." });
  }
}
