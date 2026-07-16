"use client";

import { useState, type FormEvent } from "react";
import { ButtonLink, Field, formatLongDate, formatUsd, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import { casketById } from "@/lib/data/caskets";
import { flowerById } from "@/lib/data/flowers";
import { addonById } from "@/lib/data/addons";
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
  const preNeed = plan.mode === "pre-need";
  const [reference, setReference] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [memorialSlug, setMemorialSlug] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  async function publishMemorial() {
    setPublishing(true);
    setPublishError("");
    try {
      const res = await fetch("/api/memorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const body = (await res.json()) as { slug?: string; error?: string };
      if (!res.ok || !body.slug) {
        setPublishError(body.error || "Something went wrong — please try again in a moment.");
      } else {
        setMemorialSlug(body.slug);
      }
    } catch {
      setPublishError("We could not reach the server — please try again.");
    } finally {
      setPublishing(false);
    }
  }

  async function submitCoordination(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/coordination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          contact: { name: contact.name, email: contact.email, phone: contact.phone },
          notes: contact.notes,
        }),
      });
      const body = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok || !body.reference) {
        setSendError(body.error || "Something went wrong — please try again in a moment.");
      } else {
        setReference(body.reference);
      }
    } catch {
      setSendError("We could not reach the server — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  const home = funeralHomeById(plan.funeralHomeId);
  const minister = clergyById(plan.clergyId);
  const casket = casketById(plan.casketId);
  const flowers = plan.flowerIds.map(flowerById).filter((f) => f !== undefined);
  const addons = plan.addonIds.map(addonById).filter((a) => a !== undefined);
  const hymns = plan.hymnIds.map(hymnById).filter((h) => h !== undefined);
  const scriptures = plan.scriptureIds.map(scriptureById).filter((s) => s !== undefined);

  const subtotal =
    (casket?.priceUsd ?? 0) +
    flowers.reduce((sum, f) => sum + f.priceUsd, 0) +
    addons.reduce((sum, a) => sum + a.priceFromUsd, 0);

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
            <Row label="Honors & add-ons" value={addons.map((a) => a.name).join(", ")} />
            <Row label="Hymns" value={hymns.map((h) => h.title).join(", ")} />
            <Row label="Readings" value={scriptures.map((s) => s.reference).join(", ")} />
            {subtotal > 0 ? (
              <Row label="Selections subtotal" value={`from ${formatUsd(subtotal)}`} />
            ) : null}
          </dl>
        </section>
      </div>

      <section className="rounded-2xl bg-night p-8 text-parchment">
        <h3 className="font-display text-2xl font-semibold">
          {preNeed ? "A gift of clarity for your family" : "Bring the farewell to life"}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment/70">
          {preNeed
            ? "These wishes flow into everything below — print the Letter of Wishes, sign it, and keep it with your important documents. When the day comes, the family opens this plan and every hard decision is already made with love."
            : "Your plan flows into everything below — the printed program for every guest, the tribute film for the service, and a lasting memorial page."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {preNeed ? (
            <ButtonLink href="/plan/wishes">📜 Print the Letter of Wishes</ButtonLink>
          ) : null}
          <ButtonLink href="/plan/program" variant={preNeed ? "outline-inverse" : "primary"}>
            📖 Preview & print the program
          </ButtonLink>
          <ButtonLink href="/plan/obituary" variant="outline-inverse">
            📰 The obituary
          </ButtonLink>
          <ButtonLink href="/plan/cards" variant="outline-inverse">
            💌 Acknowledgment cards
          </ButtonLink>
          <ButtonLink href="/tribute" variant="outline-inverse">
            🎞️ Create the tribute video
          </ButtonLink>
          {preNeed ? null : memorialSlug ? (
            <ButtonLink href={`/memorials/${memorialSlug}`} variant="outline-inverse">
              🌹 Visit their memorial page
            </ButtonLink>
          ) : (
            <button
              type="button"
              onClick={publishMemorial}
              disabled={publishing || !plan.deceased.fullName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-parchment transition-colors hover:border-gold-pale hover:bg-white/10 hover:text-gold-pale disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "🌹 Publish their memorial page"}
            </button>
          )}
        </div>
        {memorialSlug ? (
          <p className="mt-4 text-sm text-parchment/80">
            Their memorial is live — share it with family and friends so they can sign the
            guestbook and RSVP to the service.
          </p>
        ) : null}
        {publishError ? (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {publishError}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-white/80 p-8 shadow-soft">
        {reference ? (
          <div className="text-center">
            <span aria-hidden className="text-3xl">🕊️</span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
              Your plan is in our hands — reference {reference}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {home
                ? `${home.name} is being notified with every detail of this plan, `
                : "Our coordinators have every detail of this plan, "}
              {minister ? `${minister.name} has been asked to lead the service, ` : ""}
              and a confirmation is on its way to {contact.email}. A Legacy coordinator will call
              you shortly — nothing is final until your family says so.
            </p>
            <p className="mt-4 text-xs text-ink-faint">
              Keep your reference close: {reference}. Signed-in families can follow its progress on
              their dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={submitCoordination}>
            <h3 className="font-display text-2xl font-semibold text-ink">
              {preNeed
                ? "Place these wishes in our safekeeping"
                : "Ready to place this in trusted hands?"}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {preNeed
                ? "We keep the wishes on file with our coordinators — nothing is set in motion, and nothing is owed, until your family calls on us. Tell us how to reach you:"
                : `We send the complete plan to ${home ? home.name : "your chosen funeral home"} and ${minister ? minister.name : "your chosen minister"}, confirm every detail, and stay beside your family until the last guest goes home. Tell us how to reach you:`}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Your name">
                <input
                  className={inputCls}
                  required
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Ruth Callahan"
                />
              </Field>
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  placeholder="ruth@example.com"
                />
              </Field>
              <Field label="Phone (optional)">
                <input
                  className={inputCls}
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="(615) 555-0123"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Anything our coordinator should know? (optional)">
                <textarea
                  className={`${inputCls} min-h-20 resize-y`}
                  value={contact.notes}
                  onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                  placeholder="We are hoping to hold the service on Saturday so family can travel."
                />
              </Field>
            </div>
            {sendError ? (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {sendError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={sending}
              className="mt-5 rounded-full bg-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:opacity-60"
            >
              {sending ? "Sending your plan…" : "Send to our coordinator"}
            </button>
          </form>
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
