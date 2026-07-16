import { randomUUID } from "node:crypto";
import { getDb, makeReference, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";
import { PACKAGES } from "@/lib/data/vendors";

/**
 * Payments are built behind a provider interface.
 *
 * - With STRIPE_SECRET_KEY configured, checkout happens on Stripe's hosted
 *   page and orders are marked paid by the signature-verified webhook at
 *   /api/stripe/webhook (plus a session check on the receipt page, so the
 *   family never waits on webhook latency).
 * - Without it, the bundled "demo" provider completes checkout on an
 *   in-app confirmation page — no card details are ever asked for.
 */

export interface OrderRow {
  id: string;
  reference: string;
  user_id: string | null;
  package_id: string;
  package_name: string;
  amount_usd: number;
  contact_name: string;
  contact_email: string;
  provider: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export interface PaymentProvider {
  name: string;
  /** Where to send the customer to complete payment for this order. */
  beginCheckout(order: OrderRow): Promise<string>;
}

const demoProvider: PaymentProvider = {
  name: "demo",
  beginCheckout: async (order) => `/checkout/${order.reference}`,
};

const STRIPE_API = "https://api.stripe.com/v1";

function stripeKey(): string | null {
  return process.env.STRIPE_SECRET_KEY || null;
}

async function stripeRequest(
  path: string,
  params?: Record<string, string>,
): Promise<Record<string, unknown>> {
  const key = stripeKey();
  if (!key) throw new Error("Stripe is not configured");
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  });
  const body = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = body.error as { message?: string } | undefined;
    throw new Error(err?.message || `Stripe request failed (${res.status})`);
  }
  return body;
}

const stripeProvider: PaymentProvider = {
  name: "stripe",
  async beginCheckout(order) {
    const { SITE_URL } = await import("@/lib/site");
    const session = await stripeRequest("/checkout/sessions", {
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(order.amount_usd * 100),
      "line_items[0][price_data][product_data][name]": `Legacy — ${order.package_name}`,
      customer_email: order.contact_email,
      "metadata[reference]": order.reference,
      success_url: `${SITE_URL}/checkout/${order.reference}/receipt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/${order.reference}`,
    });
    return String(session.url);
  },
};

export function getPaymentProvider(): PaymentProvider {
  return stripeKey() ? stripeProvider : demoProvider;
}

/**
 * Receipt-page fallback: confirm a Stripe session directly so the family
 * sees their receipt even if the webhook has not landed yet.
 */
export async function confirmStripeSession(
  reference: string,
  sessionId: string,
): Promise<boolean> {
  if (!stripeKey()) return false;
  try {
    const session = await stripeRequest(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
    const metadata = session.metadata as { reference?: string } | undefined;
    if (session.payment_status === "paid" && metadata?.reference === reference) {
      await markOrderPaid(reference);
      return true;
    }
  } catch {
    // Verification is best-effort; the webhook remains authoritative.
  }
  return false;
}

export function createOrder(input: {
  userId: string | null;
  packageId: string;
  contactName: string;
  contactEmail: string;
}): OrderRow | null {
  const pkg = PACKAGES.find((p) => p.id === input.packageId);
  if (!pkg) return null;
  const id = randomUUID();
  const reference = makeReference("ORD");
  const now = nowIso();
  getDb()
    .prepare(
      `INSERT INTO orders
         (id, reference, user_id, package_id, package_name, amount_usd, contact_name, contact_email, provider, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .run(
      id,
      reference,
      input.userId,
      pkg.id,
      pkg.name,
      pkg.priceUsd,
      input.contactName,
      input.contactEmail,
      getPaymentProvider().name,
      now,
    );
  return getOrderByReference(reference);
}

export function getOrderByReference(reference: string): OrderRow | null {
  const row = getDb()
    .prepare("SELECT * FROM orders WHERE reference = ?")
    .get(reference) as unknown as OrderRow | undefined;
  return row ?? null;
}

export function listOrdersForUser(userId: string): OrderRow[] {
  return getDb()
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as unknown as OrderRow[];
}

export function listOrders(): OrderRow[] {
  return getDb()
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as unknown as OrderRow[];
}

export async function markOrderPaid(reference: string): Promise<OrderRow | null> {
  const order = getOrderByReference(reference);
  if (!order || order.status === "paid") return order;
  getDb()
    .prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE reference = ?")
    .run(nowIso(), reference);

  await sendMessage({
    channel: "email",
    recipient: order.contact_email,
    subject: `Receipt ${order.reference} — ${order.package_name}`,
    body: `Dear ${order.contact_name},\n\nThank you. Your ${order.package_name} package ($${order.amount_usd.toLocaleString("en-US")}) is confirmed under reference ${order.reference}.\n\nA Legacy coordinator will reach out shortly to begin arrangements. Every service in your package is itemized and nothing further is owed unless you choose to add to it.\n\nWith you in this hour,\nLegacy`,
    relatedType: "order",
    relatedId: order.id,
  });

  return getOrderByReference(reference);
}
