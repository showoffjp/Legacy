import type { Metadata } from "next";
import Link from "next/link";
import { MEMORIALS } from "@/lib/data/memorials";
import { listPublishedMemorials } from "@/lib/server/memorials";
import { ButtonLink, Card, Container } from "@/components/ui";

// Newly published memorials must appear without a rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Memorials",
  description:
    "Pages of remembrance — each memorial captures the essence of a loved one: their story, their verse, their hymns, and the condolences of all who loved them.",
};

const yearOf = (iso: string) => iso.slice(0, 4);

export default async function MemorialsPage() {
  const published = await listPublishedMemorials();
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            The Book of Remembrance
          </span>
          <h1 className="font-display text-4xl font-medium text-ink sm:text-[2.75rem] sm:leading-[1.1]">
            Lives written in the Book of Life
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
            Each memorial captures the essence of a loved one — their story, their verse,
            their hymns — and gathers condolences from all who loved them.
          </p>
        </div>

        {published.length > 0 ? (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((memorial) => (
              <li key={memorial.slug} className="h-full">
                <Link
                  href={`/memorials/${memorial.slug}`}
                  className="group block h-full focus:outline-none"
                >
                  <Card className="flex h-full flex-col items-center gap-4 p-8 text-center transition-shadow duration-200 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-gold-pale">
                    {memorial.data.portraitDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={memorial.data.portraitDataUrl}
                        alt=""
                        className="h-16 w-16 rounded-full border-2 border-gold-pale object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-pale/60 text-3xl"
                      >
                        ✝
                      </span>
                    )}
                    <div>
                      <h2 className="font-display text-2xl font-medium leading-snug text-ink">
                        {memorial.data.fullName}
                      </h2>
                      {memorial.data.birthDate || memorial.data.deathDate ? (
                        <p className="mt-1.5 text-sm text-ink-faint">
                          {yearOf(memorial.data.birthDate)}
                          <span className="sr-only"> to </span>
                          <span aria-hidden className="mx-1.5 text-xs text-gold">
                            †
                          </span>
                          {yearOf(memorial.data.deathDate)}
                        </p>
                      ) : null}
                      {memorial.data.locationText ? (
                        <p className="mt-0.5 text-sm text-ink-faint">{memorial.data.locationText}</p>
                      ) : null}
                    </div>
                    {memorial.data.verse ? (
                      <p className="mt-auto pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
                        {memorial.data.verse.reference}
                      </p>
                    ) : null}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-16 text-center text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ink-faint">
          Examples of remembrance
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEMORIALS.map((memorial) => (
            <li key={memorial.slug} className="h-full">
              <Link
                href={`/memorials/${memorial.slug}`}
                className="group block h-full focus:outline-none"
              >
                <Card className="flex h-full flex-col items-center gap-4 p-8 text-center transition-shadow duration-200 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-gold-pale">
                  <span
                    aria-hidden
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-pale/60 text-3xl"
                  >
                    {memorial.portraitEmoji ?? "✝"}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-medium leading-snug text-ink">
                      {memorial.fullName}
                    </h2>
                    <p className="mt-1.5 text-sm text-ink-faint">
                      {yearOf(memorial.birthDate)}
                      <span className="sr-only"> to </span>
                      <span aria-hidden className="mx-1.5 text-xs text-gold">
                        †
                      </span>
                      {yearOf(memorial.deathDate)}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-faint">{memorial.location}</p>
                  </div>
                  <p className="font-display text-lg italic leading-snug text-ink-soft">
                    “{memorial.essence[0]}”
                  </p>
                  <p className="mt-auto pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
                    {memorial.verse.reference}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>

        <Card className="mt-16 flex flex-col items-center gap-5 p-10 text-center sm:p-14">
          <span aria-hidden className="text-2xl text-gold">
            ✝
          </span>
          <h2 className="font-display text-3xl font-medium text-ink">
            Create a memorial for your loved one
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
            The planning companion builds the memorial as you go — their story, their verse,
            their hymns — so that when the service is arranged, their page of remembrance is
            already written.
          </p>
          <ButtonLink href="/plan" variant="outline">
            Begin with the planning companion
          </ButtonLink>
        </Card>
      </Container>
    </div>
  );
}
