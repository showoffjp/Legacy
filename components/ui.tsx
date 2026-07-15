import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Shared UI primitives — keep the whole site speaking one visual language. */

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

const buttonStyles = {
  primary:
    "bg-gold text-white hover:bg-gold-deep shadow-soft",
  dark: "bg-ink text-parchment hover:bg-night",
  outline:
    "border border-line bg-white/60 text-ink hover:border-gold hover:text-gold-deep",
  /** For buttons that sit on dark (night) backgrounds. */
  "outline-inverse":
    "border border-white/25 bg-transparent text-parchment hover:border-gold-pale hover:bg-white/10 hover:text-gold-pale",
  ghost: "text-gold-deep hover:bg-gold-pale/50",
} as const;

type ButtonVariant = keyof typeof buttonStyles;

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; className?: string }) {
  return (
    <Link {...props} className={`${buttonBase} ${buttonStyles[variant]} ${className}`} />
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button {...props} className={`${buttonBase} ${buttonStyles[variant]} ${className}`} />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      {eyebrow ? (
        <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-4xl font-medium text-ink sm:text-[2.75rem] sm:leading-[1.1]">
        {title}
      </h2>
      {lede ? <p className="max-w-2xl text-base leading-relaxed text-ink-soft">{lede}</p> : null}
    </div>
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white/80 shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  tone = "gold",
  children,
}: {
  tone?: "gold" | "sage" | "ink";
  children: ReactNode;
}) {
  const tones = {
    gold: "bg-gold-pale/70 text-gold-deep",
    sage: "bg-sage/15 text-sage",
    ink: "bg-ink/8 text-ink-soft",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function VerseBlock({
  text,
  reference,
  className = "",
}: {
  text: string;
  reference: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto max-w-3xl text-center ${className}`}>
      <blockquote className="font-display text-2xl font-medium italic leading-relaxed text-ink sm:text-3xl">
        “{text}”
      </blockquote>
      <figcaption className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-gold">
        {reference}
      </figcaption>
    </figure>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-pale";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLongDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
