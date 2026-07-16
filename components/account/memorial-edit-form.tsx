"use client";

import { useActionState, useRef, useState } from "react";
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

/** Downscale a gallery photograph so eight of them store comfortably. */
async function fileToGalleryDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const max = 900;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}

export function MemorialEditForm({ memorial }: { memorial: PublishedMemorial }) {
  const [state, formAction] = useActionState<EditMemorialState, FormData>(updateMemorialAction, {
    ok: false,
    error: "",
  });
  const d = memorial.data;
  const [photos, setPhotos] = useState<string[]>(d.photos ?? []);
  const photoInputRef = useRef<HTMLInputElement>(null);

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const additions: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        additions.push(await fileToGalleryDataUrl(file));
      } catch {
        // Skip unreadable files.
      }
    }
    setPhotos((prev) => [...prev, ...additions].slice(0, 8));
  }

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

        <fieldset className="rounded-2xl border border-line bg-white/70 p-5">
          <legend className="px-2 text-sm font-medium text-ink">
            Gallery — a life in pictures
          </legend>
          <input type="hidden" name="photos" value={JSON.stringify(photos)} />
          <p className="text-xs text-ink-faint">
            Up to eight photographs, shown on the memorial page. They are resized gently in your
            browser before saving.
          </p>
          {photos.length > 0 ? (
            <ul className="mt-4 grid grid-cols-4 gap-3">
              {photos.map((photo, i) => (
                <li key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Gallery photograph ${i + 1}`}
                    className="aspect-square w-full rounded-xl border border-line object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove photograph ${i + 1}`}
                    onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-parchment shadow-soft hover:bg-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={photos.length >= 8}
            className="mt-4 rounded-xl border border-dashed border-line bg-parchment px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-50"
          >
            + Add photographs {photos.length > 0 ? `(${photos.length}/8)` : ""}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            aria-label="Add gallery photographs"
            onChange={(e) => {
              addPhotos(e.target.files);
              e.target.value = "";
            }}
          />
        </fieldset>

        <Field
          label="Memorial gifts — in lieu of flowers"
          hint="Name the ministry or cause; a gifts section appears on the page and every recorded gift is gathered below for your thank-you cards. Leave blank for none."
        >
          <input
            name="giftsNote"
            defaultValue={d.giftsNote ?? ""}
            className={inputCls}
            placeholder="In lieu of flowers, the family invites gifts to the First Baptist building fund."
          />
        </Field>

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
