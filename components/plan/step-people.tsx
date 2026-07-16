"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { FUNERAL_HOMES } from "@/lib/data/funeral-homes";
import { CLERGY } from "@/lib/data/clergy";
import { SelectCard } from "@/components/plan/wizard";

function LocationNote({ matched, state }: { matched: boolean; state: string }) {
  if (!state) {
    return (
      <p className="mb-6 rounded-xl bg-gold-pale/40 px-4 py-3 text-sm text-ink-soft">
        Add the service location in <em>The Service</em> step and we will bring the nearest
        partners to the top.
      </p>
    );
  }
  return (
    <p className="mb-6 text-sm text-ink-soft">
      {matched
        ? `Showing partners serving ${state} first.`
        : `No partners listed in ${state} yet in this sample directory — showing our wider network. In production, a coordinator finds and vets a local home within hours.`}
    </p>
  );
}

export function StepFuneralHome() {
  const { plan, update } = usePlan();
  const state = plan.service.location.state;

  const homes = useMemo(() => {
    const sorted = [...FUNERAL_HOMES].sort((a, b) => b.rating - a.rating);
    if (!state) return sorted;
    return [
      ...sorted.filter((h) => h.location.state === state),
      ...sorted.filter((h) => h.location.state !== state),
    ];
  }, [state]);

  const anyLocal = state ? FUNERAL_HOMES.some((h) => h.location.state === state) : false;

  return (
    <div>
      <LocationNote matched={anyLocal} state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        {homes.map((home) => (
          <SelectCard
            key={home.id}
            selected={plan.funeralHomeId === home.id}
            onSelect={() =>
              update({ funeralHomeId: plan.funeralHomeId === home.id ? "" : home.id })
            }
            selectLabel="Choose this funeral home"
            selectedLabel="✓ Chosen — we will coordinate with them"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink">{home.name}</h3>
              <span className="shrink-0 text-sm font-medium text-gold-deep">★ {home.rating}</span>
            </div>
            <p className="mt-1 text-sm text-ink-faint">
              {home.location.city}, {home.location.state} · {home.phone}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{home.note}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {home.services.map((sv) => (
                <Badge key={sv} tone="ink">
                  {sv}
                </Badge>
              ))}
            </div>
          </SelectCard>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-faint">
        Sample directory shown — partners illustrative of the vetted network in each city.
      </p>
    </div>
  );
}

export function StepClergy() {
  const { plan, update } = usePlan();
  const state = plan.service.location.state;
  const tradition = plan.deceased.denomination;
  const [showAll, setShowAll] = useState(false);

  const ministers = useMemo(() => {
    let list = [...CLERGY];
    if (!showAll && tradition) {
      const matching = list.filter((c) => c.denomination === tradition);
      if (matching.length > 0) list = matching;
    }
    if (state) {
      list = [
        ...list.filter((c) => c.location.state === state),
        ...list.filter((c) => c.location.state !== state && c.travels),
        ...list.filter((c) => c.location.state !== state && !c.travels),
      ];
    }
    return list;
  }, [state, tradition, showAll]);

  return (
    <div>
      {tradition ? (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-ink-soft">
            Showing <span className="font-medium text-ink">{tradition}</span> ministers
            {state ? `, nearest to ${state} first` : ""}.
          </p>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium text-gold-deep underline-offset-2 hover:underline"
          >
            {showAll ? "Show matching tradition only" : "Show every tradition"}
          </button>
        </div>
      ) : (
        <p className="mb-6 rounded-xl bg-gold-pale/40 px-4 py-3 text-sm text-ink-soft">
          Choose your loved one&apos;s tradition in <em>Your Loved One</em> and we will match
          ministers of that tradition first.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {ministers.map((minister) => (
          <SelectCard
            key={minister.id}
            selected={plan.clergyId === minister.id}
            onSelect={() => update({ clergyId: plan.clergyId === minister.id ? "" : minister.id })}
            selectLabel="Request this minister"
            selectedLabel="✓ Requested — we will confirm within hours"
          >
            <h3 className="font-display text-xl font-semibold text-ink">{minister.name}</h3>
            <p className="mt-1 text-sm text-ink-faint">
              {minister.title} · {minister.location.city}, {minister.location.state}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge>{minister.denomination}</Badge>
              <Badge tone="ink">{minister.yearsServing} years serving</Badge>
              {minister.travels ? <Badge tone="sage">Travels for services</Badge> : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{minister.bio}</p>
          </SelectCard>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-faint">
        Already have a home church? Your own pastor always comes first — choose no one here and
        note your church in <em>The Service</em> step, and we will coordinate with them instead.
      </p>
    </div>
  );
}
