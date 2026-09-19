"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { assignMemorialOwnerAction, type InviteFormState } from "@/app/admin/actions";
import { inputCls } from "@/components/ui";

function ConnectButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-line bg-white px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-60"
    >
      {pending ? "Connecting…" : "Connect"}
    </button>
  );
}

/**
 * Coordinator tool: a memorial published without an account (a neighbor
 * helping, a church office) gets connected to the family's account so they
 * can manage the page themselves.
 */
export function ConnectFamilyForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState<InviteFormState, FormData>(
    assignMemorialOwnerAction,
    { ok: false, error: "" },
  );
  return (
    <form action={formAction} className="mt-4 border-t border-line/70 pt-4">
      <input type="hidden" name="slug" value={slug} />
      <p className="text-xs text-ink-faint">
        Not yet connected to a family account — connect it so the family can manage the page.
      </p>
      {state.error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="family@example.com"
          aria-label={`Family account email for ${slug}`}
          className={`${inputCls} max-w-xs`}
        />
        <ConnectButton />
      </div>
    </form>
  );
}
