import type { Metadata } from "next";
import { Card, Container, SectionHeading } from "@/components/ui";
import { PartnerApplicationForm, type CategoryOption } from "@/components/partners/application-form";
import { CATEGORY_LABELS } from "@/components/partners/categories";
import { PARTNER_CATEGORIES } from "@/lib/server/partners";

export const metadata: Metadata = {
  title: "Partner with Legacy",
};

const VALUE_CARDS: { title: string; body: string }[] = [
  {
    title: "Families arrive prepared",
    body: "A family who reaches you through Legacy has already gathered the essentials — service wishes, selections, scriptures, dates. Your first conversation is care, not a cold call.",
  },
  {
    title: "Coordination handled",
    body: "A Legacy coordinator is the family's single point of contact. Details are gathered once and passed to you as one clear brief, not a dozen phone calls in a hard week.",
  },
  {
    title: "No fees to families in crisis",
    body: "Families never pay to be connected with you, and the economics are transparent to every partner. There are no surprise charges on either side of the introduction.",
  },
];

export default function PartnersPage() {
  const categories: CategoryOption[] = PARTNER_CATEGORIES.map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }));

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Partner with Legacy
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Serve grieving families with us
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Legacy&rsquo;s directory is a vetted network — funeral homes, clergy, florists,
            casket makers, monument builders, repast caterers, and livestream teams. We
            check licensing and references personally, and we ask one thing above all:
            gentleness with families in grief.
          </p>
        </Container>
      </section>

      {/* Why partners serve with Legacy */}
      <section>
        <Container className="py-16 sm:py-20">
          <h2 className="sr-only">Why partners serve with Legacy</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUE_CARDS.map((card) => (
              <Card key={card.title} className="p-8">
                <h3 className="font-display text-2xl font-medium text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{card.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Application */}
      <section className="border-t border-line bg-parchment-deep/50">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="The application"
            title="Ask to join the network"
            lede="Tell us who you are and how you serve. Our care team reviews every application personally — licensing, references, and a heart for grieving families."
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <PartnerApplicationForm categories={categories} />
          </div>
        </Container>
      </section>
    </div>
  );
}
