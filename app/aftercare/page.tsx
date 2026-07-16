import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, Container, SectionHeading, VerseBlock } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { EstateChecklist } from "@/components/aftercare/estate-checklist";
import { LetterBuilder } from "@/components/aftercare/letter-builder";
import { GriefYearForm } from "@/components/aftercare/grief-year-form";

export const metadata: Metadata = {
  title: "Aftercare & the Estate Path",
  description:
    "The year after the service, carried together — the executor's checklist, notification letters written for you, and gentle notes of comfort on the hardest days.",
};

const NEXT_STEPS = [
  {
    href: "/resources",
    title: "Grief resources",
    body: "Scriptures of comfort, prayers for the grieving, and counselors and GriefShare groups who understand.",
    cta: "Find comfort",
  },
  {
    href: "/directory?tab=providers",
    title: "Legal & estate partners",
    body: "Vetted probate attorneys and estate advisors for the matters that deserve a professional hand.",
    cta: "Find trusted help",
  },
  {
    href: "/plan/wishes",
    title: "Record your own wishes",
    body: "Loss teaches what clarity is worth. A signed Letter of Wishes is the kindness they may have left you.",
    cta: "Begin in peace",
  },
];

export default async function AftercarePage({
  searchParams,
}: {
  searchParams: Promise<{ remembrance?: string }>;
}) {
  const { remembrance } = await searchParams;

  return (
    <div className="pb-24">
      <section className="no-print border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          {remembrance === "ended" ? (
            <p
              role="status"
              className="mb-8 rounded-2xl border border-sage/40 bg-sage/10 px-5 py-3 text-sm text-ink-soft"
            >
              Your remembrance notes are ended — no more will come. We remain here whenever you
              need us.
            </p>
          ) : null}
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            After the service
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            The long walk afterward, carried together
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            The cars leave, the casseroles end, and a quieter work begins — accounts to close,
            papers to file, and a year of first days without them. None of it is urgent, and
            none of it must be carried alone. This page holds all of it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#estate-path" variant="outline">
              📋 The estate path
            </ButtonLink>
            <ButtonLink href="#letters" variant="outline">
              ✉️ Notification letters
            </ButtonLink>
            <ButtonLink href="#grief-year" variant="outline">
              🕊️ The grief year
            </ButtonLink>
          </div>
          <VerseBlock
            className="mt-12"
            text="Be still, and know that I am God."
            reference="Psalm 46:10"
          />
        </Container>
      </section>

      <section id="estate-path" className="no-print scroll-mt-24">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Settling their affairs"
            title="The Estate Path"
            lede="Every administrative matter a death asks of a family, in the order it asks — from the first days to the closing of the estate. Your progress is saved on this device."
          />
          <div className="mt-12">
            <EstateChecklist />
          </div>
          <Reveal>
            <Card className="mx-auto mt-12 max-w-3xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">This is guidance, not legal advice.</span>{" "}
                  Estates with property, businesses, or family complexity deserve a probate
                  attorney — a first consultation with our vetted partners costs nothing.
                </p>
                <ButtonLink href="/directory?tab=providers" variant="ghost">
                  Legal &amp; estate partners
                </ButtonLink>
              </div>
            </Card>
          </Reveal>
        </Container>
      </section>

      <section id="letters" className="scroll-mt-24 border-t border-line bg-parchment-deep/40">
        <Container className="py-16 sm:py-20">
          <div className="no-print">
            <SectionHeading
              eyebrow="The words are hard to find — so we found them"
              title="Notification Letters, Written For You"
              lede="Banks, insurers, credit bureaus, subscriptions — each needs the same sad letter. Fill in the names once and print one for every institution, composed entirely on your device."
            />
          </div>
          <div className="mt-12">
            <LetterBuilder />
          </div>
        </Container>
      </section>

      <section id="grief-year" className="no-print scroll-mt-24 bg-night text-parchment">
        <Container className="py-16 sm:py-20">
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-pale">
              Grief does not keep a calendar
            </span>
            <h2 className="font-display text-4xl font-medium sm:text-[2.75rem] sm:leading-[1.1]">
              The Grief Year
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-parchment/75">
              One month. Six months. The first Christmas. The first anniversary. On the days
              grief hits hardest, a verse and a word of comfort arrive in your inbox — never
              marketing, ended with one click.
            </p>
          </Reveal>
          <Card className="mx-auto mt-12 max-w-2xl p-8 sm:p-10">
            <GriefYearForm />
          </Card>
        </Container>
      </section>

      <section aria-labelledby="aftercare-next" className="no-print">
        <Container className="py-16 sm:py-20">
          <h2
            id="aftercare-next"
            className="text-center font-display text-3xl font-medium text-ink"
          >
            Where to turn next
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-3">
            {NEXT_STEPS.map((step, i) => (
              <Reveal key={step.href} delay={i * 110} className="h-full">
                <Link href={step.href} className="group block h-full">
                  <Card className="flex h-full flex-col p-7 transition-shadow duration-200 group-hover:shadow-lift">
                    <h3 className="font-display text-2xl font-medium text-ink">{step.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-deep">
                      {step.cta} <span aria-hidden>→</span>
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
