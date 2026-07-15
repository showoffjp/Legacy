"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Condolence } from "@/lib/types";
import { Button, Card, Field, SectionHeading, inputCls } from "@/components/ui";

/**
 * Gentle example condolences shown only while a memorial's guestbook is
 * otherwise empty. They live in state, not storage — the first real
 * signature is persisted alongside them.
 */
const SEED_CONDOLENCES: Record<string, Condolence[]> = {
  "eleanor-mae-thompson": [
    {
      id: "seed-eleanor-1",
      name: "Margaret Whitfield",
      message:
        "Miss Eleanor taught all three of my children Psalm 23 on that braided rug. We will say it together at supper tonight and think of her.",
      createdAt: "2026-06-03",
    },
    {
      id: "seed-eleanor-2",
      name: "The Caldwell Family",
      message:
        "Her pot pie arrived warm on our porch the week we lost our father, a verse taped to the foil. Now goodness and mercy have followed her all the way home.",
      createdAt: "2026-06-01",
    },
    {
      id: "seed-eleanor-3",
      name: "Pastor James Ellison",
      message:
        "Well done, good and faithful servant. First Baptist will not be the same without her humming in the garden beds out front.",
      createdAt: "2026-05-31",
    },
  ],
  "deacon-robert-earl-hayes": [
    {
      id: "seed-hayes-1",
      name: "Charlene Brooks",
      message:
        "I rode the #12 every Tuesday for eleven years. He knew my stop and my sorrows, and he always had a verse for both.",
      createdAt: "2026-06-18",
    },
    {
      id: "seed-hayes-2",
      name: "Marcus Green",
      message:
        "Coach Hayes taught us to swing straight and pray honest. Every one of us who came up through his dugout grew steadier for it.",
      createdAt: "2026-06-17",
    },
    {
      id: "seed-hayes-3",
      name: "Sister Odessa Grant",
      message:
        "Thirty-eight years of doors unlocked before sunrise. The sanctuary was warm because he got there first. Rest now, Deacon.",
      createdAt: "2026-06-16",
    },
  ],
  "maria-elena-vasquez": [
    {
      id: "seed-maria-1",
      name: "Father Miguel Torres",
      message:
        "María Elena's faith fed this parish as surely as her pan dulce did. Dios sabe — and now she knows fully, even as she is fully known.",
      createdAt: "2026-04-12",
    },
    {
      id: "seed-maria-2",
      name: "Ana Ruiz",
      message:
        "Christmas Eve will never smell the same. She fed my family the winter we had nothing — no questions, extra tamales. Que descanse en paz.",
      createdAt: "2026-04-11",
    },
    {
      id: "seed-maria-3",
      name: "The Guadalupana Society",
      message:
        "Fifteen years she led our novenas with her rosary in her apron pocket. We will offer this month's novena in her honor.",
      createdAt: "2026-04-10",
    },
  ],
};

function storageKeyFor(slug: string): string {
  return `legacy-guestbook-${slug}`;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `condolence-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isCondolence(value: unknown): value is Condolence {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.createdAt === "string"
  );
}

/** "2026-07-15" or a full ISO timestamp → "July 15, 2026". */
function formatSoftDate(iso: string): string {
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Guestbook({ slug }: { slug: string }) {
  const [entries, setEntries] = useState<Condolence[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    let stored: Condolence[] = [];
    try {
      const raw = window.localStorage.getItem(storageKeyFor(slug));
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stored = parsed.filter(isCondolence);
        }
      }
    } catch {
      // Unreadable storage — fall back to the seeded examples below.
    }
    setEntries(stored.length > 0 ? stored : (SEED_CONDOLENCES[slug] ?? []));
  }, [slug]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;

    const entry: Condolence = {
      id: makeId(),
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...entries];
    setEntries(next);
    try {
      window.localStorage.setItem(storageKeyFor(slug), JSON.stringify(next));
    } catch {
      // Storage unavailable — the signature still remains on this page.
    }
    setName("");
    setMessage("");
    setSigned(true);
  }

  const newestFirst = [...entries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <section>
      <SectionHeading
        eyebrow="Condolences"
        title="The Guestbook"
        lede="Leave a memory, a verse, or a word of comfort for the family. Your message is kept gently on this device."
      />

      <Card className="mx-auto mt-10 max-w-2xl p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Your name">
            <input
              type="text"
              className={inputCls}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </Field>
          <Field
            label="Your message"
            hint="A memory, a scripture, a prayer — whatever your heart offers."
          >
            <textarea
              className={`${inputCls} min-h-28 resize-y`}
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share a word of comfort for the family"
              required
            />
          </Field>
          <div className="flex flex-col items-start gap-3">
            <Button type="submit">Sign the guestbook</Button>
            {signed ? (
              <p role="status" className="text-sm text-gold-deep">
                Thank you. Your words have been added to the guestbook.
              </p>
            ) : null}
          </div>
        </form>
      </Card>

      <ul className="mx-auto mt-10 max-w-2xl space-y-4">
        {newestFirst.map((condolence) => (
          <li key={condolence.id}>
            <Card className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-display text-lg font-medium text-ink">{condolence.name}</p>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {formatSoftDate(condolence.createdAt)}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{condolence.message}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
