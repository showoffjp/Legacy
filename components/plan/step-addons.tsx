"use client";

import { formatUsd } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { ADDONS, ADDON_CATEGORY_LABELS } from "@/lib/data/addons";
import { SelectCard } from "@/components/plan/wizard";
import type { ServiceAddon } from "@/lib/types";

const CATEGORY_ORDER: ServiceAddon["category"][] = [
  "honors",
  "tribute",
  "family-care",
  "after",
];

export function StepAddons() {
  const { plan, update } = usePlan();

  function toggle(id: string) {
    const has = plan.addonIds.includes(id);
    update({ addonIds: has ? plan.addonIds.filter((a) => a !== id) : [...plan.addonIds, id] });
  }

  return (
    <div className="space-y-12">
      {CATEGORY_ORDER.map((category) => {
        const items = ADDONS.filter((a) => a.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category}>
            <h3 className="mb-5 font-display text-2xl font-semibold text-ink">
              {ADDON_CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((addon) => (
                <SelectCard
                  key={addon.id}
                  selected={plan.addonIds.includes(addon.id)}
                  onSelect={() => toggle(addon.id)}
                  selectLabel={
                    addon.priceFromUsd === 0
                      ? "Add · no charge"
                      : `Add · from ${formatUsd(addon.priceFromUsd)}`
                  }
                  selectedLabel="✓ Added to the service"
                >
                  <span aria-hidden className="text-2xl">
                    {addon.icon}
                  </span>
                  <h4 className="mt-2 font-display text-xl font-semibold text-ink">
                    {addon.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{addon.description}</p>
                </SelectCard>
              ))}
            </div>
          </section>
        );
      })}
      <p className="text-xs text-ink-faint">
        Every honor is optional, and every price is a plain starting price — a coordinator
        confirms exact costs with you before anything is booked.
      </p>
    </div>
  );
}
