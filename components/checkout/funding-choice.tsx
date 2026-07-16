"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { startAssignment, type CheckoutFormState } from "@/app/checkout/actions";
import { Button, Field, inputCls } from "@/components/ui";
import { ContactForm } from "@/components/checkout/contact-form";

/**
 * How the family funds the farewell: pay today, or assign a life
 * insurance policy — the way most at-need services are actually funded.
 * Nothing is due today on an assignment; the benefit pays the package
 * directly and the balance still flows to the family.
 */

const initialState: CheckoutFormState = { error: "" };

function AssignmentSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "One moment…" : "Hold arrangements — nothing due today"}
    </Button>
  );
}

function AssignmentForm({ packageId }: { packageId: string }) {
  const [state, formAction] = useActionState(startAssignment, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="packageId" value={packageId} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input
            type="text"
            name="contactName"
            autoComplete="name"
            className={inputCls}
            placeholder="Your full name"
            required
          />
        </Field>
        <Field label="Your email">
          <input
            type="email"
            name="contactEmail"
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
            required
          />
        </Field>
      </div>
      <Field label="Phone (optional)" hint="Our coordinator calls with the one-page form to sign.">
        <input type="tel" name="phone" className={inputCls} placeholder="(615) 555-0123" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Insurance company">
          <input
            type="text"
            name="insurer"
            className={inputCls}
            placeholder="Shepherd Mutual Life"
            required
          />
        </Field>
        <Field label="Policy number" hint="If you have it handy — we can find it together if not.">
          <input type="text" name="policyNumber" className={inputCls} placeholder="SM-0000000" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Whose name is the policy in?">
          <input
            type="text"
            name="policyholder"
            className={inputCls}
            placeholder="Eleanor Mae Thompson"
            required
          />
        </Field>
        <Field label="Approximate benefit (optional)">
          <input
            type="number"
            name="faceAmount"
            min={0}
            step={500}
            inputMode="numeric"
            className={inputCls}
            placeholder="15000"
          />
        </Field>
      </div>
      {state.error ? (
        <p role="alert" className="text-sm leading-relaxed text-gold-deep">
          {state.error}
        </p>
      ) : null}
      <AssignmentSubmit />
      <p className="text-xs leading-relaxed text-ink-faint">
        We verify the policy with the insurer — usually within one business day — and the benefit
        pays the package directly. Everything beyond it still belongs to your family.
      </p>
    </form>
  );
}

export function FundingChoice({ packageId }: { packageId: string }) {
  const [mode, setMode] = useState<"pay" | "assign">("pay");

  return (
    <div>
      <div role="group" aria-label="How would you like to fund this?" className="grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={mode === "pay"}
          onClick={() => setMode("pay")}
          className={`rounded-xl border px-4 py-3 text-left transition-all ${
            mode === "pay"
              ? "border-gold bg-gold-pale/40 ring-2 ring-gold-pale"
              : "border-line bg-white/70 hover:shadow-soft"
          }`}
        >
          <span className="block text-sm font-medium text-ink">Pay today</span>
          <span className="mt-0.5 block text-xs text-ink-soft">Card or hosted checkout</span>
        </button>
        <button
          type="button"
          aria-pressed={mode === "assign"}
          onClick={() => setMode("assign")}
          className={`rounded-xl border px-4 py-3 text-left transition-all ${
            mode === "assign"
              ? "border-gold bg-gold-pale/40 ring-2 ring-gold-pale"
              : "border-line bg-white/70 hover:shadow-soft"
          }`}
        >
          <span className="block text-sm font-medium text-ink">Use life insurance</span>
          <span className="mt-0.5 block text-xs text-ink-soft">Nothing due today</span>
        </button>
      </div>
      <div className="mt-6">
        {mode === "pay" ? <ContactForm packageId={packageId} /> : <AssignmentForm packageId={packageId} />}
      </div>
    </div>
  );
}
