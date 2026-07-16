"use client";

import { useState, type FormEvent } from "react";
import { Card, Field, SectionHeading, inputCls } from "@/components/ui";

/**
 * Memorial gifts — "in lieu of flowers." Guests record a gift given in the
 * loved one's memory so the family can acknowledge every kindness.
 */
export function MemorialGifts({
  slug,
  giftsNote,
  initialCount,
}: {
  slug: string;
  giftsNote: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/memorials/${slug}/gifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amountUsd: amount ? Number(amount) : 0,
          note,
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error || "Something went wrong — please try again.");
      } else {
        setCount((c) => c + 1);
        setDone(true);
      }
    } catch {
      setError("We could not reach the server — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-label="Memorial gifts">
      <SectionHeading
        eyebrow="In lieu of flowers"
        title="Memorial Gifts"
        lede={giftsNote}
      />
      <Card className="mx-auto mt-10 max-w-2xl p-8">
        <p className="text-sm text-ink-soft">
          {count === 0
            ? "Record a gift given in their memory, so the family can thank you."
            : count === 1
              ? "One gift has been given in their memory."
              : `${count} gifts have been given in their memory.`}{" "}
          Give directly to the ministry above, then let the family know here.
        </p>
        {done ? (
          <p role="status" className="mt-5 text-sm leading-relaxed text-ink-soft">
            Thank you — your kindness is recorded, and the family will be told.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label="Your name">
                <input
                  className={inputCls}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="The Lewis family"
                />
              </Field>
              <Field label="Amount (optional)">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  step={5}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50"
                />
              </Field>
            </div>
            <Field label="A note for the family (optional)">
              <input
                className={inputCls}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Given to the building fund, in her honor."
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
              className="btn-sheen rounded-full bg-gradient-to-b from-[#bd9a54] to-[#8f7440] px-6 py-2.5 text-sm font-medium text-white shadow-[0_2px_10px_rgba(163,131,63,0.35)] transition-all hover:-translate-y-px disabled:opacity-60"
            >
              {saving ? "Recording…" : "Record a gift in their memory"}
            </button>
          </form>
        )}
      </Card>
    </section>
  );
}
