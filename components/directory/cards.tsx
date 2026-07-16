"use client";

import Link from "next/link";
import { Badge, Button, Card } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import type { Clergy, FuneralHome, Vendor } from "@/lib/types";

/* Directory cards — calm, complete, and unhurried. */

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function WebsiteLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-gold-deep hover:decoration-gold"
    >
      Visit website
    </a>
  );
}

function ContinuePlanningLink() {
  return (
    <Link
      href="/plan"
      className="ml-auto text-sm font-medium text-gold-deep transition-colors hover:text-gold"
    >
      Continue planning →
    </Link>
  );
}

function SelectButton({
  selected,
  label,
  selectedLabel,
  onSelect,
}: {
  selected: boolean;
  label: string;
  selectedLabel: string;
  onSelect: () => void;
}) {
  return (
    <Button
      type="button"
      variant={selected ? "ghost" : "outline"}
      aria-pressed={selected}
      onClick={onSelect}
      className={selected ? "border border-gold/50 bg-gold-pale/40" : undefined}
    >
      {selected ? selectedLabel : label}
    </Button>
  );
}

export function FuneralHomeCard({ home }: { home: FuneralHome }) {
  const { plan, update } = usePlan();
  const chosen = plan.funeralHomeId === home.id;

  return (
    <Card className="flex h-full flex-col gap-4 p-6 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-medium leading-snug text-ink">
            {home.name}
          </h3>
          <p className="mt-1 text-sm text-ink-faint">
            {home.location.city}, {home.location.state}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full bg-gold-pale/60 px-3 py-1 text-sm font-semibold text-gold-deep"
          aria-label={`Rated ${home.rating} out of 5`}
        >
          ★ {home.rating.toFixed(1)}
        </span>
      </div>

      <div className="space-y-1 text-sm text-ink-soft">
        <p>{home.address}</p>
        <p>
          <a href={telHref(home.phone)} className="transition-colors hover:text-gold-deep">
            {home.phone}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {home.services.map((service) => (
          <Badge key={service} tone="ink">
            {service}
          </Badge>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-ink-soft">{home.note}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
        <SelectButton
          selected={chosen}
          label="Choose for our service"
          selectedLabel="✓ Chosen — part of your plan"
          onSelect={() => update({ funeralHomeId: home.id })}
        />
        <WebsiteLink href={home.website} />
        {chosen ? <ContinuePlanningLink /> : null}
      </div>
    </Card>
  );
}

export function ClergyCard({ minister }: { minister: Clergy }) {
  const { plan, update } = usePlan();
  const requested = plan.clergyId === minister.id;

  return (
    <Card className="flex h-full flex-col gap-4 p-6 sm:p-7">
      <div>
        <h3 className="font-display text-2xl font-medium leading-snug text-ink">
          {minister.name}
        </h3>
        <p className="mt-1 text-sm text-ink-faint">
          {minister.title} · {minister.location.city}, {minister.location.state} ·{" "}
          {minister.yearsServing} years serving
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge tone="gold">{minister.denomination}</Badge>
        {minister.travels ? <Badge tone="sage">Travels for services</Badge> : null}
      </div>

      <p className="text-sm leading-relaxed text-ink-soft">{minister.bio}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
        <a href={telHref(minister.phone)} className="transition-colors hover:text-gold-deep">
          {minister.phone}
        </a>
        <a href={`mailto:${minister.email}`} className="transition-colors hover:text-gold-deep">
          {minister.email}
        </a>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
        <SelectButton
          selected={requested}
          label="Request this minister"
          selectedLabel="✓ Requested — part of your plan"
          onSelect={() => update({ clergyId: minister.id })}
        />
        {requested ? <ContinuePlanningLink /> : null}
      </div>
    </Card>
  );
}

export function VendorCard({
  vendor,
  categoryLabel,
}: {
  vendor: Vendor;
  categoryLabel?: string;
}) {
  return (
    <Card className="flex h-full flex-col gap-3 p-6">
      {categoryLabel ? (
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
          {categoryLabel}
        </span>
      ) : null}
      <div>
        <h3 className="font-display text-xl font-medium leading-snug text-ink">
          {vendor.name}
        </h3>
        <p className="mt-1 text-sm text-ink-faint">
          {vendor.location.city}, {vendor.location.state}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{vendor.note}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-3 text-sm text-ink-soft">
        <a href={telHref(vendor.phone)} className="transition-colors hover:text-gold-deep">
          {vendor.phone}
        </a>
        <WebsiteLink href={vendor.website} />
      </div>
    </Card>
  );
}
