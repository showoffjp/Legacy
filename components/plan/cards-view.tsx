"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";

/**
 * Acknowledgment cards — four to a letter sheet, matching the program's
 * design. Families send these to everyone who brought flowers, food, and
 * comfort. Print on ivory cardstock and cut along the guides.
 */

function AcknowledgmentCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center border border-dashed border-line/70 px-8 py-6 text-center">
      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-gold">
        With Grateful Hearts
      </p>
      <div aria-hidden className="my-2.5 flex items-center justify-center gap-2 text-gold">
        <span className="h-px w-10 bg-current opacity-60" />
        <span className="text-xs leading-none">✝</span>
        <span className="h-px w-10 bg-current opacity-60" />
      </div>
      <p className="text-[0.7rem] leading-relaxed text-ink-soft">{text}</p>
      <p className="mt-3 font-display text-sm italic text-ink">
        — The Family of {name || "your loved one"}
      </p>
    </div>
  );
}

export function CardsView() {
  const { plan, ready } = usePlan();

  if (!ready) return <div className="min-h-screen bg-parchment-deep/40" />;

  const name = plan.deceased.fullName;
  const text = plan.program.acknowledgment;

  if (!name) {
    return (
      <div className="bg-parchment py-24 text-center">
        <Container>
          <h1 className="font-display text-3xl font-medium text-ink">Acknowledgment Cards</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Begin with the planning companion — the acknowledgment written in the{" "}
            <em>People &amp; Program</em> step becomes a printable card here.
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
            <h1 className="font-display text-2xl font-semibold text-ink">Acknowledgment Cards</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Four cards per sheet, matching the program. Edit the wording in the{" "}
              <Link
                href="/plan"
                className="text-gold-deep underline-offset-2 hover:underline"
              >
                People &amp; Program step
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
          >
            🖨 Print the cards
          </button>
        </Container>
        <Container className="pb-4">
          <p className="text-xs text-ink-faint">
            Tip: print on ivory cardstock and cut along the dashed guides — send one to everyone
            who brought flowers, food, or comfort.
          </p>
        </Container>
      </div>

      <section className="print-page mx-auto mt-10 grid min-h-[10in] w-full max-w-[7.6in] grid-cols-2 grid-rows-2 border border-line bg-white shadow-lift">
        <AcknowledgmentCard name={name} text={text} />
        <AcknowledgmentCard name={name} text={text} />
        <AcknowledgmentCard name={name} text={text} />
        <AcknowledgmentCard name={name} text={text} />
      </section>
    </div>
  );
}
