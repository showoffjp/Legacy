import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { markOrderPaid } from "@/lib/server/payments";

/**
 * Stripe webhook — the authoritative "order paid" signal in live mode.
 * Configure the endpoint in Stripe for `checkout.session.completed` and
 * set STRIPE_WEBHOOK_SECRET.
 */

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = new Map(
    header.split(",").map((kv) => {
      const [k, ...rest] = kv.split("=");
      return [k, rest.join("=")] as const;
    }),
  );
  const timestamp = parts.get("t");
  const signature = parts.get("v1");
  if (!timestamp || !signature) return false;
  // Reject stale events (replay window: 5 minutes).
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const payload = await req.text();
  const header = req.headers.get("stripe-signature") ?? "";
  if (!verifySignature(payload, header, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: { metadata?: { reference?: string } } } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const reference = event.data?.object?.metadata?.reference;
    if (reference) await markOrderPaid(reference);
  }

  return NextResponse.json({ received: true });
}
