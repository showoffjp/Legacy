"use client";

import { useState } from "react";
import { Badge, formatUsd } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { CASKETS } from "@/lib/data/caskets";
import { FLOWERS } from "@/lib/data/flowers";
import { SelectCard } from "@/components/plan/wizard";

export function StepCasket() {
  const { plan, update } = usePlan();
  const cremation = plan.service.kind === "cremation-with-service";
  const [tab, setTab] = useState<"casket" | "urn">(cremation ? "urn" : "casket");

  const items = CASKETS.filter((c) => c.kind === tab);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-line bg-white p-1">
        {(["casket", "urn"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={tab === kind}
            onClick={() => setTab(kind)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === kind ? "bg-ink text-parchment" : "text-ink-soft hover:text-ink"
            }`}
          >
            {kind === "casket" ? "Caskets" : "Urns"}
          </button>
        ))}
      </div>
      {cremation && tab === "casket" ? (
        <p className="mb-6 text-sm text-ink-soft">
          You chose cremation with a service — many families select a simple casket for the
          visitation and an urn for the committal. Both are shown here.
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <SelectCard
            key={item.id}
            selected={plan.casketId === item.id}
            onSelect={() => update({ casketId: plan.casketId === item.id ? "" : item.id })}
            selectLabel={`Choose · ${formatUsd(item.priceUsd)}`}
            selectedLabel="✓ Chosen"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink">{item.name}</h3>
              <span className="shrink-0 font-medium text-gold-deep">
                {formatUsd(item.priceUsd)}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-faint">
              {item.material} · {item.finish}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.description}</p>
            <p className="mt-2 text-xs text-ink-faint">Interior: {item.interior}</p>
          </SelectCard>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-faint">
        Every price is the full price — no handling fees, no markups at the door. Under the FTC
        Funeral Rule, any funeral home must accept a casket you provide without charge.
      </p>
    </div>
  );
}

export function StepFlowers() {
  const { plan, update } = usePlan();

  function toggle(id: string) {
    const has = plan.flowerIds.includes(id);
    update({ flowerIds: has ? plan.flowerIds.filter((f) => f !== id) : [...plan.flowerIds, id] });
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FLOWERS.map((fl) => (
          <SelectCard
            key={fl.id}
            selected={plan.flowerIds.includes(fl.id)}
            onSelect={() => toggle(fl.id)}
            selectLabel={`Add · ${formatUsd(fl.priceUsd)}`}
            selectedLabel="✓ Added to the service"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink">{fl.name}</h3>
              <span className="shrink-0 font-medium text-gold-deep">{formatUsd(fl.priceUsd)}</span>
            </div>
            <div className="mt-2">
              <Badge tone="sage">{fl.style}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{fl.description}</p>
            <p className="mt-2 text-xs text-ink-faint">{fl.flowers.join(" · ")}</p>
          </SelectCard>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-faint">
        Arrangements are prepared and delivered by a trusted local florist near your service — see
        the directory for florists in your city.
      </p>
    </div>
  );
}
