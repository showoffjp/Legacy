import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cookies } from "next/headers";
import { dataDir, getDb, nowIso } from "@/lib/server/db";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "family" | "coordinator" | "partner";
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
}

const SESSION_COOKIE = "legacy_session";
const SESSION_DAYS = 30;

/* ——— Secret management ——— */

let cachedSecret: Buffer | null = null;

/** HMAC secret from env, or generated once and kept beside the database. */
function getSecret(): Buffer {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env.LEGACY_SECRET;
  if (fromEnv) {
    cachedSecret = Buffer.from(fromEnv, "utf8");
    return cachedSecret;
  }
  const dir = dataDir();
  const file = join(dir, ".session-secret");
  try {
    cachedSecret = readFileSync(file);
  } catch {
    mkdirSync(dir, { recursive: true });
    cachedSecret = randomBytes(32);
    writeFileSync(file, cachedSecret, { mode: 0o600 });
  }
  return cachedSecret;
}

/* ——— Passwords ——— */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/* ——— Session tokens: userId.expiresEpoch.signature ——— */

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function makeToken(userId: string): string {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, sig] = parts;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;
  return userId;
}

/* ——— Cookie helpers (server actions / route handlers only) ——— */

export async function createSessionCookie(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    // Set COOKIE_SECURE=1 behind HTTPS in production deployments.
    secure: process.env.COOKIE_SECURE === "1",
  });
}

export async function destroySessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

function toUser(row: UserRow): User {
  const role =
    row.role === "coordinator" || row.role === "partner" ? row.role : "family";
  return { id: row.id, email: row.email, name: row.name, role };
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = readToken(token);
  if (!userId) return null;
  const db = await getDb();
  const row = await db.get<UserRow>(
    "SELECT id, email, name, password_hash, role FROM users WHERE id = ?",
    [userId],
  );
  return row ? toUser(row) : null;
}

/* ——— User accounts ——— */

export async function findUserByEmail(
  email: string,
): Promise<(User & { passwordHash: string }) | null> {
  const db = await getDb();
  const row = await db.get<UserRow>(
    "SELECT id, email, name, password_hash, role FROM users WHERE email = ?",
    [email.trim().toLowerCase()],
  );
  if (!row) return null;
  return { ...toUser(row), passwordHash: row.password_hash };
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role?: User["role"];
}): Promise<User> {
  const db = await getDb();
  const id = randomUUID();
  await db.run(
    "INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id,
      input.email.trim().toLowerCase(),
      input.name.trim(),
      hashPassword(input.password),
      input.role ?? "family",
      nowIso(),
    ],
  );
  return { id, email: input.email.trim().toLowerCase(), name: input.name.trim(), role: input.role ?? "family" };
}

/** Verify the current password and set a new one. */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const db = await getDb();
  const row = await db.get<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = ?",
    [userId],
  );
  if (!row) return { ok: false, error: "Account not found." };
  if (!verifyPassword(currentPassword, row.password_hash)) {
    return { ok: false, error: "Your current password does not match our records." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "Please choose a new password of at least 8 characters." };
  }
  await db.run("UPDATE users SET password_hash = ? WHERE id = ?", [
    hashPassword(newPassword),
    userId,
  ]);
  return { ok: true };
}

/**
 * Seed the demo coordinator account on first use so the console at /admin
 * is reachable out of the box. Documented in the README.
 */
export async function ensureCoordinatorSeeded(): Promise<void> {
  const db = await getDb();
  const existing = await db.get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM users WHERE role = 'coordinator'",
  );
  if ((existing?.n ?? 0) > 0) return;
  await createUser({
    email: "coordinator@legacy.example",
    name: "Legacy Coordinator",
    password: process.env.LEGACY_ADMIN_PASSWORD || "walk-beside-families",
    role: "coordinator",
  });
}
