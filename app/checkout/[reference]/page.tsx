import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { confirmDemoPayment } from "@/app/checkout/actions";
import { Button, Card, Container, formatUsd } from "@/components/ui";
import { getOrderByReference } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment",
};

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = getOrderByReference(reference);
  if (!order) redirect("/pricing");
  if (order.status === "paid") redirect(`/checkout/${reference}/receipt`);

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-14 text-center sm:py-16">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Checkout
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            One last look before payment
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Everything below is exactly what you chose. Nothing is confirmed until you say so.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            {/* Order summary */}
            <Card className="p-8">
              <h2 className="font-display text-2xl font-medium text-ink">Your order</h2>
              <dl className="mt-6 space-y-4 border-t border-line pt-6">
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
                  <dt className="text-sm text-ink-soft">Reference</dt>
                  <dd className="text-right text-sm font-medium tracking-wide text-ink">
                    {order.reference}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-soft">Contact</dt>
                  <dd className="text-right text-sm text-ink">
                    <span className="font-medium">{order.contact_name}</span>
                    <span className="mt-0.5 block text-ink-faint">{order.contact_email}</span>
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Demonstration payment panel */}
            <Card className="h-fit p-8">
              <h2 className="font-display text-2xl font-medium text-ink">
                Payment — demonstration mode
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                This preview build completes checkout without charging anything. In production
                this step is a secure card form via our payment partner (the provider interface
                is already in place).
              </p>
              <form action={confirmDemoPayment} className="mt-6">
                <input type="hidden" name="reference" value={order.reference} />
                <Button type="submit" className="w-full">
                  Confirm — complete this order
                </Button>
              </form>
              <p className="mt-5 text-center">
                <Link
                  href="/pricing"
                  className="text-xs text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-gold-deep"
                >
                  Choose a different package
                </Link>
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
