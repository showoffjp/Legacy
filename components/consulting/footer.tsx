import Link from "next/link";
import { Container } from "@/components/ui";

const FOOTER_LINKS = [
  {
    heading: "The Practice",
    links: [
      { href: "/consulting#why-now", label: "Why Now" },
      { href: "/consulting#pillars", label: "The Four Pillars" },
      { href: "/consulting#services", label: "Services & Pricing" },
      { href: "/consulting#use-cases", label: "Use Cases" },
      { href: "/consulting#process", label: "How It Works" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/consulting/ai-policy-template", label: "Free AI Policy Template" },
      { href: "/consulting#faq", label: "Common Questions" },
      { href: "/consulting#contact", label: "Talk With Us" },
    ],
  },
  {
    heading: "Family of Work",
    links: [{ href: "/", label: "Legacy — Funeral Planning" }],
  },
];

export function ConsultingFooter() {
  return (
    <footer className="no-print mt-24 bg-night text-parchment/80">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-baseline gap-2">
              <span aria-hidden className="text-sage-pale">✦</span>
              <span className="font-display text-2xl font-semibold text-parchment">
                Steward&nbsp;AI
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-parchment/60">
              AI consulting for churches — wise policies, safe data, and hands-on training
              that serve ministry without ever replacing it.
            </p>
            <p className="mt-6 font-display text-lg italic text-gold-pale/90">
              “If any of you lacks wisdom, let him ask of God, that giveth to all men
              liberally.”
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-parchment/40">
              James 1:5
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sage-pale">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block text-sm text-parchment/70 transition-all duration-200 hover:translate-x-0.5 hover:text-gold-pale"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-parchment/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Steward AI. Technology in service of the Body.</p>
          <p>Proudly non-denominational — churches of every stream are welcome here.</p>
        </div>
      </Container>
    </footer>
  );
}
