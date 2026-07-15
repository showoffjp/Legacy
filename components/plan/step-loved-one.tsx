"use client";

import { useRef, useState } from "react";
import { Field, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import type { Denomination } from "@/lib/types";

const DENOMINATIONS: Denomination[] = [
  "Catholic",
  "Baptist",
  "Methodist",
  "Lutheran",
  "Presbyterian",
  "Pentecostal",
  "Orthodox",
  "Anglican / Episcopal",
  "Non-denominational",
];

/** Downscale an uploaded portrait so it stores comfortably in localStorage. */
async function fileToPortraitDataUrl(file: File): Promise<string> {
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
  const max = 640;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function StepLovedOne() {
  const { plan, update } = usePlan();
  const d = plan.deceased;
  const fileRef = useRef<HTMLInputElement>(null);
  const [portraitError, setPortraitError] = useState("");

  async function onPortrait(file: File | undefined) {
    if (!file) return;
    setPortraitError("");
    try {
      const url = await fileToPortraitDataUrl(file);
      update({ deceased: { portraitDataUrl: url } });
    } catch {
      setPortraitError("That image could not be read — please try another photograph.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" hint="As it should appear on the program and memorial.">
            <input
              className={inputCls}
              value={d.fullName}
              onChange={(e) => update({ deceased: { fullName: e.target.value } })}
              placeholder="Eleanor Mae Thompson"
              autoComplete="off"
            />
          </Field>
          <Field label="Known to loved ones as" hint="Optional — a nickname or family name.">
            <input
              className={inputCls}
              value={d.nickname}
              onChange={(e) => update({ deceased: { nickname: e.target.value } })}
              placeholder="Nana Ellie"
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date of birth">
            <input
              type="date"
              className={inputCls}
              value={d.birthDate}
              onChange={(e) => update({ deceased: { birthDate: e.target.value } })}
            />
          </Field>
          <Field label="Date of passing">
            <input
              type="date"
              className={inputCls}
              value={d.deathDate}
              onChange={(e) => update({ deceased: { deathDate: e.target.value } })}
            />
          </Field>
        </div>

        <Field
          label="Christian tradition"
          hint="Helps us match clergy and shape the order of service."
        >
          <select
            className={inputCls}
            value={d.denomination}
            onChange={(e) =>
              update({ deceased: { denomination: e.target.value as Denomination | "" } })
            }
          >
            <option value="">Choose a tradition…</option>
            {DENOMINATIONS.map((den) => (
              <option key={den} value={den}>
                {den}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Their life, in your words"
          hint="A few lines or a whole story — this becomes the heart of the obituary and program. What did they love? How did they live their faith? What will you miss most?"
        >
          <textarea
            className={`${inputCls} min-h-36 resize-y`}
            value={d.lifeStory}
            onChange={(e) => update({ deceased: { lifeStory: e.target.value } })}
            placeholder="She taught Sunday school for forty-two years, made the county's best chicken pot pie, and never once missed a grandchild's recital…"
          />
        </Field>

        <Field
          label="Survived by"
          hint="Spouse, children, grandchildren, dear friends — as you would like it printed."
        >
          <textarea
            className={`${inputCls} min-h-24 resize-y`}
            value={d.survivedBy}
            onChange={(e) => update({ deceased: { survivedBy: e.target.value } })}
            placeholder="Her children Ruth and Samuel; eleven grandchildren; and nineteen great-grandchildren."
          />
        </Field>
      </div>

      {/* Portrait */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Portrait photograph</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-white/70 text-center transition-colors hover:border-gold"
        >
          {d.portraitDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.portraitDataUrl}
              alt={`Portrait of ${d.fullName || "your loved one"}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="px-6">
              <span aria-hidden className="block text-3xl">🖼️</span>
              <span className="mt-2 block text-sm font-medium text-ink">Add a photograph</span>
              <span className="mt-1 block text-xs text-ink-faint">
                Used on the program cover, the memorial, and the tribute video.
              </span>
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 text-xs font-medium text-parchment opacity-0 transition-opacity group-hover:opacity-100">
            {d.portraitDataUrl ? "Change photograph" : "Choose a file"}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Upload portrait photograph"
          onChange={(e) => onPortrait(e.target.files?.[0])}
        />
        {portraitError ? <p className="mt-2 text-xs text-red-700">{portraitError}</p> : null}
        {d.portraitDataUrl ? (
          <button
            type="button"
            onClick={() => update({ deceased: { portraitDataUrl: "" } })}
            className="mt-2 text-xs text-ink-faint underline-offset-2 hover:underline"
          >
            Remove photograph
          </button>
        ) : null}
      </div>
    </div>
  );
}
