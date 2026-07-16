import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, Container, formatUsd } from "@/components/ui";
import { FundingChoice } from "@/components/checkout/funding-choice";
import { PACKAGES } from "@/lib/data/vendors";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: packageId } = await searchParams;
  const pkg = PACKAGES.find((p) => p.id === packageId);
  if (!pkg) redirect("/pricing");

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-14 text-center sm:py-16">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Checkout
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Confirm your package
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            A moment to review what is included, and a place to reach you with your receipt.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            {/* Order summary */}
            <Card className="p-8">
              <h2 className="font-display text-2xl font-medium text-ink">{pkg.name}</h2>
              <p className="mt-1.5 text-sm text-ink-soft">{pkg.tagline}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {pkg.includes.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span aria-hidden className="mt-0.5 text-sm text-gold">
                      ✓
                    </span>
                    <span className="text-sm leading-relaxed text-ink-soft">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  Package total
                </span>
                <span className="font-display text-3xl font-medium text-ink">
                  {formatUsd(pkg.priceUsd)}
                </span>
              </p>
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                Every item is included at this price — honoring the FTC Funeral Rule, you may
                also choose services à la carte.
              </p>
            </Card>

            {/* Contact details & funding */}
            <Card className="h-fit p-8">
              <h2 className="font-display text-2xl font-medium text-ink">Your details</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                Pay today, or fund the service with a life insurance policy — most families do,
                and nothing is due while we verify it.
              </p>
              <div className="mt-6">
                <FundingChoice packageId={pkg.id} />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
