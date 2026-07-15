import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, VerseBlock } from "@/components/ui";
import { ChecklistClient } from "@/components/checklist/checklist-client";

export const metadata: Metadata = {
  title: "Bereavement Checklist",
};

const NEXT_STEPS = [
  {
    href: "/plan",
    title: "Plan the service",
    body: "Our planning companion walks with you through clergy, scriptures, hymns, and every detail of the order of service.",
    cta: "Begin planning",
  },
  {
    href: "/resources",
    title: "Grief resources",
    body: "Scriptures of comfort, prayers for the grieving, and gentle guidance for the road that follows the service.",
    cta: "Find comfort",
  },
];

export default function ChecklistPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            In the hour of loss
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            When a loved one passes: what to do, and when
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            If you are reading this in the first fog of loss, be gentle with yourself. Very
            little must be decided today, and nothing must be decided alone. This list holds
            every step in order, so your family can set it down and pick it up again as you
            are able.
          </p>
          <VerseBlock
            className="mt-12"
            text="Come unto me, all ye that labour and are heavy laden, and I will give you rest."
            reference="Matthew 11:28"
          />
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <ChecklistClient />
      </Container>

      <section aria-labelledby="next-steps-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2
              id="next-steps-heading"
              className="text-center font-display text-3xl font-medium text-ink"
            >
              Where to turn next
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {NEXT_STEPS.map((step) => (
                <Link key={step.href} href={step.href} className="group block">
                  <Card className="h-full p-7 transition-shadow duration-200 group-hover:shadow-lift">
                    <h3 className="font-display text-2xl font-medium text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-deep">
                      {step.cta} <span aria-hidden>→</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
