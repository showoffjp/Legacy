"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container, formatLongDate } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import { scriptureById } from "@/lib/data/scriptures";

const KIND_LABELS: Record<string, string> = {
  "traditional-burial": "Funeral services",
  "cremation-with-service": "A service of worship",
  "memorial-service": "A memorial service",
  "graveside-service": "A graveside service",
};

function computeAge(birth: string, death: string): number | null {
  if (!birth || !death) return null;
  const b = new Date(`${birth}T00:00:00`);
  const d = new Date(`${death}T00:00:00`);
  if (Number.isNaN(b.getTime()) || Number.isNaN(d.getTime())) return null;
  let age = d.getFullYear() - b.getFullYear();
  const beforeBirthday =
    d.getMonth() < b.getMonth() ||
    (d.getMonth() === b.getMonth() && d.getDate() < b.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
}

export function ObituaryView() {
  const { plan, ready } = usePlan();
  const [copied, setCopied] = useState(false);

  const paragraphs = useMemo(() => {
    const d = plan.deceased;
    const s = plan.service;
    const home = funeralHomeById(plan.funeralHomeId);
    const minister = clergyById(plan.clergyId);
    const verse = scriptureById(d.favoriteVerseId);
    const out: string[] = [];

    const place = [s.location.city, s.location.state].filter(Boolean).join(", ");
    const age = computeAge(d.birthDate, d.deathDate);
    const opening = [
      d.fullName,
      d.nickname ? `“${d.nickname}”` : "",
      place ? `of ${place},` : "",
      "went home to be with the Lord",
      d.deathDate ? `on ${formatLongDate(d.deathDate)}` : "",
      age !== null ? `at the age of ${age}` : "",
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/ ,/g, ",");
    out.push(`${opening}.`);

    out.push(...d.lifeStory.split("\n").map((l) => l.trim()).filter(Boolean));

    if (d.survivedBy) {
      out.push(`${d.fullName || "They"} is survived by ${d.survivedBy.replace(/\.$/, "")}.`);
    }

    const serviceBits: string[] = [];
    if (s.kind) {
      serviceBits.push(
        [
          KIND_LABELS[s.kind] ?? "A service",
          "will be held",
          s.date ? `on ${formatLongDate(s.date)}` : "",
          s.time ? `at ${s.time}` : "",
          s.venueName ? `at ${s.venueName}` : "",
          place ? `in ${place}` : "",
        ]
          .filter(Boolean)
          .join(" ") + (minister ? `, officiated by ${minister.name}.` : "."),
      );
      if (s.visitation) {
        serviceBits.push("The family will receive friends the evening before.");
      }
      if (s.livestream) {
        serviceBits.push(
          s.livestreamUrl
            ? `For those unable to travel, the service will be streamed at ${s.livestreamUrl}.`
            : "For those unable to travel, the service will be streamed; the family will share the link.",
        );
      }
      if (home) serviceBits.push(`Services entrusted to ${home.name}.`);
    }
    if (serviceBits.length) out.push(serviceBits.join(" "));

    if (verse) {
      const text =
        verse.text.length > 140
          ? `${verse.text.slice(0, verse.text.indexOf(" ", 120))}…`
          : verse.text;
      out.push(`“${text}” — ${verse.reference}`);
    }
    return out;
  }, [plan]);

  const newspaperText = useMemo(() => {
    const d = plan.deceased;
    const place = [plan.service.location.city, plan.service.location.state]
      .filter(Boolean)
      .join(", ");
    const surname = d.fullName.trim().split(/\s+/).pop()?.toUpperCase() ?? "";
    const header = [surname ? `${surname},` : "", d.fullName, place ? `— ${place}.` : ""]
      .filter(Boolean)
      .join(" ");
    return [header, ...paragraphs].join("\n\n");
  }, [plan, paragraphs]);

  async function copyNewspaper() {
    try {
      await navigator.clipboard.writeText(newspaperText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — the details block below allows manual selection.
    }
  }

  if (!ready) return <div className="min-h-screen bg-parchment-deep/40" />;

  if (!plan.deceased.fullName) {
    return (
      <div className="bg-parchment py-24 text-center">
        <Container>
          <h1 className="font-display text-3xl font-medium text-ink">The Obituary</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Begin with the planning companion — once you share your loved one&apos;s name and
            story, their obituary writes itself here.
          </p>
          <Link
            href="/plan"
            className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white shadow-soft hover:bg-gold-deep"
          >
            Open the planning companion
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-parchment-deep/40 pb-20">
      <div className="no-print border-b border-line bg-parchment">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">The Obituary</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Generated from your plan.{" "}
              <Link href="/plan" className="text-gold-deep underline-offset-2 hover:underline">
                Return to the planner
              </Link>{" "}
              to change anything — the obituary updates itself.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyNewspaper}
              aria-live="polite"
              className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-deep"
            >
              {copied ? "✓ Copied" : "Copy for the newspaper"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
            >
              🖨 Print
            </button>
          </div>
        </Container>
      </div>

      <section className="print-page mx-auto mt-10 flex min-h-[10in] w-full max-w-[7.6in] flex-col border border-line bg-white px-14 py-16 shadow-lift">
        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold">
          In Loving Memory
        </p>
        <div aria-hidden className="my-4 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-16 bg-current opacity-60" />
          <span className="text-lg leading-none">✝</span>
          <span className="h-px w-16 bg-current opacity-60" />
        </div>
        <h2 className="text-center font-display text-4xl font-medium text-ink">
          {plan.deceased.fullName}
        </h2>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-soft">
          {paragraphs.map((para, i) => (
            <p key={i} className={i === paragraphs.length - 1 && para.startsWith("“") ? "text-center font-display text-base italic" : ""}>
              {para}
            </p>
          ))}
        </div>
      </section>

      <div className="no-print mx-auto mt-10 w-full max-w-[7.6in]">
        <details className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
          <summary className="cursor-pointer text-sm font-medium text-ink">
            View the newspaper text
          </summary>
          <pre className="mt-4 whitespace-pre-wrap font-body text-sm leading-relaxed text-ink-soft">
            {newspaperText}
          </pre>
        </details>
      </div>
    </div>
  );
}
