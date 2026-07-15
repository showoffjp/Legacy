"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { startCheckout, type CheckoutFormState } from "@/app/checkout/actions";
import { Button, Field, inputCls } from "@/components/ui";

const initialState: CheckoutFormState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "One moment…" : "Continue to payment"}
    </Button>
  );
}

export function ContactForm({ packageId }: { packageId: string }) {
  const [state, formAction] = useActionState(startCheckout, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="packageId" value={packageId} />
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
      <Field label="Email for your receipt">
        <input
          type="email"
          name="contactEmail"
          autoComplete="email"
          className={inputCls}
          placeholder="you@example.com"
          required
        />
      </Field>
      {state.error ? (
        <p role="alert" className="text-sm leading-relaxed text-gold-deep">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
      <p className="text-xs leading-relaxed text-ink-faint">
        You will review everything before any payment is made.
      </p>
    </form>
  );
}
