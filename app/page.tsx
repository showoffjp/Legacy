import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  SectionHeading,
  VerseBlock,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";

const PILLARS = [
  {
    href: "/plan",
    icon: "🕊️",
    title: "A Planning Companion",
    text: "Every decision, gathered in one gentle place — the service, the officiant, the casket, the flowers, the music. Like planning a wedding, but for a homegoing: one step at a time, nothing forgotten.",
    cta: "Begin planning",
  },
  {
    href: "/directory",
    icon: "⛪",
    title: "Trusted Hands Near You",
    text: "Vetted funeral homes, pastors and priests of every tradition, florists, and casket providers — matched to your city, ready to serve your family with dignity.",
    cta: "Open the directory",
  },
  {
    href: "/tribute",
    icon: "🎞️",
    title: "Tribute Videos",
    text: "Their photographs, their favorite songs, the verses they lived by — woven into a tribute film you can play at the service and keep forever.",
    cta: "Create a tribute",
  },
  {
    href: "/plan/program",
    icon: "📖",
    title: "Printed Programs",
    text: "A beautiful order of service, generated from your plan — hymns, scriptures, eulogists, and acknowledgments — ready to print for every guest.",
    cta: "See the program",
  },
  {
    href: "/memorials",
    icon: "🌹",
    title: "Memorials That Endure",
    text: "A lasting page that captures their essence — the story of their life, the little things everyone remembers, and a guestbook of condolences.",
    cta: "Visit memorials",
  },
  {
    href: "/checklist",
    icon: "🤍",
    title: "Carried Through Every Step",
    text: "From the first hours to the first year — a gentle checklist of everything that must be done, so nothing rests on a grieving heart alone.",
    cta: "Open the checklist",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Tell us about your loved one",
    text: "Their name, their faith, their story. Everything that follows is shaped around who they were.",
  },
  {
    n: "2",
    title: "We gather the right people",
    text: "A funeral home near you, a pastor or priest of their tradition, florists and providers — coordinated so you make choices, not phone calls.",
  },
  {
    n: "3",
    title: "Shape the service together",
    text: "Choose the casket or urn, the hymns, the scriptures, the readers and pallbearers. Watch the order of service take form as you go.",
  },
  {
    n: "4",
    title: "Remember, beautifully",
    text: "Printed programs, a tribute film with their songs and photographs, and a memorial page that keeps their light for generations.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — rays, drifting glows, and rising candle-light motes */}
      <section className="relative overflow-hidden bg-night text-parchment">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-rays" />
          <div className="hero-glow hero-glow-gold" />
          <div className="hero-glow hero-glow-sage" />
          <div className="hero-glow hero-glow-ember" />
          {[
            { left: "8%", d: "26s", delay: "0s", sway: "2.2rem", peak: 0.35 },
            { left: "18%", d: "31s", delay: "-9s", sway: "-1.6rem", peak: 0.28 },
            { left: "29%", d: "24s", delay: "-17s", sway: "1.2rem", peak: 0.4 },
            { left: "41%", d: "34s", delay: "-4s", sway: "-2.4rem", peak: 0.3 },
            { left: "53%", d: "27s", delay: "-21s", sway: "1.8rem", peak: 0.38 },
            { left: "64%", d: "30s", delay: "-12s", sway: "-1.2rem", peak: 0.32 },
            { left: "75%", d: "23s", delay: "-6s", sway: "2rem", peak: 0.42 },
            { left: "86%", d: "33s", delay: "-15s", sway: "-2rem", peak: 0.3 },
            { left: "94%", d: "28s", delay: "-24s", sway: "1.4rem", peak: 0.26 },
          ].map((m, i) => (
            <span
              key={i}
              className="hero-mote"
              style={
                {
                  left: m.left,
                  "--mote-duration": m.d,
                  "--mote-delay": m.delay,
                  "--mote-sway": m.sway,
                  "--mote-peak": m.peak,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-32">
          <span
            className="ornament ornament-draw hero-rise text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-pale"
            style={{ animationDelay: "0.05s" }}
          >
            A Christian companion in life&apos;s hardest hour
          </span>
          <h1
            className="hero-rise mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.08] sm:text-7xl"
            style={{ animationDelay: "0.18s" }}
          >
            When words fail and grief is heavy,
            <span className="gold-shimmer italic"> we carry the details.</span>
          </h1>
          <p
            className="hero-rise mt-7 max-w-2xl text-base leading-relaxed text-parchment/75 sm:text-lg"
            style={{ animationDelay: "0.34s" }}
          >
            Legacy walks with your family through everything a farewell asks — coordinating the
            funeral home, booking the priest or pastor, choosing the casket and the flowers,
            printing the programs, and weaving their photographs and favorite songs into a tribute
            that captures who they truly were.
          </p>
          <div
            className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.5s" }}
          >
            <ButtonLink href="/plan" className="px-8 py-3.5 text-base">
              Begin Planning a Service
            </ButtonLink>
            <ButtonLink
              href="/checklist"
              variant="outline-inverse"
              className="px-8 py-3.5 text-base"
            >
              Someone just passed — what do I do?
            </ButtonLink>
          </div>
          <p
            className="hero-rise mt-8 text-sm text-parchment/50"
            style={{ animationDelay: "0.66s" }}
          >
            Here day and night. Grief does not keep office hours, and neither do we.
          </p>
        </Container>
      </section>

      {/* Verse */}
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="py-16">
          <VerseBlock
            text="Blessed are they that mourn: for they shall be comforted."
            reference="Matthew 5:4"
          />
        </Container>
      </section>

      {/* Pillars */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Everything, gently handled"
            title="One place for every detail of a faithful farewell"
            lede="Families plan weddings for a year. A funeral gives you days. Legacy holds every thread — people, places, music, flowers, words — so your family can hold each other."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 110} className="h-full">
                <Card className="group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span aria-hidden className="soft-float inline-block w-fit text-3xl">
                    {p.icon}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                  <Link
                    href={p.href}
                    className="mt-5 text-sm font-medium text-gold-deep transition-colors group-hover:text-gold"
                  >
                    {p.cta}{" "}
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
          <Reveal className="mt-10 text-center" delay={150}>
            <ButtonLink href="/services" variant="outline">
              See every service we carry — from the first hour to the first year
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-parchment-deep/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Four gentle steps"
            lede="You will never face a blank page or a hard sell. Each step asks one thing at a time and remembers everything for you."
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 130} className="h-full">
                <Card className="h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-pale/70 font-display text-xl font-semibold text-gold-deep">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-12 text-center" delay={200}>
            <ButtonLink href="/plan">Take the first step</ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* For every tradition */}
      <section>
        <Container className="py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Every Christian tradition"
                title="Honoring the faith they lived"
                lede="A Catholic vigil and funeral Mass. A Baptist homegoing that raises the roof. A quiet Lutheran liturgy. An Orthodox Trisagion. Whatever your loved one's tradition, we match clergy who serve it faithfully and shape every detail to fit."
              />
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Catholic",
                  "Baptist",
                  "Methodist",
                  "Lutheran",
                  "Presbyterian",
                  "Pentecostal",
                  "Orthodox",
                  "Anglican / Episcopal",
                  "Non-denominational",
                ].map((d, i) => (
                  <Reveal as="li" key={d} delay={i * 60} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span aria-hidden className="text-gold">✝</span> {d}
                  </Reveal>
                ))}
              </ul>
              <Reveal className="mt-8" delay={300}>
                <ButtonLink href="/directory?tab=clergy" variant="outline">
                  Find a pastor or priest
                </ButtonLink>
              </Reveal>
            </div>
            <Reveal delay={150}>
            <Card className="p-8 sm:p-10">
              <Badge>From a family we served</Badge>
              <blockquote className="mt-5 font-display text-2xl font-medium italic leading-relaxed text-ink">
                “We were drowning, and suddenly there was a hand under every burden. The program was
                beautiful, the pastor felt like he had known Daddy all his life, and when his
                favorite hymn began over the photographs, the whole church wept and smiled at
                once.”
              </blockquote>
              <p className="mt-5 text-sm font-medium text-ink">— The family of Deacon R. E. Hayes</p>
              <Link
                href="/memorials/deacon-robert-earl-hayes"
                className="mt-1 inline-block text-sm text-gold-deep hover:text-gold"
              >
                Visit his memorial →
              </Link>
            </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-night text-parchment">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-glow hero-glow-gold" style={{ top: "auto", bottom: "-16rem" }} />
          <div className="hero-glow hero-glow-sage" style={{ bottom: "auto", top: "-10rem" }} />
        </div>
        <Container className="relative flex flex-col items-center py-20 text-center sm:py-24">
          <VerseBlock
            className="[&_blockquote]:text-parchment [&_figcaption]:text-gold-pale"
            text="Let not your heart be troubled: ye believe in God, believe also in me. In my Father's house are many mansions."
            reference="John 14:1–2"
          />
          <Reveal delay={140}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-parchment/70">
              Whether the need is today, or you are lovingly planning ahead — begin whenever you
              are ready. Your plan is saved as you go, and nothing is ever rushed.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/plan" className="px-8">
                Begin Planning
              </ButtonLink>
              <ButtonLink href="/pricing" variant="outline-inverse">
                See honest pricing
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
