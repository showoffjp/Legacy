"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp } from "@/app/account/actions";
import { Button, Field, inputCls } from "@/components/ui";

type Mode = "sign-in" | "sign-up";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "One moment…" : label}
    </Button>
  );
}

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm leading-relaxed text-red-700">
      {message}
    </p>
  );
}

/** Sign in / create account panel — one quiet card, two gentle doors. */
export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [signInState, signInAction] = useActionState(signIn, { error: "" });
  const [signUpState, signUpAction] = useActionState(signUp, { error: "" });

  const toggleCls = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      active ? "bg-white text-ink shadow-soft" : "text-ink-faint hover:text-ink"
    }`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-parchment-deep/60 p-1">
        <button
          type="button"
          aria-pressed={mode === "sign-in"}
          onClick={() => setMode("sign-in")}
          className={toggleCls(mode === "sign-in")}
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={mode === "sign-up"}
          onClick={() => setMode("sign-up")}
          className={toggleCls(mode === "sign-up")}
        >
          Create an account
        </button>
      </div>

      {mode === "sign-in" ? (
        <form action={signInAction} className="mt-7 flex flex-col gap-4">
          <h2 className="sr-only">Sign in to your account</h2>
          <Field label="Email">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </Field>
          <FormError message={signInState.error} />
          <SubmitButton label="Sign in" />
        </form>
      ) : (
        <form action={signUpAction} className="mt-7 flex flex-col gap-4">
          <h2 className="sr-only">Create an account</h2>
          <Field label="Your name">
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Mary Whitfield"
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Password" hint="At least 8 characters.">
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputCls}
            />
          </Field>
          <FormError message={signUpState.error} />
          <SubmitButton label="Create account" />
        </form>
      )}
    </div>
  );
}
