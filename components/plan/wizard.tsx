"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import type { ServicePlan } from "@/lib/types";
import { StepLovedOne } from "@/components/plan/step-loved-one";
import { StepService } from "@/components/plan/step-service";
import { StepFuneralHome, StepClergy } from "@/components/plan/step-people";
import { StepCasket, StepFlowers } from "@/components/plan/step-selections";
import { StepWorship } from "@/components/plan/step-worship";
import { StepProgram } from "@/components/plan/step-program";
import { StepReview } from "@/components/plan/step-review";

export interface StepDef {
  id: string;
  label: string;
  heading: string;
  lede: string;
  isComplete: (plan: ServicePlan) => boolean;
  render: () => ReactNode;
}

const STEPS: StepDef[] = [
  {
    id: "loved-one",
    label: "Your Loved One",
    heading: "Tell us about your loved one",
    lede: "Everything that follows — the service, the program, the tribute — is shaped around who they were. Share as much or as little as you are able today.",
    isComplete: (p) => p.deceased.fullName.trim().length > 0,
    render: () => <StepLovedOne />,
  },
  {
    id: "service",
    label: "The Service",
    heading: "The shape of the farewell",
    lede: "There is no wrong choice here — only what fits your family, your faith, and their wishes.",
    isComplete: (p) => p.service.kind !== "" && p.service.location.state !== "",
    render: () => <StepService />,
  },
  {
    id: "funeral-home",
    label: "Funeral Home",
    heading: "A funeral home to receive them",
    lede: "These partners are vetted for licensing, fair pricing, and — above all — gentleness with grieving families. We coordinate every detail with the home you choose.",
    isComplete: (p) => p.funeralHomeId !== "",
    render: () => <StepFuneralHome />,
  },
  {
    id: "clergy",
    label: "Pastor or Priest",
    heading: "Who will lead the service",
    lede: "Ministers of your loved one's tradition, ready to sit with your family and lead a faithful farewell. If you already have a home church, your own pastor is always first.",
    isComplete: (p) => p.clergyId !== "",
    render: () => <StepClergy />,
  },
  {
    id: "casket",
    label: "Casket or Urn",
    heading: "A place of rest",
    lede: "From a humble pine casket to solid bronze — each is presented with its true price, and the simplest choice is every bit as honorable as the finest.",
    isComplete: (p) => p.casketId !== "",
    render: () => <StepCasket />,
  },
  {
    id: "flowers",
    label: "Flowers",
    heading: "Flowers for the service",
    lede: "Choose any arrangements you would like — or none at all. Many families invite memorial gifts to a ministry instead, and we will note that in the program.",
    isComplete: () => true,
    render: () => <StepFlowers />,
  },
  {
    id: "worship",
    label: "Music & Scripture",
    heading: "The music and the Word",
    lede: "The hymns they hummed and the verses they leaned on. These choices flow straight into the printed program and the tribute video.",
    isComplete: (p) => p.hymnIds.length > 0 || p.scriptureIds.length > 0,
    render: () => <StepWorship />,
  },
  {
    id: "program",
    label: "People & Program",
    heading: "The people and the printed word",
    lede: "Eulogists, pallbearers, and the words of thanks your family wishes to share — all set into a printed order of service.",
    isComplete: () => true,
    render: () => <StepProgram />,
  },
  {
    id: "review",
    label: "Review",
    heading: "The plan, gathered together",
    lede: "Look over each choice. When you are ready, print the program, create the tribute, or send everything to your funeral director.",
    isComplete: () => false,
    render: () => <StepReview />,
  },
];

export function PlanWizard() {
  const { plan, ready, cloud } = usePlan();
  const [stepIndex, setStepIndex] = useState(0);

  // Return visitors resume at the first unfinished step.
  const [resumed, setResumed] = useState(false);
  useEffect(() => {
    if (!ready || resumed) return;
    setResumed(true);
    if (plan.deceased.fullName) {
      const firstIncomplete = STEPS.findIndex((s) => !s.isComplete(plan));
      if (firstIncomplete > 0) setStepIndex(firstIncomplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, resumed]);

  const step = STEPS[stepIndex];
  const completedCount = STEPS.filter((s) => s.isComplete(plan)).length;

  return (
    <div className="bg-parchment">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="py-10 text-center">
          <span className="ornament justify-center text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
            The planning companion
          </span>
          <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
            {plan.deceased.fullName
              ? plan.mode === "pre-need"
                ? `A plan of wishes for ${plan.deceased.fullName}`
                : `A farewell for ${plan.deceased.fullName}`
              : "Planning a faithful farewell"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {cloud
              ? "Your plan is saved to your account as you go — open it from any device, or let family carry it with you."
              : "Your plan is saved on this device as you go. Move at your own pace — you can leave and return at any time, and nothing is ever lost."}
          </p>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Stepper */}
          <nav aria-label="Planning steps" className="lg:sticky lg:top-24 lg:self-start">
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
              {STEPS.map((s, i) => {
                const done = s.isComplete(plan);
                const active = i === stepIndex;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setStepIndex(i)}
                      aria-current={active ? "step" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "bg-ink text-parchment"
                          : "text-ink-soft hover:bg-white hover:text-ink"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                          done
                            ? "border-gold bg-gold text-white"
                            : active
                              ? "border-parchment/50 text-parchment"
                              : "border-line text-ink-faint"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span className="whitespace-nowrap font-medium lg:whitespace-normal">
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 hidden text-xs text-ink-faint lg:block">
              {completedCount} of {STEPS.length - 1} steps complete
            </p>
          </nav>

          {/* Step body */}
          <div className="min-w-0">
            <header>
              <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
                {step.heading}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{step.lede}</p>
            </header>

            <div className="mt-8">{ready ? step.render() : null}</div>

            <footer className="mt-10 flex items-center justify-between border-t border-line pt-6">
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-white hover:text-ink disabled:invisible"
              >
                ← Back
              </button>
              {stepIndex < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
                  className="rounded-full bg-gold px-7 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep"
                >
                  Continue →
                </button>
              ) : null}
            </footer>
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ——— Shared selection card used across wizard steps ——— */

export function SelectCard({
  selected,
  onSelect,
  children,
  selectLabel = "Choose",
  selectedLabel = "✓ Chosen",
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  selectLabel?: string;
  selectedLabel?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white/80 p-6 shadow-soft transition-all ${
        selected ? "border-gold ring-2 ring-gold-pale" : "border-line hover:shadow-lift"
      }`}
    >
      <div className="flex-1">{children}</div>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`mt-5 w-full rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          selected
            ? "bg-gold text-white"
            : "border border-line bg-white text-ink hover:border-gold hover:text-gold-deep"
        }`}
      >
        {selected ? selectedLabel : selectLabel}
      </button>
    </div>
  );
}
