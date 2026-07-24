"use client";

import Link from "next/link";
import { useState } from "react";

// Anchor links scroll the landing page; the policy template is its own page.
const LINKS = [
  { href: "/consulting#why-now", label: "Why Now" },
  { href: "/consulting#pillars", label: "What We Cover" },
  { href: "/consulting#services", label: "Services" },
  { href: "/consulting#use-cases", label: "Use Cases" },
  { href: "/consulting#faq", label: "FAQ" },
  { href: "/consulting/ai-policy-template", label: "Free AI Policy" },
];

export function ConsultingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/consulting" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span aria-hidden className="translate-y-[1px] text-lg text-sage">✦</span>
          <span className="font-display text-2xl font-semibold tracking-wide text-ink">
            Steward&nbsp;AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-[0.83rem] font-medium text-ink-soft transition-colors hover:bg-white hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/consulting#contact"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[0.83rem] font-medium text-parchment transition-colors hover:bg-night sm:inline-flex"
          >
            Book a Discovery Call
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
          >
            <span aria-hidden className="text-lg leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line bg-parchment px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft hover:bg-white hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/consulting#contact"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-medium text-parchment"
              >
                Book a Discovery Call
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
