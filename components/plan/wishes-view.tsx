"use client";

import Link from "next/link";
import { Container, formatLongDate } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import { casketById } from "@/lib/data/caskets";
import { flowerById } from "@/lib/data/flowers";
import { addonById } from "@/lib/data/addons";
import { hymnById } from "@/lib/data/hymns";
import { scriptureById } from "@/lib/data/scriptures";

const KIND_LABELS: Record<string, string> = {
  "traditional-burial": "A traditional burial",
  "cremation-with-service": "Cremation, with a service of worship",
  "memorial-service": "A memorial service",
  "graveside-service": "A graveside service",
};

function WishRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-2.5">
      <dt className="w-44 shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">
        {label}
      </dt>
      <dd className="flex-1 border-b border-dotted border-line pb-1 text-sm leading-relaxed text-ink">
        {value || <span className="text-ink-faint">— left to the family&apos;s judgment —</span>}
      </dd>
    </div>
  );
}

export function WishesView() {
  const { plan, ready } = usePlan();

  if (!ready) return <div className="min-h-screen bg-parchment-deep/40" />;

  const d = plan.deceased;
  const s = plan.service;
  const home = funeralHomeById(plan.funeralHomeId);
  const minister = clergyById(plan.clergyId);
  const casket = casketById(plan.casketId);
  const flowers = plan.flowerIds.map(flowerById).filter((f) => f !== undefined);
  const addons = plan.addonIds.map(addonById).filter((a) => a !== undefined);
  const hymns = plan.hymnIds.map(hymnById).filter((h) => h !== undefined);
  const scriptures = plan.scriptureIds.map(scriptureById).filter((sc) => sc !== undefined);
  const verse = scriptureById(d.favoriteVerseId);

  if (!d.fullName) {
    return (
      <div className="bg-parchment py-24 text-center">
        <Container>
          <h1 className="font-display text-3xl font-medium text-ink">The Letter of Wishes</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Begin with the planning companion and choose “Planning ahead — recording wishes.”
            Every choice you make gathers here into a letter you can sign and keep.
          </p>
          <Link
            href="/plan"
            className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white shadow-soft hover:bg-gold-deep"
          >
            Open the planning companion
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-parchment-deep/40 pb-20">
      <div className="no-print border-b border-line bg-parchment">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">The Letter of Wishes</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Generated from the plan.{" "}
              <Link href="/plan" className="text-gold-deep underline-offset-2 hover:underline">
                Return to the planner
              </Link>{" "}
              to change anything — the letter updates itself.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
          >
            🖨 Print the letter
          </button>
        </Container>
        <Container className="pb-4">
          <p className="text-xs text-ink-faint">
            Sign it, share a copy with those you trust, and keep the original with your important
            documents. This letter is a statement of wishes, not a legal will.
          </p>
        </Container>
      </div>

      <section className="print-page mx-auto mt-10 flex min-h-[10in] w-full max-w-[7.6in] flex-col border border-line bg-white px-14 py-16 shadow-lift">
        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold">
          A Letter of Wishes
        </p>
        <div aria-hidden className="my-4 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-16 bg-current opacity-60" />
          <span className="text-lg leading-none">✝</span>
          <span className="h-px w-16 bg-current opacity-60" />
        </div>
        <h2 className="text-center font-display text-4xl font-medium text-ink">{d.fullName}</h2>
        {d.birthDate ? (
          <p className="mt-2 text-center text-sm text-ink-faint">
            born {formatLongDate(d.birthDate)}
          </p>
        ) : null}

        <p className="mt-8 text-sm leading-relaxed text-ink-soft">
          To my family and those who will care for these things when the time comes: I have set
          down these wishes in peace and in faith, so that no hard decision falls to you on a hard
          day. Hold them gently — and where love sees a better way, choose it freely.
        </p>

        <dl className="mt-8">
          <WishRow label="The service" value={s.kind ? (KIND_LABELS[s.kind] ?? "") : ""} />
          <WishRow label="Church or venue" value={s.venueName} />
          <WishRow
            label="Community"
            value={[s.location.city, s.location.state].filter(Boolean).join(", ")}
          />
          <WishRow label="Funeral home" value={home ? `${home.name}, ${home.location.city}` : ""} />
          <WishRow
            label="To lead the service"
            value={minister ? `${minister.name} (${minister.denomination})` : ""}
          />
          <WishRow
            label={casket?.kind === "urn" ? "Urn" : "Casket"}
            value={casket ? `${casket.name} — ${casket.material}` : ""}
          />
          <WishRow label="Flowers" value={flowers.map((f) => f.name).join("; ")} />
          <WishRow label="Honors & remembrances" value={addons.map((a) => a.name).join("; ")} />
          <WishRow label="Hymns" value={hymns.map((h) => `“${h.title}”`).join(", ")} />
          <WishRow
            label="Scriptures to be read"
            value={scriptures.map((sc) => sc.reference).join(", ")}
          />
          <WishRow
            label="Gatherings"
            value={[
              s.visitation ? "a visitation the evening before" : "",
              s.livestream ? "a livestream for family afar" : "",
              s.graveside ? "a graveside committal" : "",
            ]
              .filter(Boolean)
              .join("; ")}
          />
          <WishRow label="Special wishes" value={plan.program.specialNotes} />
        </dl>

        {verse ? (
          <figure className="mt-8 text-center">
            <blockquote className="font-display text-base italic leading-relaxed text-ink-soft">
              “{verse.text.length > 160 ? `${verse.text.slice(0, verse.text.indexOf(" ", 140))}…` : verse.text}”
            </blockquote>
            <figcaption className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
              {verse.reference}
            </figcaption>
          </figure>
        ) : null}

        <div className="mt-auto pt-10">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="h-10 border-b border-ink/50" />
              <p className="mt-1.5 text-xs text-ink-faint">Signature</p>
            </div>
            <div>
              <div className="h-10 border-b border-ink/50" />
              <p className="mt-1.5 text-xs text-ink-faint">Date</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-10">
            <div>
              <div className="h-10 border-b border-ink/50" />
              <p className="mt-1.5 text-xs text-ink-faint">Witness</p>
            </div>
            <div>
              <div className="h-10 border-b border-ink/50" />
              <p className="mt-1.5 text-xs text-ink-faint">Entrusted to (name & relationship)</p>
            </div>
          </div>
          <p className="mt-8 text-center text-[0.65rem] text-ink-faint">
            Prepared with Legacy · a statement of wishes, to be kept with your important documents
          </p>
        </div>
      </section>
    </div>
  );
}
