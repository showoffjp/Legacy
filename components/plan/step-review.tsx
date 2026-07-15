"use client";

import { useState } from "react";
import { ButtonLink, formatLongDate, formatUsd } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import { casketById } from "@/lib/data/caskets";
import { flowerById } from "@/lib/data/flowers";
import { hymnById } from "@/lib/data/hymns";
import { scriptureById } from "@/lib/data/scriptures";

const KIND_LABELS: Record<string, string> = {
  "traditional-burial": "Traditional burial",
  "cremation-with-service": "Cremation with service",
  "memorial-service": "Memorial service",
  "graveside-service": "Graveside service",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line/70 py-3 last:border-0">
      <dt className="shrink-0 text-sm text-ink-faint">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}

export function StepReview() {
  const { plan, reset } = usePlan();
  const [sent, setSent] = useState(false);

  const home = funeralHomeById(plan.funeralHomeId);
  const minister = clergyById(plan.clergyId);
  const casket = casketById(plan.casketId);
  const flowers = plan.flowerIds.map(flowerById).filter((f) => f !== undefined);
  const hymns = plan.hymnIds.map(hymnById).filter((h) => h !== undefined);
  const scriptures = plan.scriptureIds.map(scriptureById).filter((s) => s !== undefined);

  const subtotal =
    (casket?.priceUsd ?? 0) + flowers.reduce((sum, f) => sum + f.priceUsd, 0);

  const dates = [plan.deceased.birthDate, plan.deceased.deathDate]
    .filter(Boolean)
    .map(formatLongDate)
    .join(" — ");

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold text-ink">The service</h3>
          <dl className="mt-3">
            <Row label="In loving memory of" value={plan.deceased.fullName} />
            <Row label="Dates" value={dates} />
            <Row label="Tradition" value={plan.deceased.denomination} />
            <Row label="Kind of service" value={KIND_LABELS[plan.service.kind] ?? ""} />
            <Row
              label="When"
              value={[formatLongDate(plan.service.date), plan.service.time]
                .filter(Boolean)
                .join(" at ")}
            />
            <Row
              label="Where"
              value={[
                plan.service.venueName,
                [plan.service.location.city, plan.service.location.state]
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            />
            <Row
              label="Gatherings"
              value={[
                plan.service.visitation ? "Visitation" : "",
                plan.service.livestream ? "Livestream" : "",
                plan.service.graveside ? "Graveside committal" : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold text-ink">The people & provisions</h3>
          <dl className="mt-3">
            <Row label="Funeral home" value={home ? `${home.name}, ${home.location.city}` : ""} />
            <Row
              label="Officiant"
              value={minister ? `${minister.name} (${minister.denomination})` : ""}
            />
            <Row
              label={casket?.kind === "urn" ? "Urn" : "Casket"}
              value={casket ? `${casket.name} · ${formatUsd(casket.priceUsd)}` : ""}
            />
            <Row
              label="Flowers"
              value={flowers.map((f) => f.name).join(", ")}
            />
            <Row label="Hymns" value={hymns.map((h) => h.title).join(", ")} />
            <Row label="Readings" value={scriptures.map((s) => s.reference).join(", ")} />
            {subtotal > 0 ? (
              <Row label="Selections subtotal" value={formatUsd(subtotal)} />
            ) : null}
          </dl>
        </section>
      </div>

      <section className="rounded-2xl bg-night p-8 text-parchment">
        <h3 className="font-display text-2xl font-semibold">Bring the farewell to life</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment/70">
          Your plan flows into everything below — the printed program for every guest, the tribute
          film for the service, and a lasting memorial page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/plan/program">📖 Preview & print the program</ButtonLink>
          <ButtonLink href="/tribute" variant="outline-inverse">
            🎞️ Create the tribute video
          </ButtonLink>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white/80 p-8 shadow-soft">
        {sent ? (
          <div className="text-center">
            <span aria-hidden className="text-3xl">🕊️</span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
              Your plan is on its way
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {home
                ? `${home.name} will receive every detail of this plan, and a Legacy coordinator will call you shortly to walk through the next steps together.`
                : "A Legacy coordinator will call you shortly to walk through the next steps together."}{" "}
              Nothing is final until your family says so.
            </p>
            <p className="mt-4 text-xs text-ink-faint">
              (Demonstration only — no information was sent from this preview build.)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Ready to place this in trusted hands?
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                We send the complete plan to {home ? home.name : "your chosen funeral home"} and
                {minister ? ` ${minister.name}` : " your chosen minister"}, confirm every detail,
                and stay beside your family until the last guest goes home.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSent(true)}
              className="shrink-0 rounded-full bg-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
            >
              Send to our coordinator
            </button>
          </div>
        )}
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this entire plan and start over? This cannot be undone.")) {
              reset();
              window.scrollTo({ top: 0 });
            }
          }}
          className="text-xs text-ink-faint underline-offset-2 hover:underline"
        >
          Clear the plan and begin again
        </button>
      </div>
    </div>
  );
}
