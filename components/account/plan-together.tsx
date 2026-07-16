"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinPlanAction, type JoinPlanState } from "@/app/account/dashboard/actions";
import { inputCls } from "@/components/ui";

function JoinButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-gold/40 bg-white/70 px-5 py-2.5 text-sm font-medium text-gold-deep shadow-soft transition-all hover:border-gold hover:bg-gold-pale/40 disabled:opacity-60"
    >
      {pending ? "Joining…" : "Join their plan"}
    </button>
  );
}

/** Join a family member's plan with the code they shared. */
export function JoinPlanForm() {
  const [state, formAction] = useActionState<JoinPlanState, FormData>(joinPlanAction, {
    ok: false,
    error: "",
  });

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <label className="flex-1">
        <span className="sr-only">Family code</span>
        <input
          name="code"
          placeholder="FAM-______"
          className={`${inputCls} max-w-48 font-mono uppercase tracking-widest`}
        />
      </label>
      <JoinButton />
      {state.error ? (
        <p role="alert" className="w-full text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="w-full text-sm text-sage">
          You are planning together now — the shared plan is on this dashboard and in the
          planner.
        </p>
      ) : null}
    </form>
  );
}
