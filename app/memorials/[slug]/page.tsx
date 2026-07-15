import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MEMORIALS, memorialBySlug } from "@/lib/data/memorials";
import { hymnById } from "@/lib/data/hymns";
import type { Hymn } from "@/lib/types";
import { Card, Container, SectionHeading, VerseBlock, formatLongDate } from "@/components/ui";
import { Guestbook } from "@/components/memorials/guestbook";
import { ShareMemorial } from "@/components/memorials/share-memorial";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MEMORIALS.map((memorial) => ({ slug: memorial.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const memorial = memorialBySlug(slug);
  if (!memorial) {
    return { title: "Memorial" };
  }
  return {
    title: `In Loving Memory of ${memorial.fullName}`,
    description: `A page of remembrance for ${memorial.fullName} of ${memorial.location} — their story, their verse, the hymns they loved, and a guestbook of condolences.`,
  };
}

const NEXT_STEPS = [
  {
    href: "/plan",
    mark: "✝",
    title: "Plan a service",
    body: "A step-by-step companion that carries every detail of the farewell, so your family can carry each other.",
  },
  {
    href: "/tribute",
    mark: "♬",
    title: "Create a tribute video",
    body: "Weave photographs and a beloved hymn into a gentle tribute for the service or the years to come.",
  },
  {
    href: "/resources",
    mark: "❧",
    title: "Grief resources",
    body: "Scripture, quiet guidance, and support for the days and seasons ahead.",
  },
] as const;

export default async function MemorialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const memorial = memorialBySlug(slug);
  if (!memorial) {
    notFound();
  }

  const hymns = memorial.hymnIds
    .map((id) => hymnById(id))
    .filter((hymn): hymn is Hymn => hymn !== undefined);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="mb-10">
          <Link
            href="/memorials"
            className="text-sm text-ink-faint transition-colors hover:text-gold-deep"
          >
            <span aria-hidden>←</span> All memorials
          </Link>
        </div>

        {/* Hero */}
        <header className="text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold/50 bg-white/70 p-2 shadow-soft">
            <div className="flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-gold-pale/60">
              <span aria-hidden className="text-5xl">
                {memorial.portraitEmoji ?? "✝"}
              </span>
            </div>
          </div>
          <p className="ornament mt-10 justify-center text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            In Loving Memory of
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-ink sm:text-6xl">
            {memorial.fullName}
          </h1>
          <p className="mt-5 text-sm text-ink-faint">
            {formatLongDate(memorial.birthDate)} — {formatLongDate(memorial.deathDate)}
          </p>
          <p className="mt-1 text-sm text-ink-faint">{memorial.location}</p>
          <VerseBlock
            className="mt-14"
            text={memorial.verse.text}
            reference={memorial.verse.reference}
          />
        </header>

        <div className="mt-24 space-y-24">
          {/* Their Essence */}
          <section>
            <SectionHeading
              eyebrow="The little things we will always remember"
              title="Their Essence"
            />
            <Card className="mx-auto mt-10 max-w-2xl p-8 sm:p-10">
              <ul className="space-y-4">
                {memorial.essence.map((phrase) => (
                  <li key={phrase} className="flex items-start gap-3.5">
                    <span aria-hidden className="mt-1 text-lg leading-none text-gold">
                      ❧
                    </span>
                    <span className="font-display text-xl italic leading-snug text-ink-soft">
                      {phrase}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Their Story */}
          <section>
            <SectionHeading eyebrow="A life remembered" title="Their Story" />
            <div className="mx-auto mt-10 max-w-prose space-y-6 text-base leading-relaxed text-ink-soft">
              {memorial.story.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.8] first-letter:text-gold-deep"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Hymns They Loved */}
          <section>
            <SectionHeading eyebrow="Songs of the faith" title="Hymns They Loved" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hymns.map((hymn) => (
                <Card key={hymn.id} className="flex h-full flex-col gap-2.5 p-6">
                  <h3 className="font-display text-xl font-medium text-ink">{hymn.title}</h3>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    {hymn.author} · {hymn.year}
                  </p>
                  <p className="font-display italic leading-snug text-ink-soft">
                    “{hymn.firstLine}”
                  </p>
                  <p className="mt-auto pt-2 text-sm leading-relaxed text-ink-faint">
                    {hymn.note}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Survived By */}
          <section>
            <SectionHeading eyebrow="Held in love" title="Survived By" />
            <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-ink-soft">
              {memorial.survivedBy}
            </p>
          </section>

          {/* Guestbook */}
          <Guestbook slug={memorial.slug} />

          {/* Share */}
          <section aria-label="Share this memorial">
            <ShareMemorial personName={memorial.fullName} />
          </section>

          {/* Cross-links */}
          <section>
            <SectionHeading
              eyebrow="Continue gently"
              title="More ways to honor them"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {NEXT_STEPS.map((step) => (
                <Link key={step.href} href={step.href} className="group block h-full">
                  <Card className="flex h-full flex-col gap-3 p-7 transition-shadow duration-200 group-hover:shadow-lift">
                    <span aria-hidden className="text-2xl text-gold">
                      {step.mark}
                    </span>
                    <h3 className="font-display text-xl font-medium text-ink">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
                    <span className="mt-auto pt-2 text-sm font-medium text-gold-deep">
                      Visit <span aria-hidden>→</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
