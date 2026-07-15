import type { PartnerCategory } from "@/lib/server/partners";

/**
 * Human-readable names for the partner categories — shared by the
 * partner-application page and the coordinator console. Type-only import
 * above keeps this module free of server dependencies.
 */
export const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  "funeral-home": "Funeral home",
  clergy: "Pastor / priest / minister",
  florist: "Florist",
  "casket-provider": "Casket & urn provider",
  monument: "Monuments & markers",
  catering: "Repast catering",
  livestream: "Livestreaming",
};

/** Label for a stored category value, falling back to the raw value. */
export function categoryLabel(category: string): string {
  return (CATEGORY_LABELS as Record<string, string>)[category] ?? category;
}
