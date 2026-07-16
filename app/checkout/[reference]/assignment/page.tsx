import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink, Card, Container, VerseBlock, formatUsd } from "@/components/ui";
import { getOrderByReference, parseFunding } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Arrangements Held",
};

const NEXT_STEPS = [
  {
    title: "A coordinator calls you",
    body: "Usually within the hour — with the one-page assignment form for your signature. No policy leaves your family's control without it.",
  },
  {
    title: "We verify with the insurer",
    body: "Usually within one business day. If anything about the policy needs attention, we walk through it together — nothing falls on you.",
  },
  {
    title: "The benefit pays the package directly",
    body: "Your family never fronts the cost. Everything in the policy beyond the package still flows to your family, untouched.",
  },
];

export default async function AssignmentHeldPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await getOrderByReference(reference);
  if (!order || order.provider !== "insurance-assignment") redirect("/pricing");
  const funding = parseFunding(order);

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-pale/60 text-2xl text-gold shadow-soft"
          >
            🤝
          </span>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Your arrangements are held — nothing is due today
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            The {order.package_name} package is reserved under reference{" "}
            <span className="font-mono font-medium text-ink">{order.reference}</span>, funded by
            the policy you named. A confirmation is on its way to {order.contact_email}.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card className="h-fit p-8">
              <h2 className="font-display text-2xl font-medium text-ink">What we hold</h2>
              <dl className="mt-6 space-y-4 border-t border-line pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-soft">Reference</dt>
                  <dd className="text-right font-mono text-sm font-medium text-ink">
                    {order.reference}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-soft">Package</dt>
                  <dd className="text-right text-sm font-medium text-ink">{order.package_name}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-soft">Package total</dt>
                  <dd className="text-right font-display text-2xl font-medium text-ink">
                    {formatUsd(order.amount_usd)}
                  </dd>
                </div>
                {funding ? (
                  <>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-ink-soft">Policy</dt>
                      <dd className="text-right text-sm text-ink">
                        {funding.insurer}
                        {funding.policyNumber ? ` · ${funding.policyNumber}` : ""}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-ink-soft">In the name of</dt>
                      <dd className="text-right text-sm text-ink">{funding.policyholder}</dd>
                    </div>
                  </>
                ) : null}
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <dt className="text-sm font-medium text-ink">Due from your family today</dt>
                  <dd className="text-right font-display text-2xl font-medium text-gold-deep">
                    $0
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-8">
              <h2 className="font-display text-2xl font-medium text-ink">What happens next</h2>
              <ol className="mt-6 space-y-6">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-pale/60 font-display text-sm font-semibold text-gold-deep"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">{step.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/plan">Continue your plan</ButtonLink>
            <ButtonLink href="/account/dashboard" variant="outline">
              Follow it on your dashboard
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-parchment-deep/60">
        <Container className="py-16 sm:py-20">
          <VerseBlock
            text="And my God shall supply all your need according to his riches in glory by Christ Jesus."
            reference="Philippians 4:19"
          />
        </Container>
      </section>
    </div>
  );
}
