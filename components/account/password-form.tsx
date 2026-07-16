"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  changePasswordAction,
  type SettingsFormState,
} from "@/app/account/settings/actions";
import { Field, inputCls } from "@/components/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-sheen rounded-full bg-gradient-to-b from-[#bd9a54] to-[#8f7440] px-7 py-3 text-sm font-medium text-white shadow-[0_2px_10px_rgba(163,131,63,0.35)] transition-all hover:-translate-y-px disabled:opacity-60"
    >
      {pending ? "Saving…" : "Change the password"}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(changePasswordAction, {
    ok: false,
    error: "",
  });

  return (
    <form action={formAction} className="space-y-5">
      {state.ok ? (
        <p role="status" className="rounded-xl bg-sage/15 px-4 py-3 text-sm text-sage">
          Your password is changed — it takes effect from your next sign-in.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <Field label="Current password">
        <input name="current" type="password" required className={inputCls} autoComplete="current-password" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="New password" hint="At least 8 characters.">
          <input name="next" type="password" required minLength={8} className={inputCls} autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <input name="confirm" type="password" required minLength={8} className={inputCls} autoComplete="new-password" />
        </Field>
      </div>
      <SubmitButton />
    </form>
  );
}
