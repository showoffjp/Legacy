"use client";

import { useEffect, useState } from "react";
import { ESTATE_PHASES, ESTATE_TASKS } from "@/lib/data/estate";

const STORAGE_KEY = "legacy-estate-path-v1";

export function EstateChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Read saved progress after mount so the page renders safely on the server.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const validIds = new Set(ESTATE_TASKS.map((task) => task.id));
      setChecked(
        new Set(parsed.filter((id): id is string => typeof id === "string" && validIds.has(id))),
      );
    } catch {
      // If the saved list cannot be read, the path simply begins fresh.
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

  const total = ESTATE_TASKS.length;
  const done = checked.size;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <p aria-live="polite" className="text-sm text-ink-soft">
          <span className="font-medium text-ink">{done}</span> of {total} matters settled
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Uncheck every matter and begin the path again?")) {
              persist(new Set());
            }
          }}
          disabled={done === 0}
          className="text-xs font-medium text-ink-faint underline underline-offset-4 transition-colors hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset the path
        </button>
      </div>
      <div
        role="progressbar"
        aria-label="Estate path progress"
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

      <div className="mt-14 space-y-14">
        {ESTATE_PHASES.map(({ phase, heading, subtitle }) => {
          const items = ESTATE_TASKS.filter((task) => task.phase === phase);
          const phaseDone = items.filter((task) => checked.has(task.id)).length;
          return (
            <section key={phase} aria-labelledby={`estate-${phase}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    id={`estate-${phase}`}
                    className="font-display text-3xl font-medium text-ink"
                  >
                    {heading}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {subtitle}
                  </p>
                </div>
                <span className="mt-1 shrink-0 rounded-full bg-gold-pale/60 px-3 py-1 text-xs font-medium text-gold-deep">
                  {phaseDone} of {items.length}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {items.map((task) => {
                  const isDone = checked.has(task.id);
                  return (
                    <li key={task.id}>
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
                          onChange={() => toggle(task.id)}
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
                            {task.title}
                          </span>
                          <span
                            className={`mt-1 block text-sm leading-relaxed ${
                              isDone ? "text-ink-faint/80" : "text-ink-soft"
                            }`}
                          >
                            {task.detail}
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
