import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Container, SectionHeading } from "@/components/ui";
import { SCRIPTURES } from "@/lib/data/scriptures";
import type { Scripture } from "@/lib/types";

export const metadata: Metadata = {
  title: "Grief Resources",
};

const COMFORT_IDS = [
  "psalm-23",
  "john-14",
  "john-11",
  "romans-8",
  "revelation-21",
  "thessalonians-4",
  "matthew-5",
  "psalm-46",
];

const comfortScriptures = COMFORT_IDS.map((id) =>
  SCRIPTURES.find((s) => s.id === id)
).filter((s): s is Scripture => s !== undefined);

const PRAYERS: { title: string; attribution: string; lines: string[] }[] = [
  {
    title: "A Benediction",
    attribution: "Psalm 121:8 (KJV)",
    lines: [
      "The LORD shall preserve thy going out and thy coming in",
      "from this time forth, and even for evermore.",
    ],
  },
  {
    title: "Eternal Rest",
    attribution: "Requiem Aeternam, traditional",
    lines: [
      "Eternal rest grant unto them, O Lord,",
      "and let perpetual light shine upon them.",
      "May the souls of the faithful departed,",
      "through the mercy of God, rest in peace. Amen.",
    ],
  },
  {
    title: "For a Grieving Family",
    attribution: "A prayer for the families we serve",
    lines: [
      "Lord of all comfort, draw near to this family in their sorrow.",
      "Hold what they cannot hold, and carry what they cannot carry.",
      "Give them rest in the evening and mercy in the morning,",
      "and the sure hope of Your presence, until every tear is wiped away. Amen.",
    ],
  },
];

const GRIEF_GUIDANCE: { title: string; body: string }[] = [
  {
    title: "Let the church carry you",
    body: "You were never meant to grieve alone. Accept the meals, the rides, and the prayers — receiving is its own act of faith, and it lets your congregation love you well.",
  },
  {
    title: "Grief has no schedule",
    body: "Sorrow does not follow a calendar, and there is no deadline for feeling whole. If tears come at strange hours or in unexpected seasons, that is not a setback; it is love finding its way.",
  },
  {
    title: "Speak their name",
    body: "Saying their name aloud keeps love in the present tense. Tell their stories at the table, laugh at what was funny, and invite others to do the same.",
  },
  {
    title: "Care for the body God gave you",
    body: "Grief is carried in the body as well as the soul. Eat something simple, walk in the daylight, and sleep when sleep will come — these small mercies are not indulgences.",
  },
  {
    title: "The first year of firsts",
    body: "The first birthday, the first Christmas, the empty chair at the table — plan for them rather than bracing against them. Light a candle, cook their favorite dish, sing their hymn together.",
  },
  {
    title: "When to seek more help",
    body: "Sorrow is heavy, but it should not become a room with no door. If despair does not lift, or thoughts of self-harm come, tell your pastor or your doctor — or call or text 988, the Suicide & Crisis Lifeline, at any hour.",
  },
];

const SUPPORTING_FAMILY: { title: string; body: string }[] = [
  {
    title: "What to say",
    body: "Simple and true is enough: I am so sorry. I loved her too. I am praying for you. Your presence says more than any perfect sentence ever could.",
  },
  {
    title: "What not to say",
    body: "Resist explanations for the loss — that God needed another angel, or that everything happens for a reason. Grief does not need an answer; it needs a companion.",
  },
  {
    title: "Practical help",
    body: "Instead of asking them to call if they need anything, offer something specific: dinner on Thursday, the children on Saturday, the lawn for the rest of the month.",
  },
  {
    title: "The long faithfulness",
    body: "Casseroles come in the first week; loneliness comes in the third month. Mark your calendar and keep showing up — a call, a card, a seat saved in the pew.",
  },
];

const NEXT_STEPS = [
  {
    href: "/checklist",
    title: "The bereavement checklist",
    body: "What to do in the first hours, days, weeks, and months — every step in order, so nothing is carried alone.",
    cta: "Open the checklist",
  },
  {
    href: "/memorials",
    title: "Memorial pages",
    body: "A lasting place to share their story, gather condolences, and remember together with family near and far.",
    cta: "Visit the memorials",
  },
];

export default function ResourcesPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Grief resources
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            You do not walk this valley alone
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            The Lord walks the valley with you, and so does His church. Gathered here are the
            scriptures, prayers, and gentle counsel that have steadied grieving families for
            generations — take what you need, and return as often as you wish.
          </p>
        </Container>
      </section>

      {/* Scriptures of Comfort */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="The Word"
            title="Scriptures of Comfort"
            lede="Passages the church has read at bedsides and gravesides for two thousand years, in the King James Version."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {comfortScriptures.map((scripture) => (
              <Card key={scripture.id} className="flex flex-col gap-4 p-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
                    {scripture.reference}
                  </h3>
                  <Badge>{scripture.theme}</Badge>
                </div>
                <blockquote className="font-display text-xl font-medium italic leading-relaxed text-ink">
                  “{scripture.text}”
                </blockquote>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Prayers for the Grieving */}
      <section className="bg-parchment-deep/50">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Prayer"
            title="Prayers for the Grieving"
            lede="When your own words will not come, borrow these. They have been prayed by mourners for centuries, and they still hold."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PRAYERS.map((prayer) => (
              <Card key={prayer.title} className="flex flex-col p-7">
                <h3 className="font-display text-2xl font-medium text-ink">{prayer.title}</h3>
                <blockquote className="mt-4 flex-1 font-display text-lg font-medium italic leading-relaxed text-ink-soft">
                  {prayer.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </blockquote>
                <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
                  {prayer.attribution}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Walking with Grief */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Gentle counsel"
            title="Walking with Grief"
            lede="There is no map through mourning, but there are trail markers left by those who have walked it before you."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GRIEF_GUIDANCE.map((item) => (
              <Card key={item.title} className="p-7">
                <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* For Those Supporting a Grieving Family */}
      <section className="bg-parchment-deep/50">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="For friends & neighbors"
            title="For Those Supporting a Grieving Family"
            lede="If someone you love is mourning, you do not need the right words. You need only to be near, and to stay."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORTING_FAMILY.map((item) => (
              <Card key={item.title} className="p-7">
                <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Christ-Centered Support Groups */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Community"
            title="Christ-Centered Support Groups"
            lede="Grief shared in the body of Christ grows lighter. There is a chair waiting for you."
          />
          <Card className="mx-auto mt-12 max-w-3xl p-8 text-center sm:p-10">
            <Badge>Christ-centered community</Badge>
            <h3 className="mt-4 font-display text-2xl font-medium text-ink">GriefShare</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              GriefShare hosts Christ-centered grief support groups in thousands of local
              churches, led by caring people who have known loss themselves. Meetings pair
              video teaching with small-group conversation, and you may join at any point in
              the cycle — come as you are.
            </p>
            <a
              href="https://www.griefshare.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-deep underline underline-offset-4 transition-colors hover:text-gold"
            >
              Find a group near you at griefshare.org <span aria-hidden>→</span>
            </a>
            <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink-soft">
              And ask your own pastor — many congregations gather grief and widows&apos;
              groups quietly, without ever advertising them. The church nearest to you may
              already be holding a place at the table.
            </p>
          </Card>
        </Container>
      </section>

      {/* Cross-links */}
      <section aria-labelledby="resources-next-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2
              id="resources-next-heading"
              className="text-center font-display text-3xl font-medium text-ink"
            >
              Where to turn next
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {NEXT_STEPS.map((step) => (
                <Link key={step.href} href={step.href} className="group block">
                  <Card className="h-full p-7 transition-shadow duration-200 group-hover:shadow-lift">
                    <h3 className="font-display text-2xl font-medium text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-deep">
                      {step.cta} <span aria-hidden>→</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
