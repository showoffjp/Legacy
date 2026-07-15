"use client";

import { useState, type FormEvent } from "react";
import { Field, inputCls } from "@/components/ui";

/** RSVP for a published memorial's service — helps the family plan the repast. */
export function RsvpForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState(true);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/memorials/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, guests, note }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error || "Something went wrong — please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("We could not reach the server — please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="text-sm leading-relaxed text-ink-soft">
        {attending
          ? "Thank you — the family will be comforted to know you will be there."
          : "Thank you for letting the family know. Your prayers travel farther than miles."}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
        <Field label="In your party">
          <input
            className={inputCls}
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
          />
        </Field>
      </div>
      <fieldset className="flex gap-4">
        <legend className="sr-only">Will you attend</legend>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="radio"
            name="attending"
            checked={attending}
            onChange={() => setAttending(true)}
            className="accent-gold"
          />
          We will attend
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="radio"
            name="attending"
            checked={!attending}
            onChange={() => setAttending(false)}
            className="accent-gold"
          />
          With you in spirit
        </label>
      </fieldset>
      <Field label="A note for the family (optional)">
        <input
          className={inputCls}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="We will bring a dish for the repast."
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
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-night disabled:opacity-60"
      >
        {saving ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
