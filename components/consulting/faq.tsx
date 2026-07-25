"use client";

import { useState, type CSSProperties } from "react";

/**
 * Accessible FAQ accordion. Answers stay in the HTML (visually collapsed),
 * panels glide open via a grid-rows transition, and the plus mark rotates
 * into a close. The first question starts open so the pattern is obvious.
 */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="stagger grid gap-4">
      {items.map((f, i) => {
        const open = openIndex === i;
        return (
          // The outer div carries the reveal stagger so the item's own
          // border-color transition isn't overridden by the stagger rule.
          <div key={f.q} style={{ "--stagger-delay": `${80 + i * 70}ms` } as CSSProperties}>
            <div
              className={`rounded-2xl border bg-white/80 shadow-soft transition-colors duration-300 ${
                open ? "faq-open border-heaven/50" : "border-line hover:border-heaven/35"
              }`}
            >
              <button
                type="button"
                id={`faq-button-${i}`}
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-5 p-6 text-left sm:px-7"
              >
                <span className="font-display text-xl font-semibold text-ink">{f.q}</span>
                <span
                  aria-hidden
                  className={`faq-toggle inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base leading-none ${
                    open
                      ? "border-heaven bg-heaven-pale/70 text-heaven-deep"
                      : "border-line text-ink-faint"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className="faq-panel"
              >
                <div>
                  <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft sm:px-7 sm:pb-7">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
