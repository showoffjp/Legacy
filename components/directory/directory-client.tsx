"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClergyCard, FuneralHomeCard, VendorCard } from "@/components/directory/cards";
import {
  Button,
  ButtonLink,
  Card,
  Container,
  Field,
  VerseBlock,
  inputCls,
} from "@/components/ui";
import { CLERGY } from "@/lib/data/clergy";
import { FUNERAL_HOMES } from "@/lib/data/funeral-homes";
import { VENDORS } from "@/lib/data/vendors";
import type { GeoLocation, Vendor } from "@/lib/types";

/* ————— Tabs ————— */

const TAB_IDS = ["funeral-homes", "clergy", "florists", "providers"] as const;
type TabId = (typeof TAB_IDS)[number];

function parseTab(value: string | null): TabId {
  return (TAB_IDS as readonly string[]).includes(value ?? "")
    ? (value as TabId)
    : "funeral-homes";
}

/* ————— Data, gathered once at module level ————— */

const FLORISTS = VENDORS.filter((v) => v.category === "florist");
const PROVIDERS = VENDORS.filter((v) => v.category !== "florist");

const ALL_LOCATIONS: GeoLocation[] = [
  ...FUNERAL_HOMES.map((f) => f.location),
  ...CLERGY.map((c) => c.location),
  ...VENDORS.map((v) => v.location),
];

const STATE_OPTIONS = Array.from(new Set(ALL_LOCATIONS.map((l) => l.state))).sort();
const DENOMINATION_OPTIONS = Array.from(new Set(CLERGY.map((c) => c.denomination))).sort();

function cityOptionsFor(stateFilter: string): string[] {
  const cities = ALL_LOCATIONS.filter((l) => !stateFilter || l.state === stateFilter).map(
    (l) => l.city,
  );
  return Array.from(new Set(cities)).sort();
}

const TAB_META: Record<TabId, { label: string; noun: string; total: number }> = {
  "funeral-homes": {
    label: "Funeral Homes",
    noun: "funeral homes",
    total: FUNERAL_HOMES.length,
  },
  clergy: { label: "Pastors & Priests", noun: "ministers", total: CLERGY.length },
  florists: { label: "Florists", noun: "florists", total: FLORISTS.length },
  providers: { label: "Caskets & More", noun: "providers", total: PROVIDERS.length },
};

const PROVIDER_LABELS: Record<Vendor["category"], string> = {
  florist: "Florist",
  "casket-provider": "Casket provider",
  monument: "Monuments",
  catering: "Repast catering",
  livestream: "Livestreaming",
  transportation: "Transportation & procession",
  musicians: "Musicians",
  cemetery: "Cemeteries & burial property",
  "grief-support": "Grief support",
  legal: "Legal & estate",
  lodging: "Family lodging",
  keepsakes: "Keepsakes",
};

/* ————— The directory ————— */

export function DirectoryClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [query, setQuery] = useState("");
  const [denomination, setDenomination] = useState("");

  const selectTab = (next: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const q = query.trim().toLowerCase();
  const matches = (name: string, loc: GeoLocation): boolean => {
    if (stateFilter && loc.state !== stateFilter) return false;
    if (cityFilter && loc.city !== cityFilter) return false;
    if (!q) return true;
    return (
      name.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.zip.includes(q)
    );
  };

  const homes = FUNERAL_HOMES.filter((h) => matches(h.name, h.location));
  const ministers = CLERGY.filter(
    (c) => matches(c.name, c.location) && (!denomination || c.denomination === denomination),
  );
  const floristResults = FLORISTS.filter((v) => matches(v.name, v.location));
  const providerResults = PROVIDERS.filter((v) => matches(v.name, v.location));

  const shownByTab: Record<TabId, number> = {
    "funeral-homes": homes.length,
    clergy: ministers.length,
    florists: floristResults.length,
    providers: providerResults.length,
  };
  const shown = shownByTab[tab];
  const { noun, total } = TAB_META[tab];

  const hasFilters =
    stateFilter !== "" ||
    cityFilter !== "" ||
    q !== "" ||
    (tab === "clergy" && denomination !== "");

  const clearFilters = () => {
    setStateFilter("");
    setCityFilter("");
    setQuery("");
    setDenomination("");
  };

  const scope =
    cityFilter && stateFilter
      ? `in ${cityFilter}, ${stateFilter}`
      : cityFilter
        ? `in ${cityFilter}`
        : stateFilter
          ? `in ${stateFilter}`
          : "across all locations";

  return (
    <Container className="mt-10 sm:mt-12">
      <div className="space-y-8">
        {/* Category tabs */}
        <div
          role="group"
          aria-label="Directory categories"
          className="flex flex-wrap justify-center gap-2"
        >
          {TAB_IDS.map((id) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => selectTab(id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-gold/60 bg-gold-pale/60 text-gold-deep"
                    : "border-line bg-white/60 text-ink-soft hover:border-gold hover:text-gold-deep"
                }`}
              >
                {TAB_META[id].label}
                <span className={`text-xs ${active ? "text-gold-deep/70" : "text-ink-faint"}`}>
                  {TAB_META[id].total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Location search */}
        <div className="rounded-2xl border border-line bg-white/70 p-5 shadow-soft sm:p-6">
          <div className="space-y-4">
            <Field label="Search the directory">
              <input
                type="search"
                className={inputCls}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city, or ZIP"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="State">
                <select
                  className={inputCls}
                  value={stateFilter}
                  onChange={(e) => {
                    setStateFilter(e.target.value);
                    setCityFilter("");
                  }}
                >
                  <option value="">All locations</option>
                  {STATE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City">
                <select
                  className={inputCls}
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="">All cities</option>
                  {cityOptionsFor(stateFilter).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              {tab === "clergy" ? (
                <Field label="Denomination">
                  <select
                    className={inputCls}
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                  >
                    <option value="">All denominations</option>
                    {DENOMINATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-sm text-ink-soft" aria-live="polite">
              Showing <span className="font-semibold text-ink">{shown}</span> of {total} {noun}{" "}
              <span className="text-ink-faint">{scope}</span>
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-gold-deep transition-colors hover:text-gold"
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <p className="text-xs italic text-ink-faint">
            Sample directory shown — partners illustrative of the vetted network in each city.
          </p>
        </div>

        {/* Results */}
        {shown === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : tab === "funeral-homes" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {homes.map((home) => (
              <FuneralHomeCard key={home.id} home={home} />
            ))}
          </div>
        ) : tab === "clergy" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {ministers.map((minister) => (
              <ClergyCard key={minister.id} minister={minister} />
            ))}
          </div>
        ) : tab === "florists" ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {floristResults.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providerResults.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                categoryLabel={PROVIDER_LABELS[vendor.category]}
              />
            ))}
          </div>
        )}

        {tab === "florists" ? <FloristCallout /> : null}
      </div>

      <VerseBlock
        className="mt-20"
        text="Bear ye one another's burdens, and so fulfil the law of Christ."
        reference="Galatians 6:2"
      />
    </Container>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="px-6 py-14 text-center">
      <p className="font-display text-2xl font-medium text-ink">
        No partners found for this search
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        Try widening the area or clearing the filters to see the full network. Our care team can
        also locate a vetted partner near you, day or night.
      </p>
      <Button type="button" variant="outline" className="mt-6" onClick={onClear}>
        Clear filters
      </Button>
    </Card>
  );
}

function FloristCallout() {
  return (
    <div className="rounded-2xl border border-gold-pale bg-gold-pale/40 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
      <div>
        <h3 className="font-display text-xl font-medium text-ink">
          Arrangements for the service itself
        </h3>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
          Casket sprays, standing crosses, and altar flowers are chosen alongside the rest of the
          service, so every detail rests in one place.
        </p>
      </div>
      <ButtonLink href="/plan" variant="outline" className="mt-4 shrink-0 sm:mt-0">
        Browse arrangements in the planning companion
      </ButtonLink>
    </div>
  );
}
