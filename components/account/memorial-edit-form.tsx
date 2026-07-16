"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateMemorialAction,
  unpublishOwnMemorialAction,
  type EditMemorialState,
} from "@/app/account/memorials/[slug]/actions";
import { Field, inputCls } from "@/components/ui";
import type { PublishedMemorial } from "@/lib/server/memorials";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save the memorial"}
    </button>
  );
}

export function MemorialEditForm({ memorial }: { memorial: PublishedMemorial }) {
  const [state, formAction] = useActionState<EditMemorialState, FormData>(updateMemorialAction, {
    ok: false,
    error: "",
  });
  const d = memorial.data;

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="slug" value={memorial.slug} />

        {state.ok ? (
          <p role="status" className="rounded-xl bg-sage/15 px-4 py-3 text-sm text-sage">
            Saved — the memorial page reflects your changes now.
          </p>
        ) : null}
        {state.error ? (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Known to loved ones as" hint="Optional nickname shown under their name.">
            <input name="nickname" defaultValue={d.nickname} className={inputCls} />
          </Field>
          <Field label="Their community" hint="e.g. Nashville, Tennessee">
            <input name="locationText" defaultValue={d.locationText} className={inputCls} />
          </Field>
        </div>

        <Field
          label="Their story"
          hint="One paragraph per line — this is the heart of the page."
        >
          <textarea
            name="story"
            defaultValue={d.story.join("\n")}
            className={`${inputCls} min-h-40 resize-y`}
          />
        </Field>

        <Field label="Survived by">
          <textarea
            name="survivedBy"
            defaultValue={d.survivedBy}
            className={`${inputCls} min-h-24 resize-y`}
          />
        </Field>

        <fieldset className="rounded-2xl border border-line bg-white/70 p-5">
          <legend className="px-2 text-sm font-medium text-ink">Service details</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Kind of service">
              <select name="serviceKind" defaultValue={d.service?.kind ?? ""} className={inputCls}>
                <option value="">Not shown</option>
                <option value="traditional-burial">Funeral service</option>
                <option value="cremation-with-service">Service of worship</option>
                <option value="memorial-service">Memorial service</option>
                <option value="graveside-service">Graveside service</option>
              </select>
            </Field>
            <Field label="Date">
              <input
                name="serviceDate"
                type="date"
                defaultValue={d.service?.date ?? ""}
                className={inputCls}
              />
            </Field>
            <Field label="Time">
              <input
                name="serviceTime"
                type="time"
                defaultValue={d.service?.time ?? ""}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Venue">
              <input name="venueName" defaultValue={d.service?.venueName ?? ""} className={inputCls} />
            </Field>
            <Field label="City">
              <input name="city" defaultValue={d.service?.city ?? ""} className={inputCls} />
            </Field>
            <Field label="State">
              <input
                name="state"
                maxLength={2}
                defaultValue={d.service?.state ?? ""}
                className={inputCls}
              />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="livestream"
              defaultChecked={d.service?.livestream ?? false}
              className="h-4 w-4 accent-gold"
            />
            Note that the service will be livestreamed
          </label>
        </fieldset>

        <Field
          label="Who can find this page"
          hint="Link-only pages stay reachable by anyone with the link, but are not listed publicly."
        >
          <select name="privacy" defaultValue={memorial.privacy} className={inputCls}>
            <option value="public">Public — listed among the memorials</option>
            <option value="link-only">Link-only — shared quietly by the family</option>
          </select>
        </Field>

        <SaveButton />
      </form>

      <form
        action={unpublishOwnMemorialAction}
        className="border-t border-line pt-6"
      >
        <input type="hidden" name="slug" value={memorial.slug} />
        <p className="text-sm text-ink-soft">
          Taking the page down keeps every condolence, RSVP, and promised dish safe — a
          coordinator can restore it for you at any time.
        </p>
        <button
          type="submit"
          className="mt-3 rounded-full border border-line bg-white px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-red-300 hover:text-red-700"
        >
          Unpublish this memorial
        </button>
      </form>
    </div>
  );
}
