"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavUser {
  name: string;
  role: "family" | "coordinator" | "partner";
}

const LINKS = [
  { href: "/plan", label: "Plan a Service" },
  { href: "/services", label: "Services" },
  { href: "/tribute", label: "Tribute Videos" },
  { href: "/memorials", label: "Memorials" },
  { href: "/directory", label: "Trusted Directory" },
  { href: "/resources", label: "Grief Resources" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((body: { user: NavUser | null } | null) => setUser(body?.user ?? null))
      .catch(() => {});
  }, [pathname]);

  const accountHref = user
    ? user.role === "coordinator"
      ? "/admin"
      : user.role === "partner"
        ? "/portal"
        : "/account/dashboard"
    : "/account";
  const accountLabel = user
    ? user.role === "coordinator"
      ? "Console"
      : user.role === "partner"
        ? "Portal"
        : "My Family"
    : "Sign in";

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span aria-hidden className="translate-y-[1px] text-lg text-gold">✝</span>
          <span className="font-display text-2xl font-semibold tracking-wide text-ink">
            Legacy
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-[0.83rem] font-medium transition-colors ${
                  active
                    ? "bg-gold-pale/60 text-gold-deep"
                    : "text-ink-soft hover:bg-white hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={accountHref}
            className="hidden rounded-full px-3.5 py-2 text-[0.83rem] font-medium text-ink-soft transition-colors hover:bg-white hover:text-ink md:inline-flex"
          >
            {accountLabel}
          </Link>
          <Link
            href="/plan"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[0.83rem] font-medium text-parchment transition-colors hover:bg-night sm:inline-flex"
          >
            Begin Planning
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
                href={accountHref}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft hover:bg-white hover:text-ink"
              >
                {accountLabel}
              </Link>
            </li>
            <li>
              <Link
                href="/plan"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-medium text-parchment"
              >
                Begin Planning
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
