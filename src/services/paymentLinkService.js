// Client-side service for the Growth Agent's Phase 3 (Approval + Real
// Razorpay Test Mode Execution) endpoints. Same shape as
// growthAgentService.js: same-origin fetch, no key, no Razorpay SDK in the
// browser — RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET never leave the server.
//
// This calls REAL Razorpay Test Mode endpoints via our own server routes
// (api/growth/execute.js, api/growth/status.js). It never talks to
// Razorpay directly from the browser, and it never falls back to
// api/execute-mock-payment-link.js — that endpoint remains a separate,
// explicit, simulated implementation this file does not use.

async function postJSON(url, payload) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`Razorpay Test Mode request to ${url} failed:`, error);
    throw new Error("Unable to reach the payment service. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response — fall through to the generic error below.
  }

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong with the Razorpay Test Mode request. Please try again.");
  }

  return data;
}

export async function createPaymentLink({
  idempotencyKey,
  amount,
  currency,
  description,
  expiryAt,
  targetAudienceNote,
}) {
  const data = await postJSON("/api/growth/execute", {
    idempotencyKey,
    amount,
    currency,
    description,
    expiryAt,
    targetAudienceNote,
  });

  if (!data?.paymentLink) {
    throw new Error("Razorpay did not return a payment link. Please try again.");
  }

  return data.paymentLink;
}

export async function checkPaymentLinkStatus({ id }) {
  const data = await postJSON("/api/growth/status", { id });

  if (!data?.status) {
    throw new Error("Razorpay did not return a status. Please try again.");
  }

  return data;
}
