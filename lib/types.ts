/**
 * Core domain types for Legacy — a Christian companion for funeral
 * planning, memorials, and tributes.
 */

export type ServiceKind =
  | "traditional-burial"
  | "cremation-with-service"
  | "memorial-service"
  | "graveside-service";

export type Denomination =
  | "Catholic"
  | "Baptist"
  | "Methodist"
  | "Lutheran"
  | "Presbyterian"
  | "Pentecostal"
  | "Orthodox"
  | "Anglican / Episcopal"
  | "Non-denominational";

export interface GeoLocation {
  city: string;
  state: string; // two-letter code
  zip: string;
}

export interface Hymn {
  id: string;
  title: string;
  author: string;
  year: string;
  firstLine: string;
  /** Why families choose it — one reverent sentence. */
  note: string;
  /** Simple melody for the tribute studio synth: [midi, beats] pairs. */
  melody?: [number, number][];
}

export interface Scripture {
  id: string;
  reference: string;
  /** Public-domain KJV text. */
  text: string;
  theme: string;
}

export interface Casket {
  id: string;
  name: string;
  material: string;
  interior: string;
  finish: string;
  priceUsd: number;
  kind: "casket" | "urn";
  description: string;
}

export interface FlowerArrangement {
  id: string;
  name: string;
  style: string;
  flowers: string[];
  priceUsd: number;
  description: string;
}

export interface FuneralHome {
  id: string;
  name: string;
  location: GeoLocation;
  address: string;
  phone: string;
  website: string;
  services: string[];
  rating: number;
  note: string;
}

export interface Clergy {
  id: string;
  name: string;
  title: string;
  denomination: Denomination;
  location: GeoLocation;
  yearsServing: number;
  travels: boolean;
  bio: string;
  phone: string;
  email: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: "florist" | "casket-provider" | "monument" | "catering" | "livestream";
  location: GeoLocation;
  phone: string;
  website: string;
  note: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  priceUsd: number;
  includes: string[];
  highlighted?: boolean;
}

export interface ChecklistItem {
  id: string;
  phase: "first-hours" | "first-days" | "first-weeks" | "first-months";
  title: string;
  detail: string;
}

export interface Memorial {
  slug: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  location: string;
  portraitEmoji?: string;
  verse: { reference: string; text: string };
  story: string[];
  essence: string[]; // short phrases capturing who they were
  hymnIds: string[];
  survivedBy: string;
}

export interface Condolence {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

/**
 * At-need: a loved one has passed and the family is arranging the farewell.
 * Pre-need: someone is lovingly planning ahead and recording their wishes.
 */
export type PlanMode = "at-need" | "pre-need";

/** The living document a family builds through the planning wizard. */
export interface ServicePlan {
  mode: PlanMode;
  deceased: {
    fullName: string;
    nickname: string;
    birthDate: string;
    deathDate: string;
    denomination: Denomination | "";
    lifeStory: string;
    survivedBy: string;
    favoriteVerseId: string;
    portraitDataUrl: string;
  };
  service: {
    kind: ServiceKind | "";
    date: string;
    time: string;
    venueName: string;
    location: GeoLocation;
    visitation: boolean;
    livestream: boolean;
    graveside: boolean;
  };
  funeralHomeId: string;
  clergyId: string;
  casketId: string;
  flowerIds: string[];
  hymnIds: string[];
  scriptureIds: string[];
  program: {
    eulogists: string; // comma / newline separated names
    pallbearers: string;
    specialNotes: string;
    acknowledgment: string;
  };
  updatedAt: string;
}

export const EMPTY_PLAN: ServicePlan = {
  mode: "at-need",
  deceased: {
    fullName: "",
    nickname: "",
    birthDate: "",
    deathDate: "",
    denomination: "",
    lifeStory: "",
    survivedBy: "",
    favoriteVerseId: "",
    portraitDataUrl: "",
  },
  service: {
    kind: "",
    date: "",
    time: "",
    venueName: "",
    location: { city: "", state: "", zip: "" },
    visitation: true,
    livestream: false,
    graveside: false,
  },
  funeralHomeId: "",
  clergyId: "",
  casketId: "",
  flowerIds: [],
  hymnIds: [],
  scriptureIds: [],
  program: {
    eulogists: "",
    pallbearers: "",
    specialNotes: "",
    acknowledgment:
      "The family wishes to express their heartfelt gratitude for your prayers, kindness, and every expression of love shown during this time of bereavement. May God bless and keep you.",
  },
  updatedAt: "",
};
