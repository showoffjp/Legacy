"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { invitePartnerAction, type InviteFormState } from "@/app/admin/actions";
import { Field, inputCls } from "@/components/ui";

export interface InviteOption {
  id: string;
  label: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:opacity-60"
    >
      {pending ? "Inviting…" : "Open their portal"}
    </button>
  );
}

/** Coordinator tool: open a portal account for a directory partner. */
export function InvitePartnerForm({
  funeralHomes,
  clergy,
}: {
  funeralHomes: InviteOption[];
  clergy: InviteOption[];
}) {
  const [kind, setKind] = useState<"funeral-home" | "clergy">("funeral-home");
  const [state, formAction] = useActionState<InviteFormState, FormData>(invitePartnerAction, {
    ok: false,
    error: "",
  });

  const options = kind === "funeral-home" ? funeralHomes : clergy;

  return (
    <form action={formAction} className="space-y-4">
      {state.ok ? (
        <p role="status" className="rounded-xl bg-sage/15 px-4 py-3 text-sm text-sage">
          Portal opened — the invitation, with a temporary password, is queued in the message
          outbox below.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind of partner">
          <select
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as "funeral-home" | "clergy")}
            className={inputCls}
          >
            <option value="funeral-home">Funeral home</option>
            <option value="clergy">Pastor / priest</option>
          </select>
        </Field>
        <Field label="Which partner">
          <select name="refId" className={inputCls} defaultValue="">
            <option value="" disabled>
              Choose…
            </option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Portal sign-in email">
          <input name="email" type="email" required className={inputCls} placeholder="care@morningstar.example.com" />
        </Field>
        <Field label="Contact name">
          <input name="contactName" className={inputCls} placeholder="Denise Porter, Director" />
        </Field>
      </div>
      <SubmitButton />
    </form>
  );
}
