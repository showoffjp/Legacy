import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  Medallion,
  SectionHeading,
  VerseBlock,
} from "@/components/ui";
import { FaqAccordion } from "@/components/consulting/faq";
import { Icon, type IconName } from "@/components/consulting/icons";
import { InquiryForm } from "@/components/consulting/inquiry-form";
import { StatRing } from "@/components/consulting/stat-ring";

export const metadata: Metadata = {
  title: "AI Consulting for Churches",
};

/* ————— Content ————— */

const STATS: Array<{ value: number; suffix: string; label: string; icon: IconName }> = [
  {
    value: 87,
    suffix: "%",
    icon: "users",
    label: "of pastors already use AI in some part of ministry",
  },
  {
    value: 73,
    suffix: "%",
    icon: "file-text",
    label: "of churches still have no AI policy at all",
  },
  {
    value: 71,
    suffix: "%",
    icon: "shield",
    label: "of pastors say they feel cautious about AI",
  },
  {
    value: 87,
    suffix: "%",
    icon: "graduation",
    label: "of church leaders are willing to invest in AI training",
  },
];

/* Deterministic candle-mote choreography for the hero (no randomness so
   server and client render identically). */
const MOTES: Array<{
  left: string;
  delay: string;
  duration: string;
  sway: string;
  peak: number;
}> = [
  { left: "8%", delay: "0s", duration: "26s", sway: "1.4rem", peak: 0.4 },
  { left: "22%", delay: "6s", duration: "21s", sway: "-1rem", peak: 0.55 },
  { left: "37%", delay: "11s", duration: "29s", sway: "1.8rem", peak: 0.35 },
  { left: "52%", delay: "3s", duration: "23s", sway: "-1.4rem", peak: 0.5 },
  { left: "68%", delay: "9s", duration: "27s", sway: "1.1rem", peak: 0.45 },
  { left: "81%", delay: "1.5s", duration: "22s", sway: "-1.7rem", peak: 0.55 },
  { left: "93%", delay: "7s", duration: "25s", sway: "1.3rem", peak: 0.4 },
];

function staggerDelay(index: number, base = 140, step = 70): CSSProperties {
  return { "--stagger-delay": `${base + index * step}ms` } as CSSProperties;
}

const WHY_NOW = [
  {
    icon: "🌊",
    title: "Adoption is ahead of wisdom",
    body: "Your staff and volunteers are already pasting things into chatbots — sermon notes, emails, sometimes prayer requests. The question isn't whether your church will use AI. It's whether it will use AI on purpose, with guardrails, or by accident, without them.",
  },
  {
    icon: "🤝",
    title: "Trust is the real question",
    body: "A congregation extends its pastor a rare kind of trust. One careless AI misstep — a sermon that wasn't yours, a confidence that leaked into a consumer chatbot — can spend years of it. Good practice protects the trust that ministry runs on.",
  },
  {
    icon: "🧭",
    title: "Independent churches set their own course",
    body: "Denominations are issuing AI statements — but non-denominational and independent churches don't inherit a policy from a headquarters. You set your own. That freedom is a gift, and it deserves a thoughtful map. We help you draw it.",
  },
];

const PILLARS = [
  {
    icon: "📜",
    title: "Wisdom & Policy",
    body: "A written, board-ready AI use policy in plain language: what staff may do, what needs approval, what is off-limits, and how you'll talk about it with the congregation. Grounded in your convictions, not ours.",
    accent: "card-accent-gold",
    tone: "gold" as const,
  },
  {
    icon: "🛡️",
    title: "Data Reverence",
    body: "Prayer requests, counseling notes, giving records, and anything touching minors are among the most sacred data any organization holds. We lock down what may never enter an AI tool, and configure no-training, zero-retention modes for what may.",
    accent: "card-accent-heaven",
    tone: "heaven" as const,
  },
  {
    icon: "⚙️",
    title: "Implementation",
    body: "We deploy the two or three uses that actually give your team hours back — sermon-to-social clips, communications, scheduling, translation and captioning — and wire them into the tools your church already runs.",
    accent: "card-accent-rose",
    tone: "rose" as const,
  },
  {
    icon: "🌱",
    title: "Training & Governance",
    body: "Role-by-role staff training, an in-house AI champion so you own this after we leave, quarterly tool reviews, and ministry-shaped metrics your board can actually read: hours returned to people-facing work.",
    accent: "card-accent-sage",
    tone: "sage" as const,
  },
];

const SERVICES = [
  {
    name: "Staff Workshop",
    icon: "users" as IconName,
    price: "$950",
    priceNote: "flat, up to 25 staff & volunteers",
    tagline: "AI in Ministry: what's safe, what's not",
    body: "Ninety minutes, on-site or virtual. Where AI genuinely helps, where it quietly endangers trust, and the five rules every church team should adopt this week. Leaves every attendee with a one-page quick reference.",
    cta: "Book a workshop",
    featured: false,
  },
  {
    name: "AI Readiness Assessment & Policy",
    icon: "clipboard-check" as IconName,
    price: "$2,500–$6,000",
    priceNote: "fixed price by congregation size",
    tagline: "The board-ready foundation",
    body: "We audit the tools your team already uses, interview staff, map your data risks, and deliver a written AI use policy your board can adopt — plus a 12-month roadmap ranked by value and safety. Most churches start here.",
    cta: "Start an assessment",
    featured: true,
  },
  {
    name: "Implementation Sprint",
    icon: "zap" as IconName,
    price: "$5,000–$15,000",
    priceNote: "30–60 days, fixed scope",
    tagline: "From roadmap to running",
    body: "We stand up two or three use cases end-to-end — configured safely, connected to your existing systems, documented, and taught to the people who will run them. You end the sprint with working tools, not a slide deck.",
    cta: "Plan a sprint",
    featured: false,
  },
  {
    name: "Fractional AI Director",
    icon: "compass" as IconName,
    price: "from $750/mo",
    priceNote: "cancel anytime",
    tagline: "A steady hand, ongoing",
    body: "Monthly office hours for your staff, tool and policy updates as the landscape shifts, new-hire onboarding, and a yearly refresh of your roadmap. The AI leadership of a large church, at a share of the cost.",
    cta: "Ask about retainers",
    featured: false,
  },
];

const USE_CASES_START = [
  { icon: "🎬", text: "Sunday's sermon becomes the week's social clips, podcast, and recap" },
  { icon: "✉️", text: "Bulletins, newsletters, and announcement emails drafted in your voice" },
  { icon: "🗓️", text: "Volunteer scheduling and meeting notes that write themselves" },
  { icon: "🌍", text: "Live translation and captioning for every neighbor you serve" },
  { icon: "💬", text: "A website assistant that answers visitor questions at 11pm" },
  { icon: "🧹", text: "Member-database cleanup and giving-data hygiene" },
];

const USE_CASES_CARE = [
  { icon: "📖", text: "Sermon research and study support — always disclosed, never ghostwritten" },
  { icon: "🕊️", text: "Pastoral follow-up prompts — AI remembers the birthday; the pastor makes the call" },
  { icon: "📊", text: "Attendance and giving forecasting — insight for planning, never surveillance" },
];

const NEVERS = [
  "AI never writes a sermon that is presented as the pastor's own.",
  "AI never replaces a pastor, an elder, or a human presence in care.",
  "A congregant's confidence never enters a consumer chatbot. Ever.",
];

const PROCESS = [
  {
    step: "1",
    icon: "message-circle" as IconName,
    title: "Listen",
    body: "A free discovery call. Where is AI already showing up on your team? What worries you? What would an hour returned to ministry be worth?",
  },
  {
    step: "2",
    icon: "search" as IconName,
    title: "Assess",
    body: "The readiness assessment: tools audited, staff interviewed, risks mapped, policy written, roadmap ranked. Board-ready in about three weeks.",
  },
  {
    step: "3",
    icon: "sliders" as IconName,
    title: "Implement",
    body: "A fixed-scope sprint stands up the highest-value uses safely, and your team is trained hands-on as we build.",
  },
  {
    step: "4",
    icon: "heart" as IconName,
    title: "Walk alongside",
    body: "Ongoing office hours and reviews if you want them — or a clean handoff to your in-house champion. Either way, you own it.",
  },
];

const FAQS = [
  {
    q: "Will you make our sermons AI-written?",
    a: "No — the opposite. We help you draw that line clearly and put it in writing. AI can serve study, research, and the hundred administrative tasks around preaching. The word delivered to your people should be your pastor's own, and your policy will say so.",
  },
  {
    q: "Is our congregation's data safe?",
    a: "That is pillar one of every engagement. We classify what may never enter an AI tool (prayer requests, counseling notes, anything about minors), configure business-grade tools with no-training and zero-retention modes for everything else, and write it all into policy your team is trained on.",
  },
  {
    q: "We're a small church. Can we afford this?",
    a: "Start free: download the AI policy template and adapt it with your leaders. The $950 workshop is priced for churches under 200. Assessments are priced by congregation size on purpose — a church of 120 pays much less than a multisite.",
  },
  {
    q: "Our board is skeptical. Honestly, so are we.",
    a: "Healthy skepticism is the right starting posture — 71% of pastors share it. We're happy to present to your board or elders directly, and we'll tell you plainly where AI is not worth it for your church. Caution is not a sales obstacle here; it's the point.",
  },
  {
    q: "Which traditions do you serve?",
    a: "We are predominantly non-denominational and most of our work is with independent, community, and Bible churches — but every congregation is welcome. Your convictions set the guardrails; we bring the map.",
  },
  {
    q: "Do we need to be technical?",
    a: "Not at all. Everything is taught in plain language, documented for the team you actually have, and built on tools a volunteer can run. If you can use email, you can run everything we set up.",
  },
];

/* ————— Page ————— */

export default function ConsultingPage() {
  return (
    <>
      {/* Hero */}
      <section className="heaven-night-shift relative overflow-hidden text-parchment">
        <div aria-hidden className="hero-rays" />
        <div aria-hidden className="hero-glow hero-glow-heaven" />
        <div aria-hidden className="hero-glow hero-glow-gold opacity-50" />
        <div aria-hidden className="hero-glow hero-glow-ember" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {MOTES.map((m, i) => (
            <span
              key={m.left}
              className={`hero-mote ${i % 2 === 0 ? "hero-mote-heaven" : ""}`}
              style={
                {
                  left: m.left,
                  "--mote-delay": m.delay,
                  "--mote-duration": m.duration,
                  "--mote-sway": m.sway,
                  "--mote-peak": m.peak,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <Container className="relative py-24 sm:py-32">
          <div className="hero-rise mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="ornament ornament-draw text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-pale">
              AI consulting for churches · non-denominational
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.08] sm:text-6xl">
              Your team is already using AI.
              <br />
              <span className="gold-shimmer">Now use it with wisdom.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parchment/75">
              Steward AI helps churches adopt artificial intelligence the way everything in a
              church should be adopted — thoughtfully, safely, and in service of people. Clear
              policies. Sacred data kept sacred. Hours returned to ministry.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contact" variant="primary">
                Book a free discovery call
              </ButtonLink>
              <ButtonLink href="/consulting/ai-policy-template" variant="outline-inverse">
                Get the free AI policy template
              </ButtonLink>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-parchment/40">
              Fixed prices · Plain language · Every tradition welcome
            </p>
          </div>
        </Container>
        <a
          href="#why-now"
          aria-label="Scroll to learn more"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-parchment/50 opacity-60 transition-opacity duration-300 hover:opacity-100 sm:block"
        >
          <span className="scroll-cue-bob block">
            <svg
              aria-hidden
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </a>
      </section>

      {/* Stats band */}
      <section className="border-b border-line bg-heaven-pale/35">
        <Container className="py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <div className="relative inline-block">
                  <StatRing value={s.value} suffix={s.suffix} duration={1500 + i * 130} />
                  <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full border border-heaven-pale bg-white text-heaven-deep shadow-soft">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                </div>
                <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-soft">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <p className="text-xs text-ink-faint">
              Barna Group &amp; Gloo, Faith &amp; AI research (U.S. Protestant pastors, 2025–2026);
              church AI adoption reporting, 2026.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Why now */}
      <section id="why-now" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Why now"
            title="The tools arrived before the wisdom did"
            lede="AI swept into church offices the same way it swept into every office — quietly, one helpful shortcut at a time. Churches don't need a hype merchant. They need a steward."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY_NOW.map((item, i) => (
              <Reveal key={item.title} delay={i * 110}>
                <Card className="card-accent card-accent-heaven card-lift h-full p-7">
                  <Medallion
                    icon={item.icon}
                    tone={i === 0 ? "heaven" : i === 1 ? "gold" : "sage"}
                    className={`soft-float ${i === 1 ? "[animation-delay:1.1s]" : i === 2 ? "[animation-delay:2.2s]" : ""}`}
                  />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section id="pillars" className="scroll-mt-20 bg-white/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="What we cover"
            title="Four pillars, one promise"
            lede="Technology in service of ministry — never the other way around. Every engagement, from a single workshop to a year-long retainer, is built on the same four pillars."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <Card className={`card-accent ${p.accent} card-lift h-full p-7`}>
                  <div className="flex items-start gap-4">
                    <Medallion
                      icon={p.icon}
                      tone={p.tone}
                      className={`soft-float ${i === 1 ? "[animation-delay:0.9s]" : i === 2 ? "[animation-delay:1.8s]" : i === 3 ? "[animation-delay:2.7s]" : ""}`}
                    />
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-ink">{p.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Services & pricing"
            title="Fixed prices a board can say yes to"
            lede="No open-ended hourly billing, no scope surprises. Every engagement is a fixed price quoted by congregation size, with nonprofit-friendly terms."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.name} delay={i * 90}>
                <Card
                  className={`card-accent card-accent-gold card-lift flex h-full flex-col p-7 ${
                    s.featured ? "border-gold/50 bg-gold-pale/25 shadow-lift ring-1 ring-gold/20" : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="icon-chip inline-flex h-11 w-11 items-center justify-center rounded-xl bg-heaven-pale/60 text-heaven-deep">
                      <Icon name={s.icon} />
                    </span>
                    {s.featured ? <Badge tone="gold">Most churches start here</Badge> : null}
                  </div>
                  <h3 className="font-display text-[1.55rem] font-semibold leading-tight text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-heaven">
                    {s.tagline}
                  </p>
                  <p className="mt-4 font-display text-3xl font-semibold text-gold-deep">
                    {s.price}
                  </p>
                  <p className="text-xs text-ink-faint">{s.priceNote}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  <a href="#contact" className="pill-link mt-6">
                    {s.cta} <span aria-hidden>→</span>
                  </a>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-20 bg-white/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Use cases"
            title="Where AI serves a church well — and where it must not"
            lede="Pastors overwhelmingly use AI behind the scenes: as a thought partner and a time-saver, not a stand-in for presence. Our catalog honors that line."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal>
              <Card className="card-accent card-accent-heaven card-lift h-full p-7">
                <Badge tone="heaven">Start here</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  High value, low controversy
                </h3>
                <ul className="stagger mt-5 space-y-3.5">
                  {USE_CASES_START.map((u, i) => (
                    <li
                      key={u.text}
                      style={staggerDelay(i)}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                    >
                      <span aria-hidden className="mt-px">{u.icon}</span>
                      <span>{u.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={110}>
              <Card className="card-accent card-accent-gold card-lift h-full p-7">
                <Badge tone="gold">Handled with care</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  Powerful, with guardrails
                </h3>
                <ul className="stagger mt-5 space-y-3.5">
                  {USE_CASES_CARE.map((u, i) => (
                    <li
                      key={u.text}
                      style={staggerDelay(i)}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                    >
                      <span aria-hidden className="mt-px">{u.icon}</span>
                      <span>{u.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-xl bg-gold-pale/40 p-4 text-xs leading-relaxed text-ink-soft">
                  These come with written guardrails, disclosure standards, and human sign-off —
                  configured during the assessment, never ad-libbed.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={220}>
              <Card className="card-accent card-accent-rose card-lift h-full bg-heaven-night p-7 text-parchment">
                <Badge tone="night">Never</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-parchment">
                  Lines we help you hold
                </h3>
                <ul className="stagger mt-5 space-y-4">
                  {NEVERS.map((n, i) => (
                    <li
                      key={n}
                      style={staggerDelay(i)}
                      className="flex items-start gap-3 text-sm leading-relaxed text-parchment/80"
                    >
                      <span aria-hidden className="mt-px text-rose-pale">✕</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-parchment/50">
                  If a vendor ever tells you AI can shepherd your people, walk away. We'll help
                  you write these lines into policy so they outlast any one staff member.
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, no pressure"
            lede="Every engagement starts with listening and ends with your team owning the result."
          />
          <div className="relative mt-12">
            {/* A line draws across the four steps on large screens,
                visible in the gaps between the cards. */}
            <Reveal className="pointer-events-none absolute inset-x-10 top-[3.15rem] hidden lg:block">
              <div className="process-line h-px origin-left bg-gradient-to-r from-heaven/50 via-gold/40 to-heaven/50" />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <Card className="card-lift h-full p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-heaven/40 bg-heaven-pale/50 font-display text-xl font-semibold text-heaven-deep">
                        {p.step}
                      </span>
                      <Icon name={p.icon} className="icon-chip h-5 w-5 text-heaven/70" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Non-denominational + verse */}
      <section className="relative overflow-hidden bg-heaven-pale/35">
        <Icon
          name="sparkle"
          className="soft-float absolute left-[9%] top-14 hidden h-8 w-8 text-heaven/30 md:block"
        />
        <Icon
          name="sparkle"
          className="soft-float absolute bottom-16 right-[11%] hidden h-6 w-6 text-gold/35 [animation-delay:1.6s] md:block"
        />
        <Container className="py-20 sm:py-24">
          <VerseBlock
            text="If any of you lacks wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."
            reference="James 1:5"
          />
          <Reveal className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-base leading-relaxed text-ink-soft">
              Steward AI is <strong className="text-ink">predominantly non-denominational</strong>.
              Most of the churches we serve are independent, community, and Bible churches — the
              congregations that answer to their own elders and set their own course. We don't
              arrive with a denominational rulebook, because you don't have one. We arrive with
              questions, listen to your convictions, and help you write wisdom your own leaders
              can stand behind. And if your church is Baptist, Methodist, Presbyterian, Anglican,
              or anything else — you are just as welcome here.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              align="left"
              eyebrow="Who we are"
              title="Built by people who build faith tech"
              lede=""
            />
            <Reveal delay={120}>
              <div className="space-y-4 text-base leading-relaxed text-ink-soft">
                <p>
                  Steward AI comes from the makers of{" "}
                  <a href="/" className="font-medium text-gold-deep hover:underline">
                    Legacy
                  </a>
                  , a Christian funeral-planning and memorial platform. We have spent years
                  building software for the most tender moments a church family ever walks
                  through — which taught us something most technology companies never learn:
                </p>
                <p className="border-l-2 border-heaven/60 pl-4 font-display text-xl italic text-ink">
                  Reverence is a feature. Restraint is a skill.
                </p>
                <p>
                  We know what it means to keep a family's words on their own device, to honor a
                  confidence, to let technology carry the details so people can carry each other.
                  That is exactly the posture your church's AI adoption deserves — and it's the
                  one we bring to every engagement.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Common questions"
            title="Asked by nearly every church we meet"
          />
          <Reveal className="mx-auto mt-12 max-w-4xl" delay={80}>
            <FaqAccordion items={FAQS} />
          </Reveal>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Talk with us"
              title="Start with a conversation"
              lede="A free 30-minute discovery call. No slideware, no pressure — just an honest look at where AI could serve your ministry and where it shouldn't go near it."
            />
            <Reveal delay={120} className="mt-10">
              <Card className="p-7 sm:p-9">
                <InquiryForm />
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
