"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, formatLongDate, inputCls } from "@/components/ui";

/**
 * Opt-in to the grief year: gentle notes of comfort timed to the hardest
 * milestones — one month, three months, six months, the first Christmas,
 * and the first anniversary.
 */

interface ScheduledNote {
  sendOn: string;
  title: string;
}

export function GriefYearForm() {
  const [form, setForm] = useState({ yourName: "", email: "", lovedOneName: "", deathDate: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState<ScheduledNote[] | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/remembrances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as { events?: ScheduledNote[]; error?: string };
      if (!res.ok || !body.events) {
        setError(body.error || "Something went wrong — please try again in a moment.");
      } else {
        setSchedule(body.events);
      }
    } catch {
      setError("We could not reach the server — please try again.");
    } finally {
      setSending(false);
    }
  }

  if (schedule) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <span aria-hidden className="text-3xl">🕊️</span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
          We will walk this year with you
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          A first note is on its way to {form.email}. Then, when the hard days come, a verse and
          a word of comfort will find you:
        </p>
        {schedule.length > 0 ? (
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
            {schedule.map((note) => (
              <li
                key={note.title}
                className="flex items-baseline justify-between gap-4 rounded-xl border border-line bg-white/80 px-4 py-2.5 text-sm"
              >
                <span className="font-medium text-ink">{note.title}</span>
                <span className="text-xs text-ink-faint">{formatLongDate(note.sendOn)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-6 text-xs leading-relaxed text-ink-faint">
          Every note carries a way to end them, any time, no questions asked.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your first name">
          <input
            className={inputCls}
            required
            value={form.yourName}
            onChange={(e) => setForm((f) => ({ ...f, yourName: e.target.value }))}
            placeholder="Ruth"
            autoComplete="off"
          />
        </Field>
        <Field label="Your email">
          <input
            className={inputCls}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="ruth@example.com"
          />
        </Field>
        <Field label="Your loved one's name">
          <input
            className={inputCls}
            required
            value={form.lovedOneName}
            onChange={(e) => setForm((f) => ({ ...f, lovedOneName: e.target.value }))}
            placeholder="Eleanor"
            autoComplete="off"
          />
        </Field>
        <Field label="The day they passed">
          <input
            type="date"
            className={inputCls}
            required
            value={form.deathDate}
            onChange={(e) => setForm((f) => ({ ...f, deathDate: e.target.value }))}
          />
        </Field>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={sending}>
          {sending ? "One moment…" : "Walk the year with me"}
        </Button>
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          A handful of gentle emails across the year — never marketing, and ended with one click.
        </p>
      </div>
    </form>
  );
}
