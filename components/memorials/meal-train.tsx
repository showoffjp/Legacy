"use client";

import { useState, type FormEvent } from "react";
import { Card, Field, SectionHeading, inputCls } from "@/components/ui";

export interface MealOffer {
  id: string;
  name: string;
  dish: string;
  serves: number;
}

/**
 * The repast table — church family and friends promise dishes for the meal
 * after the service, so the family never has to think about food.
 */
export function MealTrain({
  slug,
  initialOffers,
}: {
  slug: string;
  initialOffers: MealOffer[];
}) {
  const [offers, setOffers] = useState(initialOffers);
  const [name, setName] = useState("");
  const [dish, setDish] = useState("");
  const [serves, setServes] = useState(8);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const totalServes = offers.reduce((sum, o) => sum + o.serves, 0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/memorials/${slug}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dish, serves, note }),
      });
      const body = (await res.json()) as {
        offer?: { id: string; name: string; dish: string; serves: number };
        error?: string;
      };
      if (!res.ok || !body.offer) {
        setError(body.error || "Something went wrong — please try again.");
      } else {
        setOffers((prev) => [...prev, body.offer!]);
        setDone(true);
      }
    } catch {
      setError("We could not reach the server — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-label="The repast table">
      <SectionHeading
        eyebrow="Bear ye one another's burdens"
        title="The Repast Table"
        lede="After the service, the family gathers to break bread. Promise a dish, and they will never have to think about the meal."
      />
      <Card className="mx-auto mt-10 max-w-2xl p-8">
        {offers.length > 0 ? (
          <>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
              Already promised — {offers.length} {offers.length === 1 ? "dish" : "dishes"}, serving
              about {totalServes}
            </h3>
            <ul className="mt-3 mb-6 space-y-1.5 border-b border-line pb-6">
              {offers.map((offer) => (
                <li key={offer.id} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-ink">{offer.dish}</span>
                  <span className="shrink-0 text-ink-faint">
                    {offer.name} · serves {offer.serves}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mb-6 border-b border-line pb-6 text-sm text-ink-faint">
            No dishes promised yet — be the first to set the table.
          </p>
        )}

        {done ? (
          <p role="status" className="text-sm leading-relaxed text-ink-soft">
            Thank you — the family will know the table is cared for. They say a casserole preaches
            its own small sermon.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <Field label="Your name">
                <input
                  className={inputCls}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Margaret Lewis"
                />
              </Field>
              <Field label="What you will bring">
                <input
                  className={inputCls}
                  required
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="Chicken pot pie"
                />
              </Field>
              <Field label="Serves">
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  max={100}
                  value={serves}
                  onChange={(e) => setServes(Number(e.target.value) || 8)}
                />
              </Field>
            </div>
            <Field label="A note (optional)">
              <input
                className={inputCls}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="I will bring it to the fellowship hall by noon."
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:opacity-60"
            >
              {saving ? "Promising…" : "Promise this dish"}
            </button>
          </form>
        )}
      </Card>
    </section>
  );
}
