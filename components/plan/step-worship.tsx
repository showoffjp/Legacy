"use client";

import { Field, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { HYMNS } from "@/lib/data/hymns";
import { SCRIPTURES } from "@/lib/data/scriptures";

export function StepWorship() {
  const { plan, update } = usePlan();

  function toggleHymn(id: string) {
    const has = plan.hymnIds.includes(id);
    update({ hymnIds: has ? plan.hymnIds.filter((h) => h !== id) : [...plan.hymnIds, id] });
  }

  function toggleScripture(id: string) {
    const has = plan.scriptureIds.includes(id);
    update({
      scriptureIds: has
        ? plan.scriptureIds.filter((s) => s !== id)
        : [...plan.scriptureIds, id],
    });
  }

  return (
    <div className="space-y-12">
      <section>
        <h3 className="font-display text-2xl font-semibold text-ink">Hymns and songs</h3>
        <p className="mt-1 mb-5 text-sm text-ink-soft">
          Choose the hymns for the service — they are printed in the program in the order chosen,
          and available as instrumentals in the tribute studio.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {HYMNS.map((hymn) => {
            const selected = plan.hymnIds.includes(hymn.id);
            const order = plan.hymnIds.indexOf(hymn.id);
            return (
              <label
                key={hymn.id}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white/80 p-5 shadow-soft transition-all ${
                  selected ? "border-gold ring-2 ring-gold-pale" : "border-line hover:shadow-lift"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleHymn(hymn.id)}
                  className="mt-1 h-4 w-4 accent-gold"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-ink">
                      {hymn.title}
                    </span>
                    {selected ? (
                      <span className="shrink-0 text-xs font-semibold text-gold-deep">
                        {order + 1}
                        {["st", "nd", "rd"][order] ?? "th"}
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-xs text-ink-faint">
                    {hymn.author}, {hymn.year}
                  </span>
                  <span className="mt-1 block text-sm italic text-ink-soft">
                    “{hymn.firstLine}”
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-display text-2xl font-semibold text-ink">Scripture readings</h3>
        <p className="mt-1 mb-5 text-sm text-ink-soft">
          The passages to be read aloud — by the minister, or by family and friends you name in the
          next step.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {SCRIPTURES.map((sc) => {
            const selected = plan.scriptureIds.includes(sc.id);
            return (
              <label
                key={sc.id}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white/80 p-5 shadow-soft transition-all ${
                  selected ? "border-gold ring-2 ring-gold-pale" : "border-line hover:shadow-lift"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleScripture(sc.id)}
                  className="mt-1 h-4 w-4 accent-gold"
                />
                <span>
                  <span className="block font-display text-lg font-semibold text-ink">
                    {sc.reference}
                  </span>
                  <span className="block text-xs uppercase tracking-wide text-gold-deep">
                    {sc.theme}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm italic text-ink-soft">
                    “{sc.text}”
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="max-w-md">
        <Field
          label="Their own favorite verse"
          hint="Printed beneath their name on the program cover."
        >
          <select
            className={inputCls}
            value={plan.deceased.favoriteVerseId}
            onChange={(e) => update({ deceased: { favoriteVerseId: e.target.value } })}
          >
            <option value="">Choose a verse…</option>
            {SCRIPTURES.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.reference} — {sc.theme}
              </option>
            ))}
          </select>
        </Field>
      </section>
    </div>
  );
}
