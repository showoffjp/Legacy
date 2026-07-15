import Link from "next/link";
import { Container } from "@/components/ui";

const FOOTER_LINKS = [
  {
    heading: "Planning",
    links: [
      { href: "/plan", label: "Plan a Service" },
      { href: "/plan/program", label: "Service Program" },
      { href: "/pricing", label: "Packages & Pricing" },
      { href: "/checklist", label: "Bereavement Checklist" },
    ],
  },
  {
    heading: "Remembering",
    links: [
      { href: "/tribute", label: "Tribute Video Studio" },
      { href: "/memorials", label: "Memorial Pages" },
      { href: "/resources", label: "Grief Resources" },
    ],
  },
  {
    heading: "Trusted Partners",
    links: [
      { href: "/directory?tab=funeral-homes", label: "Funeral Homes" },
      { href: "/directory?tab=clergy", label: "Pastors & Priests" },
      { href: "/directory?tab=florists", label: "Florists" },
      { href: "/directory?tab=providers", label: "Caskets & More" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 bg-night text-parchment/80">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-baseline gap-2">
              <span aria-hidden className="text-gold">✝</span>
              <span className="font-display text-2xl font-semibold text-parchment">Legacy</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-parchment/60">
              A Christian companion for life&apos;s final farewell — carrying the details, so your
              family can carry each other.
            </p>
            <p className="mt-6 font-display text-lg italic text-gold-pale/90">
              “Blessed are they that mourn: for they shall be comforted.”
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-parchment/40">
              Matthew 5:4
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-parchment/70 transition-colors hover:text-parchment"
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
          <p>© {new Date().getFullYear()} Legacy. Walking with families in their hour of need.</p>
          <p>
            Available day and night — grief does not keep office hours, and neither do we.
          </p>
        </div>
      </Container>
    </footer>
  );
}
