import type { ServiceAddon } from "@/lib/types";

/**
 * Honors and add-on services — everything beyond the core arrangements
 * that a farewell may ask for, each coordinated by Legacy with trusted
 * providers. Prices are honest starting prices.
 */
export const ADDONS: ServiceAddon[] = [
  {
    id: "veteran-honors",
    name: "Military Funeral Honors",
    icon: "🎖️",
    category: "honors",
    priceFromUsd: 0,
    description:
      "Flag presentation, honor guard, and the sounding of Taps for those who served. Provided at no cost to veteran families — we handle the DD-214 paperwork and scheduling with the service branch.",
  },
  {
    id: "dove-release",
    name: "White Dove Release",
    icon: "🕊️",
    category: "honors",
    priceFromUsd: 195,
    description:
      "Trained white doves released at the graveside — a living picture of the spirit returning home. A single dove, or a flight of three following.",
  },
  {
    id: "bagpiper",
    name: "Bagpiper",
    icon: "🎼",
    category: "honors",
    priceFromUsd: 325,
    description:
      "Amazing Grace on the pipes as the casket is borne out — a farewell that echoes across the cemetery. Uniformed, experienced funeral pipers.",
  },
  {
    id: "soloist",
    name: "Vocal Soloist or Organist",
    icon: "🎵",
    category: "honors",
    priceFromUsd: 250,
    description:
      "A seasoned church soloist, organist, or pianist for the hymns your family has chosen — rehearsed with your minister and in step with the order of service.",
  },
  {
    id: "carriage",
    name: "Horse-Drawn Carriage",
    icon: "🐎",
    category: "tribute",
    priceFromUsd: 1450,
    description:
      "A glass-sided caisson drawn by matched horses for the final procession — a homegoing of great honor in the old way.",
  },
  {
    id: "limousine",
    name: "Family Limousine",
    icon: "🚘",
    category: "family-care",
    priceFromUsd: 395,
    description:
      "A chauffeured car for the immediate family — from the home, to the church, to the graveside, and home again. No one who is grieving should have to drive.",
  },
  {
    id: "livestream-pro",
    name: "Livestream Production",
    icon: "📹",
    category: "tribute",
    priceFromUsd: 495,
    description:
      "A two-camera crew streams the service on a private family link and delivers a keepsake recording — for the granddaughter overseas and the brother who could not travel.",
  },
  {
    id: "keepsakes",
    name: "Thumbprint & Keepsake Jewelry",
    icon: "💛",
    category: "tribute",
    priceFromUsd: 145,
    description:
      "A thumbprint preserved by the funeral home becomes pendants and charms for children and grandchildren — a touch that stays close for a lifetime.",
  },
  {
    id: "memorial-trees",
    name: "Memorial Tree Planting",
    icon: "🌳",
    category: "tribute",
    priceFromUsd: 85,
    description:
      "A living memorial — trees planted in their name in a national forest, with a certificate for the family. Life continuing, in their honor.",
  },
  {
    id: "lodging",
    name: "Travel & Lodging for Family",
    icon: "🏨",
    category: "family-care",
    priceFromUsd: 95,
    description:
      "We arrange a discounted hotel block near the service and share the booking link with your announcement — the same care a wedding gives its guests, for the family gathering to grieve.",
  },
  {
    id: "paperwork",
    name: "Certificates & Paperwork Assistance",
    icon: "📋",
    category: "after",
    priceFromUsd: 145,
    description:
      "Certified death certificates ordered in the right quantity, Social Security and insurer notifications prepared, and a checklist walked through with a coordinator — the paperwork carried for you.",
  },
  {
    id: "grief-counseling",
    name: "Grief Counseling Sessions",
    icon: "🤍",
    category: "after",
    priceFromUsd: 120,
    description:
      "Sessions with a licensed Christian grief counselor for any member of the family, beginning whenever they are ready — including children's specialists.",
  },
];

export const ADDON_CATEGORY_LABELS: Record<ServiceAddon["category"], string> = {
  honors: "Honors at the service",
  tribute: "Tributes & remembrances",
  "family-care": "Care for the family",
  after: "After the service",
};

export const addonById = (id: string) => ADDONS.find((a) => a.id === id);
