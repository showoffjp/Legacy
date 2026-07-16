import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/server/db";
import { scriptureById } from "@/lib/data/scriptures";
import { MEMORIALS } from "@/lib/data/memorials";
import type { ServicePlan } from "@/lib/types";

/**
 * Published memorials — living pages a family creates from their plan.
 * Sample memorials (lib/data/memorials.ts) remain as examples alongside.
 */

export interface PublishedMemorialData {
  fullName: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  locationText: string;
  verse: { reference: string; text: string } | null;
  story: string[];
  survivedBy: string;
  hymnIds: string[];
  portraitDataUrl: string;
  /** "In lieu of flowers" — the ministry or cause the family designates. */
  giftsNote?: string;
  service: {
    kind: string;
    date: string;
    time: string;
    venueName: string;
    city: string;
    state: string;
    livestream: boolean;
  } | null;
}

export type MemorialPrivacy = "public" | "link-only";

export interface PublishedMemorial {
  slug: string;
  ownerId: string | null;
  data: PublishedMemorialData;
  privacy: MemorialPrivacy;
  createdAt: string;
}

export interface CondolenceRow {
  id: string;
  memorial_slug: string;
  name: string;
  message: string;
  created_at: string;
}

export interface RsvpRow {
  id: string;
  memorial_slug: string;
  name: string;
  attending: number;
  guests: number;
  note: string;
  created_at: string;
}

interface MemorialRow {
  slug: string;
  owner_id: string | null;
  data: string;
  published: number;
  privacy: string;
  created_at: string;
  updated_at: string;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "in-loving-memory"
  );
}

const SUFFIX_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function shortSuffix(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += SUFFIX_ALPHABET[Math.floor(Math.random() * SUFFIX_ALPHABET.length)];
  }
  return s;
}

function slugTaken(slug: string): boolean {
  if (MEMORIALS.some((m) => m.slug === slug)) return true;
  const row = getDb().prepare("SELECT slug FROM memorials WHERE slug = ?").get(slug);
  return row !== undefined;
}

export function publishMemorialFromPlan(plan: ServicePlan, ownerId: string | null): string {
  const verse = scriptureById(plan.deceased.favoriteVerseId);
  const data: PublishedMemorialData = {
    fullName: plan.deceased.fullName.trim(),
    nickname: plan.deceased.nickname.trim(),
    birthDate: plan.deceased.birthDate,
    deathDate: plan.deceased.deathDate,
    locationText: [plan.service.location.city, plan.service.location.state]
      .filter(Boolean)
      .join(", "),
    verse: verse ? { reference: verse.reference, text: verse.text } : null,
    story: plan.deceased.lifeStory
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    survivedBy: plan.deceased.survivedBy.trim(),
    hymnIds: plan.hymnIds,
    portraitDataUrl: plan.deceased.portraitDataUrl,
    service: plan.service.kind
      ? {
          kind: plan.service.kind,
          date: plan.service.date,
          time: plan.service.time,
          venueName: plan.service.venueName,
          city: plan.service.location.city,
          state: plan.service.location.state,
          livestream: plan.service.livestream,
        }
      : null,
  };

  let slug = slugify(data.fullName);
  while (slugTaken(slug)) {
    slug = `${slugify(data.fullName)}-${shortSuffix()}`;
  }

  const now = nowIso();
  getDb()
    .prepare(
      "INSERT INTO memorials (slug, owner_id, data, published, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)",
    )
    .run(slug, ownerId, JSON.stringify(data), now, now);
  return slug;
}

function rowToMemorial(row: MemorialRow): PublishedMemorial | null {
  try {
    return {
      slug: row.slug,
      ownerId: row.owner_id,
      data: JSON.parse(row.data) as PublishedMemorialData,
      privacy: row.privacy === "link-only" ? "link-only" : "public",
      createdAt: row.created_at,
    };
  } catch {
    return null;
  }
}

export function getPublishedMemorial(slug: string): PublishedMemorial | null {
  const row = getDb()
    .prepare("SELECT * FROM memorials WHERE slug = ? AND published = 1")
    .get(slug) as unknown as MemorialRow | undefined;
  return row ? rowToMemorial(row) : null;
}

/** Publicly listed memorials — link-only pages stay reachable but unlisted. */
export function listPublishedMemorials(limit = 50): PublishedMemorial[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM memorials WHERE published = 1 AND privacy = 'public' ORDER BY created_at DESC LIMIT ?",
    )
    .all(limit) as unknown as MemorialRow[];
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

/** Every published memorial regardless of privacy — for the coordinator console. */
export function listAllPublishedMemorials(limit = 100): PublishedMemorial[] {
  const rows = getDb()
    .prepare("SELECT * FROM memorials WHERE published = 1 ORDER BY created_at DESC LIMIT ?")
    .all(limit) as unknown as MemorialRow[];
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

export function listMemorialsForOwner(ownerId: string): PublishedMemorial[] {
  const rows = getDb()
    .prepare("SELECT * FROM memorials WHERE owner_id = ? ORDER BY created_at DESC")
    .all(ownerId) as unknown as MemorialRow[];
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

/** Coordinator moderation: hide a published memorial (content is retained). */
export function unpublishMemorial(slug: string): void {
  getDb()
    .prepare("UPDATE memorials SET published = 0, updated_at = ? WHERE slug = ?")
    .run(nowIso(), slug);
}

export function getMemorialForOwner(slug: string, ownerId: string): PublishedMemorial | null {
  const row = getDb()
    .prepare("SELECT * FROM memorials WHERE slug = ? AND owner_id = ? AND published = 1")
    .get(slug, ownerId) as unknown as MemorialRow | undefined;
  return row ? rowToMemorial(row) : null;
}

export interface OwnerMemorialPatch {
  story?: string[];
  survivedBy?: string;
  nickname?: string;
  locationText?: string;
  giftsNote?: string;
  service?: PublishedMemorialData["service"];
  privacy?: MemorialPrivacy;
}

/** Owner editing — merges content into the stored page. */
export function updateMemorialByOwner(
  slug: string,
  ownerId: string,
  patch: OwnerMemorialPatch,
): boolean {
  const memorial = getMemorialForOwner(slug, ownerId);
  if (!memorial) return false;
  const data: PublishedMemorialData = {
    ...memorial.data,
    ...(patch.story !== undefined ? { story: patch.story } : null),
    ...(patch.survivedBy !== undefined ? { survivedBy: patch.survivedBy } : null),
    ...(patch.nickname !== undefined ? { nickname: patch.nickname } : null),
    ...(patch.locationText !== undefined ? { locationText: patch.locationText } : null),
    ...(patch.giftsNote !== undefined ? { giftsNote: patch.giftsNote } : null),
    ...(patch.service !== undefined ? { service: patch.service } : null),
  };
  getDb()
    .prepare("UPDATE memorials SET data = ?, privacy = ?, updated_at = ? WHERE slug = ?")
    .run(
      JSON.stringify(data),
      patch.privacy ?? memorial.privacy,
      nowIso(),
      slug,
    );
  return true;
}

export function unpublishMemorialByOwner(slug: string, ownerId: string): boolean {
  const memorial = getMemorialForOwner(slug, ownerId);
  if (!memorial) return false;
  unpublishMemorial(slug);
  return true;
}

/* ——— Condolences ——— */

export function addCondolence(slug: string, name: string, message: string): CondolenceRow {
  const id = randomUUID();
  const now = nowIso();
  getDb()
    .prepare(
      "INSERT INTO condolences (id, memorial_slug, name, message, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(id, slug, name, message, now);
  return { id, memorial_slug: slug, name, message, created_at: now };
}

export function listCondolences(slug: string): CondolenceRow[] {
  return getDb()
    .prepare("SELECT * FROM condolences WHERE memorial_slug = ? ORDER BY created_at DESC")
    .all(slug) as unknown as CondolenceRow[];
}

/* ——— RSVPs ——— */

export function addRsvp(input: {
  slug: string;
  name: string;
  attending: boolean;
  guests: number;
  note: string;
}): RsvpRow {
  const id = randomUUID();
  const now = nowIso();
  const guests = Math.max(1, Math.min(20, Math.round(input.guests)));
  getDb()
    .prepare(
      "INSERT INTO rsvps (id, memorial_slug, name, attending, guests, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(id, input.slug, input.name, input.attending ? 1 : 0, guests, input.note, now);
  return {
    id,
    memorial_slug: input.slug,
    name: input.name,
    attending: input.attending ? 1 : 0,
    guests,
    note: input.note,
    created_at: now,
  };
}

export function rsvpSummary(slug: string): { families: number; guests: number } {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) AS families, COALESCE(SUM(guests), 0) AS guests FROM rsvps WHERE memorial_slug = ? AND attending = 1",
    )
    .get(slug) as unknown as { families: number; guests: number };
  return { families: row.families, guests: row.guests };
}

/* ——— The repast table (meal sign-up) ——— */

export interface MealOfferRow {
  id: string;
  memorial_slug: string;
  name: string;
  dish: string;
  serves: number;
  note: string;
  created_at: string;
}

export function addMealOffer(input: {
  slug: string;
  name: string;
  dish: string;
  serves: number;
  note: string;
}): MealOfferRow {
  const id = randomUUID();
  const now = nowIso();
  const serves = Math.max(1, Math.min(100, Math.round(input.serves)));
  getDb()
    .prepare(
      "INSERT INTO meal_offers (id, memorial_slug, name, dish, serves, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(id, input.slug, input.name, input.dish, serves, input.note, now);
  return {
    id,
    memorial_slug: input.slug,
    name: input.name,
    dish: input.dish,
    serves,
    note: input.note,
    created_at: now,
  };
}

export function listMealOffers(slug: string): MealOfferRow[] {
  return getDb()
    .prepare("SELECT * FROM meal_offers WHERE memorial_slug = ? ORDER BY created_at ASC")
    .all(slug) as unknown as MealOfferRow[];
}

export function mealSummary(slug: string): { dishes: number; serves: number } {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) AS dishes, COALESCE(SUM(serves), 0) AS serves FROM meal_offers WHERE memorial_slug = ?",
    )
    .get(slug) as unknown as { dishes: number; serves: number };
  return { dishes: row.dishes, serves: row.serves };
}

/* ——— Memorial gifts ("in lieu of flowers") ——— */

export interface GiftPledgeRow {
  id: string;
  memorial_slug: string;
  name: string;
  amount_usd: number;
  note: string;
  created_at: string;
}

export function addGiftPledge(input: {
  slug: string;
  name: string;
  amountUsd: number;
  note: string;
}): GiftPledgeRow {
  const id = randomUUID();
  const now = nowIso();
  const amount = Math.max(0, Math.min(100_000, Math.round(input.amountUsd)));
  getDb()
    .prepare(
      "INSERT INTO gift_pledges (id, memorial_slug, name, amount_usd, note, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(id, input.slug, input.name, amount, input.note, now);
  return { id, memorial_slug: input.slug, name: input.name, amount_usd: amount, note: input.note, created_at: now };
}

export function listGiftPledges(slug: string): GiftPledgeRow[] {
  return getDb()
    .prepare("SELECT * FROM gift_pledges WHERE memorial_slug = ? ORDER BY created_at DESC")
    .all(slug) as unknown as GiftPledgeRow[];
}

export function giftSummary(slug: string): { gifts: number; total: number } {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) AS gifts, COALESCE(SUM(amount_usd), 0) AS total FROM gift_pledges WHERE memorial_slug = ?",
    )
    .get(slug) as unknown as { gifts: number; total: number };
  return { gifts: row.gifts, total: row.total };
}

export function condolenceCount(slug: string): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS n FROM condolences WHERE memorial_slug = ?")
    .get(slug) as unknown as { n: number };
  return row.n;
}
