import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink, Card, Container, VerseBlock, formatUsd } from "@/components/ui";
import { confirmStripeSession, getOrderByReference } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Receipt",
};

/** Full ISO timestamp → "July 15, 2026". */
function formatPaidDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { reference } = await params;
  const { session_id } = await searchParams;
  let order = await getOrderByReference(reference);
  if (!order) redirect("/pricing");
  if (order.status !== "paid" && session_id) {
    // Returning from Stripe ahead of the webhook — verify the session now.
    await confirmStripeSession(reference, session_id);
    order = await getOrderByReference(reference);
  }
  if (!order || order.status !== "paid") redirect(`/checkout/${reference}`);

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-pale/60 text-2xl text-gold shadow-soft"
          >
            ✓
          </span>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Thank you — it is in our hands now
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Your order is confirmed. A Legacy coordinator will call within the hour to begin
            arrangements; nothing proceeds without your family&apos;s blessing.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <Card className="mx-auto max-w-xl p-8 sm:p-10">
            <h2 className="font-display text-2xl font-medium text-ink">Order details</h2>
            <dl className="mt-6 space-y-4 border-t border-line pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-soft">Reference</dt>
                <dd className="text-right text-sm font-medium tracking-wide text-ink">
                  {order.reference}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-soft">Package</dt>
                <dd className="text-right text-sm font-medium text-ink">
                  {order.package_name}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-soft">Amount</dt>
                <dd className="text-right font-display text-2xl font-medium text-ink">
                  {formatUsd(order.amount_usd)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-soft">Paid</dt>
                <dd className="text-right text-sm text-ink">
                  {order.paid_at ? formatPaidDate(order.paid_at) : "Today"}
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
              A copy of this receipt has been emailed to {order.contact_email}.
            </p>
          </Card>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/plan">Continue your plan</ButtonLink>
            <ButtonLink href="/account/dashboard" variant="outline">
              View in your dashboard
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-parchment-deep/60">
        <Container className="py-16 sm:py-20">
          <VerseBlock
            text="Cast thy burden upon the LORD, and he shall sustain thee"
            reference="Psalm 55:22"
          />
        </Container>
      </section>
    </div>
  );
}
