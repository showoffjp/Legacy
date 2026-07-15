import { randomUUID } from "node:crypto";
import { getDb, makeReference, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";
import { PACKAGES } from "@/lib/data/vendors";

/**
 * Payments are built behind a provider interface. The bundled "demo"
 * provider completes checkout on an in-app confirmation page and marks the
 * order paid — no card details are ever asked for. A Stripe provider slots
 * in by implementing `PaymentProvider` (createCheckout returning the
 * Stripe-hosted URL, plus a webhook marking the order paid) and selecting
 * it when STRIPE_SECRET_KEY is configured.
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
  checkoutUrl(order: OrderRow): string;
}

const demoProvider: PaymentProvider = {
  name: "demo",
  checkoutUrl: (order) => `/checkout/${order.reference}`,
};

export function getPaymentProvider(): PaymentProvider {
  return demoProvider;
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
