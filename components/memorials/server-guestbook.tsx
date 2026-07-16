"use client";

import { useState, type FormEvent } from "react";
import { Card, Field, SectionHeading, inputCls } from "@/components/ui";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

function entryDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Guestbook for published memorials — condolences live on the server. */
export function ServerGuestbook({
  slug,
  initialEntries,
}: {
  slug: string;
  initialEntries: GuestbookEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [signed, setSigned] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/memorials/${slug}/condolences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const body = (await res.json()) as {
        condolence?: { id: string; name: string; message: string; created_at: string };
        error?: string;
      };
      if (!res.ok || !body.condolence) {
        setError(body.error || "Something went wrong — please try again in a moment.");
      } else {
        setEntries((prev) => [
          {
            id: body.condolence!.id,
            name: body.condolence!.name,
            message: body.condolence!.message,
            createdAt: body.condolence!.created_at,
          },
          ...prev,
        ]);
        setName("");
        setMessage("");
        setSigned(true);
      }
    } catch {
      setError("We could not reach the server — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-label="Guestbook">
      <SectionHeading
        eyebrow="Words of comfort"
        title="The Guestbook"
        lede="Share a memory, a prayer, or a few words of comfort for the family."
      />
      <Card className="mx-auto mt-10 max-w-2xl p-8">
        {signed ? (
          <p role="status" className="text-center text-sm leading-relaxed text-ink-soft">
            Thank you — your words are now part of their remembrance.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your name">
              <input
                className={inputCls}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Margaret Lewis"
              />
            </Field>
            <Field label="Your message">
              <textarea
                className={`${inputCls} min-h-28 resize-y`}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="She taught our daughter's Sunday school class — we will never forget her kindness."
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
              {saving ? "Signing…" : "Sign the guestbook"}
            </button>
          </form>
        )}
      </Card>

      {entries.length > 0 ? (
        <ul className="mx-auto mt-8 max-w-2xl space-y-4">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Card className="p-6">
                <p className="text-sm leading-relaxed text-ink-soft">{entry.message}</p>
                <p className="mt-3 text-xs text-ink-faint">
                  — <span className="font-medium text-ink">{entry.name}</span>
                  {entryDate(entry.createdAt) ? ` · ${entryDate(entry.createdAt)}` : ""}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-center text-sm text-ink-faint">
          Be the first to leave a few words of comfort.
        </p>
      )}
    </section>
  );
}
