"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Container, formatLongDate } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import { hymnById } from "@/lib/data/hymns";
import { scriptureById } from "@/lib/data/scriptures";

/**
 * The printed order-of-service program, generated live from the family's plan.
 * On screen it previews as letter pages; window.print() produces the handout
 * (print double-sided, flipped on the short edge, and fold).
 */

function Page({ children }: { children: ReactNode }) {
  return (
    <section className="print-page mx-auto flex min-h-[10in] w-full max-w-[7.6in] flex-col border border-line bg-white px-14 py-16 shadow-lift">
      {children}
    </section>
  );
}

function Ornament() {
  return (
    <div aria-hidden className="my-4 flex items-center justify-center gap-3 text-gold">
      <span className="h-px w-16 bg-current opacity-60" />
      <span className="text-lg leading-none">✝</span>
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  );
}

function OrderRow({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <span className="shrink-0 font-medium text-ink">{left}</span>
      <span className="mx-1 flex-1 border-b border-dotted border-line" aria-hidden />
      <span className="shrink-0 text-right italic text-ink-soft">{right || "—"}</span>
    </div>
  );
}

export function ProgramView() {
  const { plan, ready } = usePlan();

  const home = funeralHomeById(plan.funeralHomeId);
  const minister = clergyById(plan.clergyId);
  const hymns = plan.hymnIds.map(hymnById).filter((h) => h !== undefined);
  const scriptures = plan.scriptureIds.map(scriptureById).filter((s) => s !== undefined);
  const favoriteVerse = scriptureById(plan.deceased.favoriteVerseId);

  const name = plan.deceased.fullName || "Your Loved One";
  const nickname = plan.deceased.nickname;
  const dates = [plan.deceased.birthDate, plan.deceased.deathDate]
    .filter(Boolean)
    .map(formatLongDate)
    .join("  ·  ");
  const when = [formatLongDate(plan.service.date), plan.service.time].filter(Boolean).join(" · ");
  const where = [
    plan.service.venueName,
    [plan.service.location.city, plan.service.location.state].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" — ");

  const eulogists = plan.program.eulogists.split("\n").map((l) => l.trim()).filter(Boolean);
  const pallbearers = plan.program.pallbearers.split("\n").map((l) => l.trim()).filter(Boolean);
  const storyParagraphs = plan.deceased.lifeStory.split("\n").map((l) => l.trim()).filter(Boolean);

  const officiantName = minister ? `${minister.name}` : "Officiating Minister";

  if (!ready) return <div className="min-h-screen bg-parchment-deep/40" />;

  return (
    <div className="bg-parchment-deep/40 pb-20">
      {/* Toolbar — never printed */}
      <div className="no-print border-b border-line bg-parchment">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              The Order of Service Program
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Generated from your plan.{" "}
              <Link href="/plan" className="text-gold-deep underline-offset-2 hover:underline">
                Return to the planner
              </Link>{" "}
              to change anything — the program updates itself.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
            >
              🖨 Print the program
            </button>
          </div>
        </Container>
        <Container className="pb-4">
          <p className="text-xs text-ink-faint">
            Tip: print double-sided (flip on short edge) on ivory cardstock, then fold — each page
            below becomes one face of the folded program.
          </p>
        </Container>
      </div>

      <div className="mt-10 space-y-10">
        {/* ——— Cover ——— */}
        <Page>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold">
              In Loving Memory
            </p>
            <Ornament />
            {plan.deceased.portraitDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={plan.deceased.portraitDataUrl}
                alt={`Portrait of ${name}`}
                className="my-6 h-52 w-44 rounded-t-full border-4 border-gold-pale object-cover shadow-soft"
              />
            ) : (
              <span aria-hidden className="my-6 text-5xl">🕊️</span>
            )}
            <h2 className="font-display text-5xl font-medium leading-tight text-ink">{name}</h2>
            {nickname ? (
              <p className="mt-2 font-display text-xl italic text-ink-soft">“{nickname}”</p>
            ) : null}
            {dates ? (
              <p className="mt-4 text-sm tracking-[0.15em] text-ink-soft">{dates}</p>
            ) : null}
            {plan.deceased.veteran ? (
              <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                ★ {plan.deceased.veteranBranch || "Armed Forces"} Veteran ★
              </p>
            ) : null}
            {favoriteVerse ? (
              <div className="mt-8 max-w-md">
                <p className="font-display text-lg italic leading-relaxed text-ink-soft">
                  “{favoriteVerse.text.length > 140
                    ? `${favoriteVerse.text.slice(0, favoriteVerse.text.indexOf(" ", 120))}…`
                    : favoriteVerse.text}”
                </p>
                <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                  {favoriteVerse.reference}
                </p>
              </div>
            ) : null}
          </div>
          <div className="mt-10 text-center text-sm text-ink-soft">
            {when ? <p>{when}</p> : null}
            {where ? <p className="mt-1">{where}</p> : null}
          </div>
        </Page>

        {/* ——— Order of Service ——— */}
        <Page>
          <h3 className="text-center font-display text-3xl font-medium text-ink">
            Order of Service
          </h3>
          {minister ? (
            <p className="mt-2 text-center text-sm italic text-ink-soft">
              {officiantName}, {minister.title} — officiating
            </p>
          ) : null}
          <Ornament />
          <div className="mx-auto w-full max-w-md flex-1 text-sm">
            <OrderRow left="Prelude" right="Instrumental" />
            <OrderRow left="Processional" right="Family & Clergy" />
            <OrderRow left="Opening Prayer" right={officiantName} />
            {scriptures[0] ? (
              <OrderRow left={`Scripture · ${scriptures[0].reference}`} right="Reader" />
            ) : null}
            {hymns[0] ? <OrderRow left={`Hymn · “${hymns[0].title}”`} right="Congregation" /> : null}
            {scriptures.slice(1, 3).map((sc) => (
              <OrderRow key={sc.id} left={`Scripture · ${sc.reference}`} right="Reader" />
            ))}
            <OrderRow left="The Obituary" right="Read softly, or in silence" />
            {eulogists.length > 0 ? (
              eulogists.map((e) => <OrderRow key={e} left="Remarks & Remembrance" right={e} />)
            ) : (
              <OrderRow left="Remarks & Remembrance" right="Family & Friends" />
            )}
            {hymns[1] ? <OrderRow left={`Hymn · “${hymns[1].title}”`} right="Congregation" /> : null}
            <OrderRow left="Message of Comfort" right={officiantName} />
            <OrderRow left="Benediction" right={officiantName} />
            {hymns[2] ? (
              <OrderRow left={`Recessional · “${hymns[2].title}”`} right="Congregation" />
            ) : (
              <OrderRow left="Recessional" right="Family & Clergy" />
            )}
            {plan.service.graveside ? (
              <OrderRow left="Committal" right="At the graveside" />
            ) : null}
            {plan.addonIds.includes("veteran-honors") || plan.deceased.veteran ? (
              <OrderRow left="Military Honors" right="Flag presentation & Taps" />
            ) : null}
            {plan.addonIds.includes("dove-release") ? (
              <OrderRow left="Dove Release" right="Following the committal" />
            ) : null}
            {plan.addonIds.includes("bagpiper") ? (
              <OrderRow left="Piper's Farewell" right="“Amazing Grace”" />
            ) : null}
          </div>
          {plan.service.livestream ? (
            <p className="mt-6 text-center text-xs italic text-ink-faint">
              {plan.service.livestreamUrl
                ? `For family afar, the service is lovingly streamed: ${plan.service.livestreamUrl}`
                : "For family afar, the service is lovingly streamed — the family will share the link."}
            </p>
          ) : null}
        </Page>

        {/* ——— Obituary ——— */}
        {(storyParagraphs.length > 0 || plan.deceased.survivedBy) && (
          <Page>
            <h3 className="text-center font-display text-3xl font-medium text-ink">
              A Life Remembered
            </h3>
            <Ornament />
            <div className="flex-1 space-y-4 text-sm leading-relaxed text-ink-soft">
              {storyParagraphs.map((para, i) => (
                <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.85] first-letter:text-gold-deep" : ""}>
                  {para}
                </p>
              ))}
              {plan.deceased.survivedBy ? (
                <>
                  <h4 className="pt-4 text-center font-display text-xl font-semibold not-italic text-ink">
                    Survived By
                  </h4>
                  <p className="text-center">{plan.deceased.survivedBy}</p>
                </>
              ) : null}
            </div>
          </Page>
        )}

        {/* ——— Readings ——— */}
        {scriptures.length > 0 && (
          <Page>
            <h3 className="text-center font-display text-3xl font-medium text-ink">
              The Readings
            </h3>
            <Ornament />
            <div className="flex-1 space-y-6">
              {scriptures.map((sc) => (
                <figure key={sc.id}>
                  <blockquote className="font-display text-base italic leading-relaxed text-ink-soft">
                    “{sc.text}”
                  </blockquote>
                  <figcaption className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                    {sc.reference} · KJV
                  </figcaption>
                </figure>
              ))}
            </div>
          </Page>
        )}

        {/* ——— Back page ——— */}
        <Page>
          <div className="flex flex-1 flex-col justify-center space-y-8 text-center">
            {pallbearers.length > 0 ? (
              <div>
                <h4 className="font-display text-xl font-semibold text-ink">Pallbearers</h4>
                <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                  {pallbearers.map((pb) => (
                    <li key={pb}>{pb}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {plan.program.specialNotes ? (
              <div>
                <h4 className="font-display text-xl font-semibold text-ink">
                  A Note from the Family
                </h4>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  {plan.program.specialNotes}
                </p>
              </div>
            ) : null}

            <div>
              <h4 className="font-display text-xl font-semibold text-ink">Acknowledgments</h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                {plan.program.acknowledgment}
              </p>
            </div>

            <Ornament />
            <div className="text-xs text-ink-faint">
              {home ? (
                <p>
                  Services entrusted to {home.name} · {home.location.city}, {home.location.state}
                </p>
              ) : null}
              <p className="mt-1">Program lovingly prepared with Legacy</p>
            </div>
          </div>
        </Page>
      </div>

      <div className="no-print mt-12 text-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-parchment transition-colors hover:bg-night"
        >
          🖨 Print the program
        </button>
      </div>
    </div>
  );
}
