import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Embedded SQLite store (Node's built-in driver — no native deps).
 * The database lives in ./data, which is gitignored. Swapping this for
 * Postgres later only means reimplementing the helpers in lib/server/*.
 */

const DATA_DIR = join(process.cwd(), "data");

declare global {
  // Survive Next.js dev-server hot reloads without reopening handles.
  var __legacyDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(join(DATA_DIR, "legacy.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalThis.__legacyDb) {
    globalThis.__legacyDb = open();
  }
  return globalThis.__legacyDb;
}

function migrate(db: DatabaseSync): void {
  db.exec(`
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
  `);
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
