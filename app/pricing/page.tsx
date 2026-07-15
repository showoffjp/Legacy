import type { Metadata } from "next";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  SectionHeading,
  VerseBlock,
  formatUsd,
} from "@/components/ui";
import { PACKAGES } from "@/lib/data/vendors";
import { scriptureById } from "@/lib/data/scriptures";

export const metadata: Metadata = {
  title: "Packages & Pricing",
};

const A_LA_CARTE: { name: string; priceUsd: number }[] = [
  { name: "Tribute video", priceUsd: 195 },
  { name: "Program design & printing", priceUsd: 145 },
  { name: "Clergy coordination", priceUsd: 95 },
  { name: "Obituary writing", priceUsd: 125 },
];

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How quickly can arrangements be made?",
    answer:
      "Immediately. A coordinator answers day and night, and the essential arrangements — bringing your loved one into care, securing the funeral home, and setting the service date — are usually in place within a day. The full service is typically arranged over two to four days, and nothing is ever rushed past your family's peace.",
  },
  {
    question: "Do you work with our own church?",
    answer:
      "Gladly. If your congregation and pastor are already walking with you, we come alongside them rather than in place of them — coordinating the sanctuary, the musicians, the program, and the graveside so that your church family can simply be present with you.",
  },
  {
    question: "What about pre-planning?",
    answer:
      "Pre-need planning is one of the kindest gifts you can leave. We record your wishes — the scriptures, the hymns, the resting place — and keep them safely until they are needed, sparing your family a hundred decisions in their hardest week. There is no charge to begin the conversation.",
  },
  {
    question: "How do payments work?",
    answer:
      "You receive a fully itemized statement before anything is confirmed, in keeping with the FTC Funeral Rule. We accept payment plans arranged around your family's means, and we work directly with life insurance assignments so benefits can be applied to the service without waiting on the claim.",
  },
];

export default function PricingPage() {
  const isaiah = scriptureById("isaiah-41");

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Packages &amp; pricing
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Clear, honest pricing in a difficult hour
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Families in grief should never face hidden costs. Every package below is fully
            itemized before you commit to anything, and we honor the FTC Funeral Rule — you
            may choose only what you need, and you will see every price before you decide.
          </p>
        </Container>
      </section>

      {/* Packages */}
      <section>
        <Container className="py-16 sm:py-20">
          <h2 className="sr-only">Our packages</h2>
          <div className="grid gap-6 pt-4 lg:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border bg-white/80 p-8 ${
                  pkg.highlighted ? "border-gold shadow-lift" : "border-line shadow-soft"
                }`}
              >
                {pkg.highlighted ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge>Most chosen</Badge>
                  </div>
                ) : null}
                <h3 className="font-display text-3xl font-medium text-ink">{pkg.name}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{pkg.tagline}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                    from
                  </span>
                  <span className="font-display text-4xl font-medium text-ink">
                    {formatUsd(pkg.priceUsd)}
                  </span>
                </p>
                <ul className="mt-7 flex-1 space-y-3 border-t border-line pt-7">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span aria-hidden className="mt-0.5 text-sm text-gold">
                        ✓
                      </span>
                      <span className="text-sm leading-relaxed text-ink-soft">{line}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/checkout?package=${pkg.id}`}
                  variant={pkg.highlighted ? "primary" : "outline"}
                  className="mt-8 w-full"
                >
                  Begin with this package
                </ButtonLink>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-faint">
            Selections are made with your coordinator in the planning companion — no payment
            is taken online, and nothing is final until your family says so.
          </p>
        </Container>
      </section>

      {/* À la carte */}
      <section className="bg-parchment-deep/50">
        <Container className="py-16 sm:py-20">
          <Card className="mx-auto max-w-4xl p-8 sm:p-10">
            <h2 className="font-display text-3xl font-medium text-ink">
              À la carte, always
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Every service we offer stands on its own. If all your family needs is a single
              kindness — just the clergy booking, just the tribute video, just the program
              printing — you may have it alone, at its listed price, with nothing bundled in.
            </p>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {A_LA_CARTE.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-3"
                >
                  <span className="text-sm text-ink">{item.name}</span>
                  <span className="whitespace-nowrap text-sm font-medium text-gold-deep">
                    from {formatUsd(item.priceUsd)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      {/* FAQ */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Common questions"
            title="Questions families ask"
            lede="Asked gently, answered plainly. If your question is not here, call us — any hour."
          />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-line bg-white/80 shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-lg leading-none text-gold transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing verse & CTA */}
      <section className="border-t border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 sm:py-20">
          {isaiah ? <VerseBlock text={isaiah.text} reference={isaiah.reference} /> : null}
          <ButtonLink href="/plan" className="mt-10">
            Begin planning together
          </ButtonLink>
        </Container>
      </section>
    </div>
  );
}
