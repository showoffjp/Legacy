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
  /** Gallery photographs (downscaled data URLs, capped). */
  photos?: string[];
  service: {
    kind: string;
    date: string;
    time: string;
    venueName: string;
    city: string;
    state: string;
    livestream: boolean;
    /** Where to watch, when the family has a link (http/https only). */
    livestreamUrl?: string;
  } | null;
  /** They served — shown as an honor line on the page. */
  veteranBranch?: string;
}

/** Keep only web links — anything else is dropped rather than rendered. */
export function sanitizeLivestreamUrl(url: unknown): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim().slice(0, 500);
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : "";
  } catch {
    return "";
  }
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

async function slugTaken(slug: string): Promise<boolean> {
  if (MEMORIALS.some((m) => m.slug === slug)) return true;
  const db = await getDb();
  const row = await db.get("SELECT slug FROM memorials WHERE slug = ?", [slug]);
  return row !== undefined;
}

export async function publishMemorialFromPlan(
  plan: ServicePlan,
  ownerId: string | null,
): Promise<string> {
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
    ...(plan.deceased.veteran
      ? { veteranBranch: plan.deceased.veteranBranch.trim() || "Armed Forces" }
      : null),
    service: plan.service.kind
      ? {
          kind: plan.service.kind,
          date: plan.service.date,
          time: plan.service.time,
          venueName: plan.service.venueName,
          city: plan.service.location.city,
          state: plan.service.location.state,
          livestream: plan.service.livestream,
          livestreamUrl: sanitizeLivestreamUrl(plan.service.livestreamUrl),
        }
      : null,
  };

  let slug = slugify(data.fullName);
  while (await slugTaken(slug)) {
    slug = `${slugify(data.fullName)}-${shortSuffix()}`;
  }

  const now = nowIso();
  const db = await getDb();
  await db.run(
    "INSERT INTO memorials (slug, owner_id, data, published, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)",
    [slug, ownerId, JSON.stringify(data), now, now],
  );
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

export async function getPublishedMemorial(slug: string): Promise<PublishedMemorial | null> {
  const db = await getDb();
  const row = await db.get<MemorialRow>(
    "SELECT * FROM memorials WHERE slug = ? AND published = 1",
    [slug],
  );
  return row ? rowToMemorial(row) : null;
}

/** Publicly listed memorials — link-only pages stay reachable but unlisted. */
export async function listPublishedMemorials(limit = 50): Promise<PublishedMemorial[]> {
  const db = await getDb();
  const rows = await db.all<MemorialRow>(
    "SELECT * FROM memorials WHERE published = 1 AND privacy = 'public' ORDER BY created_at DESC LIMIT ?",
    [limit],
  );
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

/** Every published memorial regardless of privacy — for the coordinator console. */
export async function listAllPublishedMemorials(limit = 100): Promise<PublishedMemorial[]> {
  const db = await getDb();
  const rows = await db.all<MemorialRow>(
    "SELECT * FROM memorials WHERE published = 1 ORDER BY created_at DESC LIMIT ?",
    [limit],
  );
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

export async function listMemorialsForOwner(ownerId: string): Promise<PublishedMemorial[]> {
  const db = await getDb();
  const rows = await db.all<MemorialRow>(
    "SELECT * FROM memorials WHERE owner_id = ? ORDER BY created_at DESC",
    [ownerId],
  );
  return rows.map(rowToMemorial).filter((m): m is PublishedMemorial => m !== null);
}

/** Coordinator moderation: hide a published memorial (content is retained). */
export async function unpublishMemorial(slug: string): Promise<void> {
  const db = await getDb();
  await db.run("UPDATE memorials SET published = 0, updated_at = ? WHERE slug = ?", [
    nowIso(),
    slug,
  ]);
}

export async function getMemorialForOwner(
  slug: string,
  ownerId: string,
): Promise<PublishedMemorial | null> {
  const db = await getDb();
  const row = await db.get<MemorialRow>(
    "SELECT * FROM memorials WHERE slug = ? AND owner_id = ? AND published = 1",
    [slug, ownerId],
  );
  return row ? rowToMemorial(row) : null;
}

export interface OwnerMemorialPatch {
  story?: string[];
  survivedBy?: string;
  nickname?: string;
  locationText?: string;
  giftsNote?: string;
  photos?: string[];
  service?: PublishedMemorialData["service"];
  privacy?: MemorialPrivacy;
}

const MAX_GALLERY_PHOTOS = 8;
const MAX_PHOTO_BYTES = 400_000;

/** Keep only well-formed, reasonably sized gallery images. */
export function sanitizeGalleryPhotos(photos: unknown): string[] {
  if (!Array.isArray(photos)) return [];
  return photos
    .filter(
      (p): p is string =>
        typeof p === "string" && p.startsWith("data:image/") && p.length <= MAX_PHOTO_BYTES,
    )
    .slice(0, MAX_GALLERY_PHOTOS);
}

/** Owner editing — merges content into the stored page. */
export async function updateMemorialByOwner(
  slug: string,
  ownerId: string,
  patch: OwnerMemorialPatch,
): Promise<boolean> {
  const memorial = await getMemorialForOwner(slug, ownerId);
  if (!memorial) return false;
  const data: PublishedMemorialData = {
    ...memorial.data,
    ...(patch.story !== undefined ? { story: patch.story } : null),
    ...(patch.survivedBy !== undefined ? { survivedBy: patch.survivedBy } : null),
    ...(patch.nickname !== undefined ? { nickname: patch.nickname } : null),
    ...(patch.locationText !== undefined ? { locationText: patch.locationText } : null),
    ...(patch.giftsNote !== undefined ? { giftsNote: patch.giftsNote } : null),
    ...(patch.photos !== undefined ? { photos: sanitizeGalleryPhotos(patch.photos) } : null),
    ...(patch.service !== undefined ? { service: patch.service } : null),
  };
  const db = await getDb();
  await db.run("UPDATE memorials SET data = ?, privacy = ?, updated_at = ? WHERE slug = ?", [
    JSON.stringify(data),
    patch.privacy ?? memorial.privacy,
    nowIso(),
    slug,
  ]);
  return true;
}

export async function unpublishMemorialByOwner(slug: string, ownerId: string): Promise<boolean> {
  const memorial = await getMemorialForOwner(slug, ownerId);
  if (!memorial) return false;
  await unpublishMemorial(slug);
  return true;
}

/* ——— Condolences ——— */

export async function addCondolence(
  slug: string,
  name: string,
  message: string,
): Promise<CondolenceRow> {
  const id = randomUUID();
  const now = nowIso();
  const db = await getDb();
  await db.run(
    "INSERT INTO condolences (id, memorial_slug, name, message, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, slug, name, message, now],
  );
  return { id, memorial_slug: slug, name, message, created_at: now };
}

export async function listCondolences(slug: string): Promise<CondolenceRow[]> {
  const db = await getDb();
  return db.all<CondolenceRow>(
    "SELECT * FROM condolences WHERE memorial_slug = ? ORDER BY created_at DESC",
    [slug],
  );
}

/* ——— RSVPs ——— */

export async function addRsvp(input: {
  slug: string;
  name: string;
  attending: boolean;
  guests: number;
  note: string;
}): Promise<RsvpRow> {
  const id = randomUUID();
  const now = nowIso();
  const guests = Math.max(1, Math.min(20, Math.round(input.guests)));
  const db = await getDb();
  await db.run(
    "INSERT INTO rsvps (id, memorial_slug, name, attending, guests, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, input.slug, input.name, input.attending ? 1 : 0, guests, input.note, now],
  );
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

export async function rsvpSummary(slug: string): Promise<{ families: number; guests: number }> {
  const db = await getDb();
  const row = await db.get<{ families: number; guests: number }>(
    "SELECT COUNT(*) AS families, COALESCE(SUM(guests), 0) AS guests FROM rsvps WHERE memorial_slug = ? AND attending = 1",
    [slug],
  );
  return { families: row?.families ?? 0, guests: row?.guests ?? 0 };
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

export async function addMealOffer(input: {
  slug: string;
  name: string;
  dish: string;
  serves: number;
  note: string;
}): Promise<MealOfferRow> {
  const id = randomUUID();
  const now = nowIso();
  const serves = Math.max(1, Math.min(100, Math.round(input.serves)));
  const db = await getDb();
  await db.run(
    "INSERT INTO meal_offers (id, memorial_slug, name, dish, serves, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, input.slug, input.name, input.dish, serves, input.note, now],
  );
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

export async function listMealOffers(slug: string): Promise<MealOfferRow[]> {
  const db = await getDb();
  return db.all<MealOfferRow>(
    "SELECT * FROM meal_offers WHERE memorial_slug = ? ORDER BY created_at ASC",
    [slug],
  );
}

export async function mealSummary(slug: string): Promise<{ dishes: number; serves: number }> {
  const db = await getDb();
  const row = await db.get<{ dishes: number; serves: number }>(
    "SELECT COUNT(*) AS dishes, COALESCE(SUM(serves), 0) AS serves FROM meal_offers WHERE memorial_slug = ?",
    [slug],
  );
  return { dishes: row?.dishes ?? 0, serves: row?.serves ?? 0 };
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

export async function addGiftPledge(input: {
  slug: string;
  name: string;
  amountUsd: number;
  note: string;
}): Promise<GiftPledgeRow> {
  const id = randomUUID();
  const now = nowIso();
  const amount = Math.max(0, Math.min(100_000, Math.round(input.amountUsd)));
  const db = await getDb();
  await db.run(
    "INSERT INTO gift_pledges (id, memorial_slug, name, amount_usd, note, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, input.slug, input.name, amount, input.note, now],
  );
  return { id, memorial_slug: input.slug, name: input.name, amount_usd: amount, note: input.note, created_at: now };
}

export async function listGiftPledges(slug: string): Promise<GiftPledgeRow[]> {
  const db = await getDb();
  return db.all<GiftPledgeRow>(
    "SELECT * FROM gift_pledges WHERE memorial_slug = ? ORDER BY created_at DESC",
    [slug],
  );
}

export async function giftSummary(slug: string): Promise<{ gifts: number; total: number }> {
  const db = await getDb();
  const row = await db.get<{ gifts: number; total: number }>(
    "SELECT COUNT(*) AS gifts, COALESCE(SUM(amount_usd), 0) AS total FROM gift_pledges WHERE memorial_slug = ?",
    [slug],
  );
  return { gifts: row?.gifts ?? 0, total: row?.total ?? 0 };
}

export async function condolenceCount(slug: string): Promise<number> {
  const db = await getDb();
  const row = await db.get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM condolences WHERE memorial_slug = ?",
    [slug],
  );
  return row?.n ?? 0;
}
