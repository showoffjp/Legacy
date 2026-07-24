import type { Metadata } from "next";
import { Card, Container } from "@/components/ui";
import { PrintButton } from "@/components/consulting/print-button";

export const metadata: Metadata = {
  title: "Free Church AI Policy Template",
  description:
    "A free, adaptable AI use policy for churches — approved uses, prohibited uses, data protection rules, disclosure standards, and governance. Written for independent and non-denominational congregations; useful to any church.",
};

/* A fill-in-the-blank line that prints cleanly. */
function Blank({ w = "12rem" }: { w?: string }) {
  return (
    <span
      aria-label="fill in"
      className="inline-block border-b border-ink/40 align-baseline"
      style={{ width: w }}
    >
      &nbsp;
    </span>
  );
}

function PolicySection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-display text-2xl font-semibold text-ink">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

const GUIDING_PRINCIPLES = [
  "People over programs. AI exists here to return hours to ministry — to people, prayer, and presence. It is a tool of the church, never a voice of the church.",
  "Truthfulness. We do not present machine-generated words as a person's own. Preaching, pastoral counsel, and personal correspondence are human work.",
  "Confidence is sacred. What our people entrust to us — prayer requests, counseling conversations, giving records, family struggles — is held as a sacred trust and treated with stricter care than any law requires.",
  "Transparency. We are honest with our congregation about how we use these tools, and we honor questions about them without defensiveness.",
  "Human accountability. A named person reviews and owns everything AI helps produce. 'The AI did it' is never an explanation.",
];

const APPROVED_USES = [
  "Drafting and editing routine communications: bulletins, newsletters, announcements, event copy, and social posts — always reviewed by a person before sending.",
  "Repurposing sermon and service media the church already owns: clips, captions, transcripts, and recaps.",
  "Translation and captioning of services and materials.",
  "Administrative support: meeting summaries, scheduling drafts, spreadsheet formulas, document formatting.",
  "Research and study support for teaching preparation, treated like any commentary or reference — weighed, verified, and never copied into the pulpit.",
  "Website visitor Q&A limited to public information: service times, location, ministries, and beliefs as published by the church.",
];

const APPROVAL_REQUIRED = [
  "Any new AI tool or subscription, before first use with church work.",
  "Any use involving photos, video, or recordings of congregants.",
  "Any AI-generated content on themes of doctrine or church position, before publication.",
  "Any automation that sends messages to congregants without a person pressing send.",
];

const PROHIBITED = [
  "Entering confidential congregant information — prayer requests, counseling or care notes, giving records, health or family circumstances, or any identifying information about minors — into any AI tool not on the approved register.",
  "Presenting AI-generated sermons, prayers, or personal messages as a person's own words.",
  "Using AI to profile, score, or surveil congregants, staff, or volunteers.",
  "Creating AI-generated images or voices of real people without their written consent.",
  "Using personal (non-church) AI accounts for church work involving any non-public information.",
];

const DATA_TIERS = [
  {
    tier: "Sacred",
    examples: "Prayer requests, counseling and care notes, confessions, giving records, anything identifying a minor",
    rule: "Never enters any AI tool. No exceptions.",
  },
  {
    tier: "Restricted",
    examples: "Member contact lists, internal meeting minutes, volunteer records, unpublished plans",
    rule: "Approved tools only, with training disabled and retention off, and only when the task requires it.",
  },
  {
    tier: "Public",
    examples: "Published sermons, service times, public event details, published statements of belief",
    rule: "May be used freely in approved tools.",
  },
];

export default function PolicyTemplatePage() {
  return (
    <Container className="py-14 sm:py-16">
      {/* Intro — screen only */}
      <div className="no-print mx-auto max-w-3xl text-center">
        <span className="ornament justify-center text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
          Free resource
        </span>
        <h1 className="mt-4 font-display text-4xl font-medium text-ink sm:text-5xl">
          A church AI policy, ready to adapt
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          Most churches now use AI; most still have no policy. This template closes that gap in
          an afternoon. It is written for independent and non-denominational congregations —
          which means it assumes <em>your</em> leaders decide — and it is yours to adapt freely,
          no signup required. Print it, bring it to your next elder or board meeting, and make
          it your own.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrintButton label="Print the template" />
          <a href="/consulting#contact" className="pill-link">
            Want it tailored to your church? Talk with us <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* The document */}
      <Card className="print-page mx-auto mt-12 max-w-3xl p-8 sm:p-12">
        <header className="border-b border-line pb-6 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
            Artificial Intelligence Use Policy
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
            <Blank w="16rem" />
          </h2>
          <p className="mt-1 text-sm text-ink-faint">(church name)</p>
          <p className="mt-4 text-sm text-ink-soft">
            Adopted by the elders / board on <Blank w="9rem" /> · Review due <Blank w="9rem" />
          </p>
        </header>

        <div className="pt-8">
          <PolicySection n="1" title="Purpose">
            <p>
              This policy governs how our staff and volunteers use artificial intelligence (AI)
              tools in the work of the church. Its aim is simple: to welcome what genuinely
              serves our ministry, to refuse what endangers the trust our congregation places in
              us, and to make the difference plain to every person who serves here.
            </p>
          </PolicySection>

          <PolicySection n="2" title="Guiding principles">
            <ol className="list-decimal space-y-2 pl-5">
              {GUIDING_PRINCIPLES.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </PolicySection>

          <PolicySection n="3" title="Approved uses">
            <p>Staff and trained volunteers may use approved AI tools for:</p>
            <ul className="list-disc space-y-2 pl-5">
              {APPROVED_USES.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection n="4" title="Uses requiring leadership approval">
            <p>
              The following require prior approval from <Blank w="14rem" /> (role or committee):
            </p>
            <ul className="list-disc space-y-2 pl-5">
              {APPROVAL_REQUIRED.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection n="5" title="Prohibited uses">
            <ul className="list-disc space-y-2 pl-5">
              {PROHIBITED.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection n="6" title="Data protection">
            <p>All church information falls into one of three tiers:</p>
            <div className="overflow-x-auto">
              <table className="mt-2 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-ink/20 text-left">
                    <th className="py-2 pr-3 font-semibold text-ink">Tier</th>
                    <th className="py-2 pr-3 font-semibold text-ink">Examples</th>
                    <th className="py-2 font-semibold text-ink">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_TIERS.map((t) => (
                    <tr key={t.tier} className="border-b border-line align-top">
                      <td className="py-2.5 pr-3 font-semibold text-ink">{t.tier}</td>
                      <td className="py-2.5 pr-3">{t.examples}</td>
                      <td className="py-2.5">{t.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Where an approved tool offers a business or team plan with model-training disabled
              and data retention minimized, that plan is the required configuration for church
              use.
            </p>
          </PolicySection>

          <PolicySection n="7" title="Disclosure">
            <p>
              When AI meaningfully shaped a published piece of work, we say so simply (for
              example, “drafted with AI assistance, reviewed by our team”). Preaching, pastoral
              counsel, and personal correspondence are never AI-authored, so no such disclosure
              will ever apply to them.
            </p>
          </PolicySection>

          <PolicySection n="8" title="Children and youth">
            <p>
              No identifying information about a minor — name, image, voice, or circumstance —
              is ever entered into an AI tool. AI-assisted content for youth and children's
              ministry is reviewed by the responsible ministry leader before use, without
              exception.
            </p>
          </PolicySection>

          <PolicySection n="9" title="Approved tools register">
            <p>
              The church maintains a current register of approved tools, the plan/configuration
              required, and the uses each is approved for. The register is kept by{" "}
              <Blank w="14rem" /> and reviewed each quarter.
            </p>
            <div className="overflow-x-auto">
              <table className="mt-2 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-ink/20 text-left">
                    <th className="py-2 pr-3 font-semibold text-ink">Tool</th>
                    <th className="py-2 pr-3 font-semibold text-ink">Plan / configuration</th>
                    <th className="py-2 font-semibold text-ink">Approved for</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((i) => (
                    <tr key={i} className="border-b border-line">
                      <td className="py-3 pr-3"><Blank w="7rem" /></td>
                      <td className="py-3 pr-3"><Blank w="9rem" /></td>
                      <td className="py-3"><Blank w="9rem" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PolicySection>

          <PolicySection n="10" title="Questions, concerns, and review">
            <p>
              Questions and concerns about AI use — from staff, volunteers, or members of the
              congregation — go to <Blank w="14rem" /> and are welcomed. This policy is reviewed
              at least annually, and sooner if the tools or the law change materially.
            </p>
          </PolicySection>

          <PolicySection n="11" title="Acknowledgment">
            <p>
              I have read this policy, I understand it, and I agree to follow it in my service
              at this church.
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="border-b border-ink/40 pb-6" />
                <p className="mt-1.5 text-xs text-ink-faint">Signature</p>
              </div>
              <div>
                <div className="border-b border-ink/40 pb-6" />
                <p className="mt-1.5 text-xs text-ink-faint">Name and role, date</p>
              </div>
            </div>
          </PolicySection>
        </div>

        <footer className="mt-10 border-t border-line pt-5 text-center text-xs text-ink-faint">
          Template provided by Steward AI — AI consulting for churches. Adapt freely for your
          congregation. This is a starting point for your leaders' wisdom, not legal advice.
        </footer>
      </Card>

      {/* Closing CTA — screen only */}
      <div className="no-print mx-auto mt-12 max-w-2xl text-center">
        <p className="text-base leading-relaxed text-ink-soft">
          A policy is the foundation — the assessment is the house. If you'd like this tailored
          to your church's actual tools, staff, and convictions, with a 12-month roadmap your
          board can adopt alongside it, that's exactly what our{" "}
          <a href="/consulting#services" className="font-medium text-gold-deep hover:underline">
            AI Readiness Assessment
          </a>{" "}
          delivers.
        </p>
      </div>
    </Container>
  );
}
