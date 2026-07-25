import type { Metadata } from "next";
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
import { InquiryForm } from "@/components/consulting/inquiry-form";

export const metadata: Metadata = {
  title: "AI Consulting for Churches",
};

/* ————— Content ————— */

const STATS = [
  {
    figure: "87%",
    label: "of pastors already use AI in some part of ministry",
  },
  {
    figure: "73%",
    label: "of churches still have no AI policy at all",
  },
  {
    figure: "71%",
    label: "of pastors say they feel cautious about AI",
  },
  {
    figure: "87%",
    label: "of church leaders are willing to invest in AI training",
  },
];

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
  },
  {
    icon: "🛡️",
    title: "Data Reverence",
    body: "Prayer requests, counseling notes, giving records, and anything touching minors are among the most sacred data any organization holds. We lock down what may never enter an AI tool, and configure no-training, zero-retention modes for what may.",
    accent: "card-accent-sage",
  },
  {
    icon: "⚙️",
    title: "Implementation",
    body: "We deploy the two or three uses that actually give your team hours back — sermon-to-social clips, communications, scheduling, translation and captioning — and wire them into the tools your church already runs.",
    accent: "card-accent-rose",
  },
  {
    icon: "🌱",
    title: "Training & Governance",
    body: "Role-by-role staff training, an in-house AI champion so you own this after we leave, quarterly tool reviews, and ministry-shaped metrics your board can actually read: hours returned to people-facing work.",
    accent: "card-accent-gold",
  },
];

const SERVICES = [
  {
    name: "Staff Workshop",
    price: "$950",
    priceNote: "flat, up to 25 staff & volunteers",
    tagline: "AI in Ministry: what's safe, what's not",
    body: "Ninety minutes, on-site or virtual. Where AI genuinely helps, where it quietly endangers trust, and the five rules every church team should adopt this week. Leaves every attendee with a one-page quick reference.",
    cta: "Book a workshop",
    featured: false,
  },
  {
    name: "AI Readiness Assessment & Policy",
    price: "$2,500–$6,000",
    priceNote: "fixed price by congregation size",
    tagline: "The board-ready foundation",
    body: "We audit the tools your team already uses, interview staff, map your data risks, and deliver a written AI use policy your board can adopt — plus a 12-month roadmap ranked by value and safety. Most churches start here.",
    cta: "Start an assessment",
    featured: true,
  },
  {
    name: "Implementation Sprint",
    price: "$5,000–$15,000",
    priceNote: "30–60 days, fixed scope",
    tagline: "From roadmap to running",
    body: "We stand up two or three use cases end-to-end — configured safely, connected to your existing systems, documented, and taught to the people who will run them. You end the sprint with working tools, not a slide deck.",
    cta: "Plan a sprint",
    featured: false,
  },
  {
    name: "Fractional AI Director",
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
    title: "Listen",
    body: "A free discovery call. Where is AI already showing up on your team? What worries you? What would an hour returned to ministry be worth?",
  },
  {
    step: "2",
    title: "Assess",
    body: "The readiness assessment: tools audited, staff interviewed, risks mapped, policy written, roadmap ranked. Board-ready in about three weeks.",
  },
  {
    step: "3",
    title: "Implement",
    body: "A fixed-scope sprint stands up the highest-value uses safely, and your team is trained hands-on as we build.",
  },
  {
    step: "4",
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
      <section className="relative overflow-hidden bg-night text-parchment">
        <div aria-hidden className="hero-rays" />
        <div aria-hidden className="hero-glow hero-glow-gold opacity-60" />
        <div aria-hidden className="hero-glow hero-glow-sage" />
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
      </section>

      {/* Stats band */}
      <section className="border-b border-line bg-parchment-deep">
        <Container className="py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <p className="font-display text-5xl font-semibold text-gold-deep">{s.figure}</p>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-ink-soft">
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
                <Card className="card-accent card-accent-sage h-full p-7">
                  <Medallion icon={item.icon} tone={i === 0 ? "sage" : i === 1 ? "gold" : "rose"} />
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
                <Card className={`card-accent ${p.accent} h-full p-7`}>
                  <div className="flex items-start gap-4">
                    <Medallion icon={p.icon} tone={i % 2 === 0 ? "gold" : "sage"} />
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
                  className={`card-accent card-accent-gold flex h-full flex-col p-7 ${
                    s.featured ? "border-gold/50 bg-gold-pale/25 shadow-lift" : ""
                  }`}
                >
                  {s.featured ? (
                    <div className="mb-3">
                      <Badge tone="gold">Most churches start here</Badge>
                    </div>
                  ) : null}
                  <h3 className="font-display text-[1.55rem] font-semibold leading-tight text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-sage">
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
              <Card className="card-accent card-accent-sage h-full p-7">
                <Badge tone="sage">Start here</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  High value, low controversy
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {USE_CASES_START.map((u) => (
                    <li key={u.text} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                      <span aria-hidden className="mt-px">{u.icon}</span>
                      <span>{u.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={110}>
              <Card className="card-accent card-accent-gold h-full p-7">
                <Badge tone="gold">Handled with care</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  Powerful, with guardrails
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {USE_CASES_CARE.map((u) => (
                    <li key={u.text} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
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
              <Card className="card-accent card-accent-rose h-full bg-night p-7 text-parchment">
                <Badge tone="night">Never</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-parchment">
                  Lines we help you hold
                </h3>
                <ul className="mt-5 space-y-4">
                  {NEVERS.map((n) => (
                    <li key={n} className="flex items-start gap-3 text-sm leading-relaxed text-parchment/80">
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <Card className="h-full p-7">
                  <span className="font-display text-4xl font-semibold text-gold/50">{p.step}</span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Non-denominational + verse */}
      <section className="bg-parchment-deep">
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
                <p className="font-display text-xl italic text-ink">
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
          <div className="mx-auto mt-12 grid max-w-4xl gap-4">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <Card className="p-6 sm:p-7">
                  <h3 className="font-display text-xl font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </Card>
              </Reveal>
            ))}
          </div>
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
