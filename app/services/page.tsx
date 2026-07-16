import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Card,
  Container,
  Medallion,
  SectionHeading,
  VerseBlock,
  medallionTone,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Every Service",
  description:
    "Everything a death asks of a family, gathered under one roof — from the first hour through the first year, coordinated with reverence.",
};

const SERVICE_GROUPS: {
  eyebrow: string;
  title: string;
  lede: string;
  items: { icon: string; title: string; text: string; href: string; linkLabel: string }[];
}[] = [
  {
    eyebrow: "The first hours",
    title: "Immediate care",
    lede: "When the phone call comes, we answer — day or night — and the first burdens are lifted within the hour.",
    items: [
      {
        icon: "🕊️",
        title: "Bringing them into care",
        text: "A vetted funeral home near you receives your loved one gently, at any hour. You decide nothing else tonight.",
        href: "/directory",
        linkLabel: "Funeral homes near you",
      },
      {
        icon: "🤍",
        title: "The first-hours checklist",
        text: "Who to call, what can wait, and what cannot — a calm list for the hardest night, with a coordinator on the line.",
        href: "/checklist",
        linkLabel: "Open the checklist",
      },
      {
        icon: "⛪",
        title: "Your pastor at your side",
        text: "We reach your home church first — or match a minister of your loved one's tradition who will come and pray with you.",
        href: "/directory?tab=clergy",
        linkLabel: "Pastors & priests",
      },
    ],
  },
  {
    eyebrow: "The arrangements",
    title: "Planning the farewell",
    lede: "Every decision a service asks, taken one gentle step at a time — with honest prices beside each choice.",
    items: [
      {
        icon: "📖",
        title: "The planning companion",
        text: "Service type, venue, casket or urn, flowers, hymns, readings, eulogists, pallbearers — nothing forgotten, nothing rushed.",
        href: "/plan",
        linkLabel: "Begin planning",
      },
      {
        icon: "🌸",
        title: "Flowers & the sanctuary",
        text: "Casket sprays, standing crosses, and altar arrangements from trusted florists, delivered and placed before the family arrives.",
        href: "/plan",
        linkLabel: "Choose arrangements",
      },
      {
        icon: "⚰️",
        title: "Caskets, urns & vaults",
        text: "From humble pine to solid bronze — every price plain, the FTC Funeral Rule honored, and the simplest choice as honorable as the finest.",
        href: "/plan",
        linkLabel: "See the catalog",
      },
      {
        icon: "🪦",
        title: "Cemetery & resting place",
        text: "Burial plots, cremation gardens, columbarium niches, vaults, and monuments — coordinated with the cemetery's requirements.",
        href: "/directory?tab=providers",
        linkLabel: "Cemeteries & monuments",
      },
    ],
  },
  {
    eyebrow: "The service itself",
    title: "Honors & tributes",
    lede: "The details that tell their story — arranged with one click in the planner, delivered by trusted hands.",
    items: [
      {
        icon: "🎖️",
        title: "Military honors",
        text: "Flag presentation, honor guard, and Taps for those who served — at no cost to veteran families. We carry the paperwork.",
        href: "/plan",
        linkLabel: "Add to the plan",
      },
      {
        icon: "🎼",
        title: "Musicians & vocalists",
        text: "Church soloists, organists, choirs, and uniformed bagpipers — rehearsed with your minister and in step with the service.",
        href: "/plan",
        linkLabel: "Add music",
      },
      {
        icon: "🐎",
        title: "Procession & transport",
        text: "A horse-drawn caisson for a homegoing of great honor, and family limousines so no one who is grieving has to drive.",
        href: "/plan",
        linkLabel: "Arrange the procession",
      },
      {
        icon: "🎞️",
        title: "Tribute video",
        text: "Their photographs and favorite songs woven into a film for the service — created privately in your browser, yours forever.",
        href: "/tribute",
        linkLabel: "Create the tribute",
      },
      {
        icon: "📹",
        title: "Livestream for family afar",
        text: "A produced stream on a private family link with a keepsake recording — for everyone who could not travel.",
        href: "/plan",
        linkLabel: "Add livestream",
      },
      {
        icon: "🖨️",
        title: "Printed programs & cards",
        text: "The order of service, the obituary for the newspaper, and acknowledgment cards — generated from your plan, printed in a click.",
        href: "/plan/program",
        linkLabel: "See the printouts",
      },
    ],
  },
  {
    eyebrow: "Around the family",
    title: "Care for those who gather",
    lede: "A funeral gathers a scattered family. We carry the logistics of love.",
    items: [
      {
        icon: "🏨",
        title: "Travel & lodging blocks",
        text: "Discounted hotel blocks near the service, arranged overnight and shared with your announcement — wedding-planner care, for a harder day.",
        href: "/plan",
        linkLabel: "Arrange lodging",
      },
      {
        icon: "🍲",
        title: "The repast",
        text: "Fellowship-hall catering for twenty or five hundred — and a meal sign-up on the memorial page so church family can set the table.",
        href: "/memorials",
        linkLabel: "See the Repast Table",
      },
      {
        icon: "🌹",
        title: "Memorial pages & RSVP",
        text: "A published page of remembrance with service details, calendar invites, RSVP counts, and a guestbook of condolences.",
        href: "/memorials",
        linkLabel: "Visit memorials",
      },
    ],
  },
  {
    eyebrow: "After the service",
    title: "The long walk afterward",
    lede: "The cars leave, the casseroles end — and we are still beside you.",
    items: [
      {
        icon: "📋",
        title: "Certificates & paperwork",
        text: "Death certificates in the right quantity, Social Security and insurance notifications, account settlement — the paperwork carried for you.",
        href: "/plan",
        linkLabel: "Add paperwork help",
      },
      {
        icon: "⚖️",
        title: "Legal & estate guidance",
        text: "Vetted probate attorneys and estate advisors, with a first consultation at no charge.",
        href: "/directory?tab=providers",
        linkLabel: "Legal & estate partners",
      },
      {
        icon: "💛",
        title: "Keepsakes & remembrances",
        text: "Thumbprint pendants, memorial trees planted in their name, and keepsake jewelry that stays close for a lifetime.",
        href: "/plan",
        linkLabel: "Choose keepsakes",
      },
      {
        icon: "🕯️",
        title: "Grief counseling & support",
        text: "Licensed Christian counselors — including children's specialists — and GriefShare groups in thousands of churches.",
        href: "/resources",
        linkLabel: "Grief resources",
      },
      {
        icon: "📜",
        title: "Planning ahead",
        text: "Record your own wishes in peace with a signed Letter of Wishes — the greatest kindness a family can be left.",
        href: "/plan/wishes",
        linkLabel: "My Wishes",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night text-parchment">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-glow hero-glow-gold" />
          <div className="hero-glow hero-glow-sage" />
        </div>
        <Container className="relative flex flex-col items-center py-20 text-center sm:py-24">
          <span className="ornament ornament-draw hero-rise text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-pale">
            Every service, one hand to hold
          </span>
          <h1
            className="hero-rise mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.1] sm:text-6xl"
            style={{ animationDelay: "0.15s" }}
          >
            Everything a farewell asks,
            <span className="gold-shimmer italic"> under one roof.</span>
          </h1>
          <p
            className="hero-rise mt-6 max-w-2xl text-base leading-relaxed text-parchment/75"
            style={{ animationDelay: "0.3s" }}
          >
            From the first phone call to the first anniversary — five seasons of care, every
            provider vetted, every price honest, every detail carried so your family can carry
            each other.
          </p>
        </Container>
      </section>

      {SERVICE_GROUPS.map((group, gi) => (
        <section key={group.title} className={gi % 2 === 1 ? "bg-parchment-deep/60" : ""}>
          <Container className="py-16 sm:py-20">
            <SectionHeading eyebrow={group.eyebrow} title={group.title} lede={group.lede} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal key={item.title} delay={(i % 3) * 110} className="h-full">
                  <Card
                    className={`card-accent card-accent-${medallionTone(gi + i)} group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
                  >
                    <Medallion icon={item.icon} tone={medallionTone(gi + i)} />
                    <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                      {item.text}
                    </p>
                    <Link href={item.href} className="pill-link mt-4">
                      {item.linkLabel}
                      <span
                        aria-hidden
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="border-t border-line bg-parchment-deep/60">
        <Container className="py-16 text-center sm:py-20">
          <VerseBlock
            text="Bear ye one another's burdens, and so fulfil the law of Christ."
            reference="Galatians 6:2"
          />
          <Reveal delay={160}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/plan">Begin planning a service</ButtonLink>
              <ButtonLink href="/pricing" variant="outline">
                See honest pricing
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
