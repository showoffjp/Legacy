"use client";

import { Field, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import type { ServiceKind } from "@/lib/types";

const SERVICE_KINDS: { id: ServiceKind; title: string; text: string; icon: string }[] = [
  {
    id: "traditional-burial",
    title: "Traditional Burial",
    text: "Visitation, funeral service at church or chapel, and burial with a graveside committal.",
    icon: "⛪",
  },
  {
    id: "cremation-with-service",
    title: "Cremation with Service",
    text: "A full service of worship with cremation before or after, and an urn placed in honor.",
    icon: "🕯️",
  },
  {
    id: "memorial-service",
    title: "Memorial Service",
    text: "A service of remembrance held without the body present — often some weeks after.",
    icon: "🕊️",
  },
  {
    id: "graveside-service",
    title: "Graveside Service",
    text: "A simple, intimate service held entirely at the grave, led by your pastor or priest.",
    icon: "🌿",
  },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export function StepService() {
  const { plan, update } = usePlan();
  const s = plan.service;

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="mb-4 text-sm font-medium text-ink">The kind of service</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICE_KINDS.map((kind) => {
            const selected = s.kind === kind.id;
            return (
              <button
                key={kind.id}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ service: { kind: kind.id } })}
                className={`rounded-2xl border bg-white/80 p-6 text-left shadow-soft transition-all ${
                  selected ? "border-gold ring-2 ring-gold-pale" : "border-line hover:shadow-lift"
                }`}
              >
                <span aria-hidden className="text-2xl">{kind.icon}</span>
                <span className="mt-2 block font-display text-xl font-semibold text-ink">
                  {kind.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {kind.text}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Service date" hint="Leave blank if not yet known.">
          <input
            type="date"
            className={inputCls}
            value={s.date}
            onChange={(e) => update({ service: { date: e.target.value } })}
          />
        </Field>
        <Field label="Time">
          <input
            type="time"
            className={inputCls}
            value={s.time}
            onChange={(e) => update({ service: { time: e.target.value } })}
          />
        </Field>
        <Field label="Church or venue" hint="If you have one in mind.">
          <input
            className={inputCls}
            value={s.venueName}
            onChange={(e) => update({ service: { venueName: e.target.value } })}
            placeholder="First Baptist Church"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium text-ink">Where the service will be held</legend>
        <p className="mb-4 text-xs text-ink-faint">
          We use this to match funeral homes, clergy, and florists near your family.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="City">
            <input
              className={inputCls}
              value={s.location.city}
              onChange={(e) => update({ service: { location: { city: e.target.value } } })}
              placeholder="Nashville"
            />
          </Field>
          <Field label="State">
            <select
              className={inputCls}
              value={s.location.state}
              onChange={(e) => update({ service: { location: { state: e.target.value } } })}
            >
              <option value="">Choose…</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ZIP code">
            <input
              className={inputCls}
              inputMode="numeric"
              maxLength={5}
              value={s.location.zip}
              onChange={(e) =>
                update({ service: { location: { zip: e.target.value.replace(/[^0-9]/g, "") } } })
              }
              placeholder="37203"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 text-sm font-medium text-ink">Gatherings around the service</legend>
        <div className="space-y-3">
          {(
            [
              {
                key: "visitation",
                title: "Visitation / wake the evening before",
                text: "Time for friends and church family to view, pray, and embrace the family.",
                checked: s.visitation,
              },
              {
                key: "livestream",
                title: "Livestream for far-away family",
                text: "A private link so those who cannot travel may worship with you.",
                checked: s.livestream,
              },
              {
                key: "graveside",
                title: "Graveside committal after the service",
                text: "A short service of committal at the cemetery, ashes to ashes, dust to dust.",
                checked: s.graveside,
              },
            ] as const
          ).map((opt) => (
            <div key={opt.key}>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-line bg-white/80 p-5 shadow-soft transition-colors has-checked:border-gold">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => update({ service: { [opt.key]: e.target.checked } })}
                  className="mt-1 h-4 w-4 accent-gold"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">{opt.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{opt.text}</span>
                </span>
              </label>
              {opt.key === "livestream" && s.livestream ? (
                <div className="mt-3 pl-4 sm:pl-9">
                  <Field
                    label="Livestream link (optional)"
                    hint="If your church or funeral home has given you one — it appears on the memorial page and printed program."
                  >
                    <input
                      className={inputCls}
                      type="url"
                      inputMode="url"
                      value={s.livestreamUrl}
                      onChange={(e) => update({ service: { livestreamUrl: e.target.value } })}
                      placeholder="https://youtube.com/live/…"
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
