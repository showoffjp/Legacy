"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Anchor links scroll the landing page; the policy template is its own page.
const LINKS = [
  { href: "/consulting#why-now", id: "why-now", label: "Why Now" },
  { href: "/consulting#pillars", id: "pillars", label: "What We Cover" },
  { href: "/consulting#services", id: "services", label: "Services" },
  { href: "/consulting#use-cases", id: "use-cases", label: "Use Cases" },
  { href: "/consulting#faq", id: "faq", label: "FAQ" },
  { href: "/consulting/ai-policy-template", id: "", label: "Free AI Policy" },
];

export function ConsultingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const pathname = usePathname();

  // The header casts a slightly deeper shadow once the page moves under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: the section crossing the upper-middle of the viewport owns
  // the gold underline. Only the landing page has these sections.
  useEffect(() => {
    setActiveId("");
    const sections = LINKS.map((l) => l.id)
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  function isActive(link: (typeof LINKS)[number]): boolean {
    if (!link.id) return pathname === "/consulting/ai-policy-template";
    return activeId === link.id;
  }

  return (
    <header
      className={`no-print sticky top-0 z-50 border-b border-line backdrop-blur transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-soft" : "bg-white/60"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/consulting"
          className="group flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="translate-y-[1px] text-lg text-heaven transition-transform duration-300 group-hover:rotate-45"
          >
            ✦
          </span>
          <span className="font-display text-2xl font-semibold tracking-wide text-ink">
            Steward&nbsp;AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive(link)}
              className={`nav-link whitespace-nowrap rounded-full px-3.5 py-2 text-[0.83rem] font-medium transition-colors ${
                isActive(link) ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/consulting#contact"
            className="hidden rounded-full bg-heaven-deep px-5 py-2.5 text-[0.83rem] font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-heaven hover:shadow-[0_6px_18px_rgba(74,127,184,0.4)] active:translate-y-0 sm:inline-flex"
          >
            Book a Discovery Call
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-heaven/50 lg:hidden"
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="step-in border-t border-line bg-white/95 px-5 py-4 backdrop-blur lg:hidden">
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
                className="mt-2 block rounded-xl bg-heaven-deep px-4 py-3 text-center text-sm font-medium text-white"
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
