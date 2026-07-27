import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The data layer, behind one async interface with two drivers:
 *
 * - **Embedded SQLite** (Node's built-in `node:sqlite`, zero native
 *   dependencies) — the default. The database lives in ./data
 *   (gitignored), or /tmp on serverless filesystems.
 * - **Hosted Postgres** — set `DATABASE_URL` (Neon, Supabase, RDS, any
 *   Postgres 14+) and every record becomes permanent across serverless
 *   cold starts. TLS is verified against system CAs.
 *
 * Statements are written once in SQLite-and-Postgres-compatible SQL
 * with `?` placeholders; the Postgres driver translates them to $n.
 */

export interface RunResult {
  changes: number;
}

export interface Db {
  run(sql: string, params?: unknown[]): Promise<RunResult>;
  get<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | undefined>;
  all<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
}

/**
 * Where SQLite and the session secret live. Overridable with
 * LEGACY_DATA_DIR. On Vercel (and similar read-only serverless
 * filesystems) we fall back to /tmp so previews run — /tmp is ephemeral
 * there, so real deployments should set DATABASE_URL (or use the
 * Dockerfile with a volume).
 */
export function dataDir(): string {
  if (process.env.LEGACY_DATA_DIR) return process.env.LEGACY_DATA_DIR;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return "/tmp/legacy-data";
  return join(process.cwd(), "data");
}

/* ——— Schema (shared dialect) ——— */

const SCHEMA = `
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'family',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data       TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plan_members (
      user_id  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      joined_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coordination_requests (
      id              TEXT PRIMARY KEY,
      reference       TEXT NOT NULL UNIQUE,
      user_id         TEXT,
      contact_name    TEXT NOT NULL,
      contact_email   TEXT NOT NULL,
      contact_phone   TEXT NOT NULL DEFAULT '',
      notes           TEXT NOT NULL DEFAULT '',
      plan_json       TEXT NOT NULL,
      funeral_home_id TEXT NOT NULL DEFAULT '',
      clergy_id       TEXT NOT NULL DEFAULT '',
      status          TEXT NOT NULL DEFAULT 'received',
      created_at      TEXT NOT NULL,
      updated_at      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS partner_applications (
      id           TEXT PRIMARY KEY,
      org_name     TEXT NOT NULL,
      category     TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email        TEXT NOT NULL,
      phone        TEXT NOT NULL DEFAULT '',
      city         TEXT NOT NULL DEFAULT '',
      state        TEXT NOT NULL DEFAULT '',
      zip          TEXT NOT NULL DEFAULT '',
      website      TEXT NOT NULL DEFAULT '',
      message      TEXT NOT NULL DEFAULT '',
      status       TEXT NOT NULL DEFAULT 'received',
      created_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id            TEXT PRIMARY KEY,
      reference     TEXT NOT NULL UNIQUE,
      user_id       TEXT,
      package_id    TEXT NOT NULL,
      package_name  TEXT NOT NULL,
      amount_usd    INTEGER NOT NULL,
      contact_name  TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      provider      TEXT NOT NULL DEFAULT 'demo',
      status        TEXT NOT NULL DEFAULT 'pending',
      created_at    TEXT NOT NULL,
      paid_at       TEXT
    );

    CREATE TABLE IF NOT EXISTS memorials (
      slug       TEXT PRIMARY KEY,
      owner_id   TEXT,
      data       TEXT NOT NULL,
      published  INTEGER NOT NULL DEFAULT 1,
      privacy    TEXT NOT NULL DEFAULT 'public',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS condolences (
      id            TEXT PRIMARY KEY,
      memorial_slug TEXT NOT NULL REFERENCES memorials(slug) ON DELETE CASCADE,
      name          TEXT NOT NULL,
      message       TEXT NOT NULL,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rsvps (
      id            TEXT PRIMARY KEY,
      memorial_slug TEXT NOT NULL REFERENCES memorials(slug) ON DELETE CASCADE,
      name          TEXT NOT NULL,
      attending     INTEGER NOT NULL DEFAULT 1,
      guests        INTEGER NOT NULL DEFAULT 1,
      note          TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS partner_links (
      user_id  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      kind     TEXT NOT NULL,
      ref_id   TEXT NOT NULL,
      org_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meal_offers (
      id            TEXT PRIMARY KEY,
      memorial_slug TEXT NOT NULL REFERENCES memorials(slug) ON DELETE CASCADE,
      name          TEXT NOT NULL,
      dish          TEXT NOT NULL,
      serves        INTEGER NOT NULL DEFAULT 8,
      note          TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS request_messages (
      id          TEXT PRIMARY KEY,
      request_id  TEXT NOT NULL REFERENCES coordination_requests(id) ON DELETE CASCADE,
      author_role TEXT NOT NULL,
      author_name TEXT NOT NULL,
      body        TEXT NOT NULL,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gift_pledges (
      id            TEXT PRIMARY KEY,
      memorial_slug TEXT NOT NULL REFERENCES memorials(slug) ON DELETE CASCADE,
      name          TEXT NOT NULL,
      amount_usd    INTEGER NOT NULL DEFAULT 0,
      note          TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id           TEXT PRIMARY KEY,
      channel      TEXT NOT NULL,
      recipient    TEXT NOT NULL,
      subject      TEXT NOT NULL DEFAULT '',
      body         TEXT NOT NULL,
      related_type TEXT NOT NULL DEFAULT '',
      related_id   TEXT NOT NULL DEFAULT '',
      status       TEXT NOT NULL DEFAULT 'queued',
      created_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS remembrances (
      id              TEXT PRIMARY KEY,
      user_id         TEXT,
      loved_one_name  TEXT NOT NULL,
      death_date      TEXT NOT NULL,
      recipient_name  TEXT NOT NULL,
      recipient_email TEXT NOT NULL,
      active          INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consulting_inquiries (
      id         TEXT PRIMARY KEY,
      reference  TEXT NOT NULL UNIQUE,
      name       TEXT NOT NULL,
      church     TEXT NOT NULL,
      email      TEXT NOT NULL,
      size       TEXT NOT NULL DEFAULT '',
      interest   TEXT NOT NULL DEFAULT '',
      message    TEXT NOT NULL DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'received',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS remembrance_events (
      id             TEXT PRIMARY KEY,
      remembrance_id TEXT NOT NULL REFERENCES remembrances(id) ON DELETE CASCADE,
      send_on        TEXT NOT NULL,
      title          TEXT NOT NULL,
      note           TEXT NOT NULL,
      verse_text     TEXT NOT NULL,
      verse_ref      TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'pending',
      sent_at        TEXT
    );
`;

/** Additive migrations for databases created before these columns existed. */
const ADDITIVE_COLUMNS: [table: string, columnDef: string][] = [
  ["memorials", "privacy TEXT NOT NULL DEFAULT 'public'"],
  ["plans", "share_code TEXT"],
  ["orders", "funding_json TEXT NOT NULL DEFAULT ''"],
];

/* ——— Driver: embedded SQLite (node:sqlite) ——— */

async function openSqlite(): Promise<Db> {
  const { DatabaseSync } = await import("node:sqlite");
  const dir = dataDir();
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(join(dir, "legacy.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  for (const [table, columnDef] of ADDITIVE_COLUMNS) {
    try {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
    } catch {
      // Column already exists — the migration has run before.
    }
  }
  return {
    run: async (sql, params = []) => {
      const result = db.prepare(sql).run(...(params as never[]));
      return { changes: Number(result.changes) };
    },
    get: async (sql, params = []) =>
      db.prepare(sql).get(...(params as never[])) as never,
    all: async (sql, params = []) =>
      db.prepare(sql).all(...(params as never[])) as never,
  };
}

/* ——— Driver: hosted Postgres (pg) ——— */

/** Translate `?` placeholders to Postgres $1..$n (quote-aware). */
export function toPgPlaceholders(sql: string): string {
  let n = 0;
  let out = "";
  let inSingle = false;
  for (const ch of sql) {
    if (ch === "'") inSingle = !inSingle;
    if (ch === "?" && !inSingle) {
      n += 1;
      out += `$${n}`;
    } else {
      out += ch;
    }
  }
  return out;
}

async function openPostgres(url: string): Promise<Db> {
  const { Pool, types } = await import("pg");
  // Counts come back as int8/numeric — hand JS a number, as SQLite does.
  types.setTypeParser(20, (v: string) => Number(v));
  types.setTypeParser(1700, (v: string) => Number(v));
  const pool = new Pool({
    connectionString: url,
    max: 3, // serverless-friendly: a few warm connections per instance
    // Hosted Postgres (Neon/Supabase/RDS) presents publicly-trusted
    // certificates; verify them against the system CA store.
    ssl: /\bsslmode=(require|verify-full|verify-ca)\b/.test(url) ? true : undefined,
  });
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await pool.query(statement);
  }
  for (const [table, columnDef] of ADDITIVE_COLUMNS) {
    try {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
    } catch {
      // Column already exists — the migration has run before.
    }
  }
  return {
    run: async (sql, params = []) => {
      const result = await pool.query(toPgPlaceholders(sql), params as never[]);
      return { changes: result.rowCount ?? 0 };
    },
    get: async (sql, params = []) => {
      const result = await pool.query(toPgPlaceholders(sql), params as never[]);
      return result.rows[0] as never;
    },
    all: async (sql, params = []) => {
      const result = await pool.query(toPgPlaceholders(sql), params as never[]);
      return result.rows as never;
    },
  };
}

/* ——— The singleton ——— */

declare global {
  // Survive Next.js dev-server hot reloads without reopening handles.
  var __legacyDbPromise: Promise<Db> | undefined;
}

export function getDb(): Promise<Db> {
  if (!globalThis.__legacyDbPromise) {
    const url = process.env.DATABASE_URL;
    globalThis.__legacyDbPromise = url ? openPostgres(url) : openSqlite();
    // If opening fails, allow the next request to retry rather than
    // caching the rejection forever.
    globalThis.__legacyDbPromise.catch(() => {
      globalThis.__legacyDbPromise = undefined;
    });
  }
  return globalThis.__legacyDbPromise;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Short, human-readable reference like LGCY-7K3FQ2 (no confusable chars). */
export function makeReference(prefix = "LGCY"): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${code}`;
}
