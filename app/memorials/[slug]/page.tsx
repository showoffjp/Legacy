import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { memorialBySlug } from "@/lib/data/memorials";
import { hymnById } from "@/lib/data/hymns";
import type { Hymn, Memorial } from "@/lib/types";
import {
  getPublishedMemorial,
  listCondolences,
  type PublishedMemorial,
} from "@/lib/server/memorials";
import { Card, Container, SectionHeading, VerseBlock, formatLongDate } from "@/components/ui";
import { Guestbook } from "@/components/memorials/guestbook";
import { ServerGuestbook } from "@/components/memorials/server-guestbook";
import { RsvpForm } from "@/components/memorials/rsvp-form";
import { ShareMemorial } from "@/components/memorials/share-memorial";

// Published memorials and their guestbooks must always render fresh.
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const KIND_LABELS: Record<string, string> = {
  "traditional-burial": "Funeral Service",
  "cremation-with-service": "Funeral Service",
  "memorial-service": "Memorial Service",
  "graveside-service": "Graveside Service",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sample = memorialBySlug(slug);
  const published = sample ? null : getPublishedMemorial(slug);
  const name = sample?.fullName ?? published?.data.fullName;
  if (!name) return { title: "Memorial" };
  return {
    title: `In Loving Memory of ${name}`,
    description: `A page of remembrance for ${name} — their story, their verse, the hymns they loved, and a guestbook of condolences.`,
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

function hymnsFor(ids: string[]): Hymn[] {
  return ids.map((id) => hymnById(id)).filter((hymn): hymn is Hymn => hymn !== undefined);
}

function CrossLinks() {
  return (
    <section>
      <SectionHeading eyebrow="Continue gently" title="More ways to honor them" />
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
  );
}

function HymnsSection({ hymns }: { hymns: Hymn[] }) {
  if (hymns.length === 0) return null;
  return (
    <section>
      <SectionHeading eyebrow="Songs of the faith" title="Hymns They Loved" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hymns.map((hymn) => (
          <Card key={hymn.id} className="flex h-full flex-col gap-2.5 p-6">
            <h3 className="font-display text-xl font-medium text-ink">{hymn.title}</h3>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              {hymn.author} · {hymn.year}
            </p>
            <p className="font-display italic leading-snug text-ink-soft">“{hymn.firstLine}”</p>
            <p className="mt-auto pt-2 text-sm leading-relaxed text-ink-faint">{hymn.note}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function StorySection({ story }: { story: string[] }) {
  if (story.length === 0) return null;
  return (
    <section>
      <SectionHeading eyebrow="A life remembered" title="Their Story" />
      <div className="mx-auto mt-10 max-w-prose space-y-6 text-base leading-relaxed text-ink-soft">
        {story.map((paragraph, index) => (
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
  );
}

function SurvivedBySection({ text }: { text: string }) {
  if (!text) return null;
  return (
    <section>
      <SectionHeading eyebrow="Held in love" title="Survived By" />
      <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-ink-soft">
        {text}
      </p>
    </section>
  );
}

/* ————— Sample memorials (the examples that ship with the site) ————— */

function SampleMemorialView({ memorial }: { memorial: Memorial }) {
  const hymns = hymnsFor(memorial.hymnIds);
  return (
    <>
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
        <VerseBlock className="mt-14" text={memorial.verse.text} reference={memorial.verse.reference} />
      </header>

      <div className="mt-24 space-y-24">
        <section>
          <SectionHeading eyebrow="The little things we will always remember" title="Their Essence" />
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

        <StorySection story={memorial.story} />
        <HymnsSection hymns={hymns} />
        <SurvivedBySection text={memorial.survivedBy} />
        <Guestbook slug={memorial.slug} />
        <section aria-label="Share this memorial">
          <ShareMemorial personName={memorial.fullName} />
        </section>
        <CrossLinks />
      </div>
    </>
  );
}

/* ————— Published memorials (created by families from their plan) ————— */

function PublishedMemorialView({ memorial }: { memorial: PublishedMemorial }) {
  const d = memorial.data;
  const hymns = hymnsFor(d.hymnIds);
  const service = d.service;
  const hasServiceDetails = Boolean(service && (service.date || service.venueName));
  const dates = [d.birthDate, d.deathDate].filter(Boolean).map(formatLongDate).join(" — ");
  const condolences = listCondolences(memorial.slug).map((c) => ({
    id: c.id,
    name: c.name,
    message: c.message,
    createdAt: c.created_at,
  }));

  return (
    <>
      <header className="text-center">
        {d.portraitDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.portraitDataUrl}
            alt={`Portrait of ${d.fullName}`}
            className="mx-auto h-44 w-36 rounded-t-full border-4 border-gold-pale object-cover shadow-soft"
          />
        ) : (
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold/50 bg-white/70 p-2 shadow-soft">
            <div className="flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-gold-pale/60">
              <span aria-hidden className="text-5xl">✝</span>
            </div>
          </div>
        )}
        <p className="ornament mt-10 justify-center text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
          In Loving Memory of
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-ink sm:text-6xl">
          {d.fullName}
        </h1>
        {d.nickname ? (
          <p className="mt-3 font-display text-2xl italic text-ink-soft">“{d.nickname}”</p>
        ) : null}
        {dates ? <p className="mt-5 text-sm text-ink-faint">{dates}</p> : null}
        {d.locationText ? <p className="mt-1 text-sm text-ink-faint">{d.locationText}</p> : null}
        {d.verse ? (
          <VerseBlock className="mt-14" text={d.verse.text} reference={d.verse.reference} />
        ) : null}
      </header>

      <div className="mt-24 space-y-24">
        {hasServiceDetails && service ? (
          <section aria-label="Service details">
            <SectionHeading
              eyebrow="You are warmly invited"
              title={KIND_LABELS[service.kind] ?? "The Service"}
            />
            <Card className="mx-auto mt-10 max-w-2xl p-8 sm:p-10">
              <dl className="space-y-3 text-center">
                {service.date ? (
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      When
                    </dt>
                    <dd className="mt-1 font-display text-2xl text-ink">
                      {formatLongDate(service.date)}
                      {service.time ? ` · ${service.time}` : ""}
                    </dd>
                  </div>
                ) : null}
                {service.venueName || service.city ? (
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      Where
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {[service.venueName, [service.city, service.state].filter(Boolean).join(", ")]
                        .filter(Boolean)
                        .join(" — ")}
                    </dd>
                  </div>
                ) : null}
                {service.livestream ? (
                  <div>
                    <dd className="text-sm italic text-ink-faint">
                      For family afar, the service will be lovingly streamed — the family will share
                      the link.
                    </dd>
                  </div>
                ) : null}
              </dl>
              {service.date ? (
                <p className="mt-6 text-center">
                  <a
                    href={`/memorials/${memorial.slug}/service.ics`}
                    className="text-sm font-medium text-gold-deep underline-offset-2 hover:underline"
                  >
                    📅 Add the service to your calendar
                  </a>
                </p>
              ) : null}
              <div className="mt-8 border-t border-line pt-8">
                <h3 className="mb-4 text-center font-display text-xl font-semibold text-ink">
                  Let the family know you are coming
                </h3>
                <RsvpForm slug={memorial.slug} />
              </div>
            </Card>
          </section>
        ) : null}

        <StorySection story={d.story} />
        <HymnsSection hymns={hymns} />
        <SurvivedBySection text={d.survivedBy} />
        <ServerGuestbook slug={memorial.slug} initialEntries={condolences} />
        <section aria-label="Share this memorial">
          <ShareMemorial personName={d.fullName} />
        </section>
        <CrossLinks />
      </div>
    </>
  );
}

export default async function MemorialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sample = memorialBySlug(slug);
  const published = sample ? null : getPublishedMemorial(slug);
  if (!sample && !published) {
    notFound();
  }

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
        {sample ? (
          <SampleMemorialView memorial={sample} />
        ) : (
          <PublishedMemorialView memorial={published!} />
        )}
      </Container>
    </div>
  );
}
