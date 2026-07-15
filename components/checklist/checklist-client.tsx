"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_ITEMS } from "@/lib/data/vendors";
import type { ChecklistItem } from "@/lib/types";

const STORAGE_KEY = "legacy-checklist-v1";

type Phase = ChecklistItem["phase"];

const PHASES: { phase: Phase; heading: string; subtitle: string }[] = [
  {
    phase: "first-hours",
    heading: "The first hours",
    subtitle: "Breathe. Pray. These few things are all that must happen today.",
  },
  {
    phase: "first-days",
    heading: "The first days",
    subtitle: "Gathering what is needed and shaping the service — one gentle step at a time.",
  },
  {
    phase: "first-weeks",
    heading: "The first weeks",
    subtitle: "The practical matters. Take them slowly, and let others help you carry them.",
  },
  {
    phase: "first-months",
    heading: "The first months",
    subtitle: "There is no hurry now. Each of these can wait until you are ready.",
  },
];

export function ChecklistClient() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Read saved progress after mount so the page renders safely on the server.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id));
      setChecked(
        new Set(
          parsed.filter((id): id is string => typeof id === "string" && validIds.has(id))
        )
      );
    } catch {
      // If the saved list cannot be read, the checklist simply begins fresh.
    }
  }, []);

  const persist = (next: Set<string>) => {
    setChecked(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Storage may be unavailable; the list still works for this visit.
    }
  };

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    persist(next);
  };

  const reset = () => {
    if (window.confirm("Uncheck every item and begin the list again?")) {
      persist(new Set());
    }
  };

  const total = CHECKLIST_ITEMS.length;
  const done = checked.size;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Overall progress */}
      <div className="flex items-end justify-between gap-4">
        <p aria-live="polite" className="text-sm text-ink-soft">
          <span className="font-medium text-ink">{done}</span> of {total} steps complete
        </p>
        <button
          type="button"
          onClick={reset}
          disabled={done === 0}
          className="text-xs font-medium text-ink-faint underline underline-offset-4 transition-colors hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset list
        </button>
      </div>
      <div
        role="progressbar"
        aria-label="Overall checklist progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gold-pale/60"
      >
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Phases */}
      <div className="mt-14 space-y-14">
        {PHASES.map(({ phase, heading, subtitle }) => {
          const items = CHECKLIST_ITEMS.filter((item) => item.phase === phase);
          const phaseDone = items.filter((item) => checked.has(item.id)).length;
          return (
            <section key={phase} aria-labelledby={`phase-${phase}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={`phase-${phase}`}
                    className="font-display text-3xl font-medium text-ink"
                  >
                    {heading}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {subtitle}
                  </p>
                </div>
                <span className="mt-1 shrink-0 rounded-full bg-gold-pale/60 px-3 py-1 text-xs font-medium text-gold-deep">
                  {phaseDone} of {items.length}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {items.map((item) => {
                  const isDone = checked.has(item.id);
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-4 transition-colors ${
                          isDone
                            ? "border-line/70 bg-parchment-deep/50"
                            : "border-line bg-white/80 shadow-soft"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggle(item.id)}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded accent-gold"
                        />
                        <span>
                          <span
                            className={`block text-sm font-medium ${
                              isDone
                                ? "text-ink-faint line-through decoration-ink-faint/50"
                                : "text-ink"
                            }`}
                          >
                            {item.title}
                          </span>
                          <span
                            className={`mt-1 block text-sm leading-relaxed ${
                              isDone ? "text-ink-faint/80" : "text-ink-soft"
                            }`}
                          >
                            {item.detail}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
