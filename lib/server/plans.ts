import { getDb, nowIso } from "@/lib/server/db";
import { EMPTY_PLAN } from "@/lib/types";

interface PlanRow {
  user_id: string;
  data: string;
  updated_at: string;
  share_code: string | null;
}

/**
 * Plans can be carried together: the plan's owner shares a family code,
 * and members' reads and writes resolve to the owner's plan row.
 */

/** The user whose plan row this user reads and writes (self, or the owner they joined). */
export function resolvePlanOwner(userId: string): string {
  const membership = getDb()
    .prepare("SELECT owner_id FROM plan_members WHERE user_id = ?")
    .get(userId) as unknown as { owner_id: string } | undefined;
  return membership?.owner_id ?? userId;
}

export function getPlanForUser(userId: string): { data: unknown; updatedAt: string } | null {
  const ownerId = resolvePlanOwner(userId);
  const row = getDb()
    .prepare("SELECT user_id, data, updated_at, share_code FROM plans WHERE user_id = ?")
    .get(ownerId) as unknown as PlanRow | undefined;
  if (!row) return null;
  try {
    return { data: JSON.parse(row.data), updatedAt: row.updated_at };
  } catch {
    return null;
  }
}

export function upsertPlanForUser(userId: string, data: unknown): string {
  const ownerId = resolvePlanOwner(userId);
  const updatedAt = nowIso();
  getDb()
    .prepare(
      `INSERT INTO plans (user_id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .run(ownerId, JSON.stringify(data), updatedAt);
  return updatedAt;
}

/* ——— Planning together ——— */

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function makeShareCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `FAM-${code}`;
}

/** The family code for this owner's plan, created (with the plan row) if needed. */
export function getOrCreateShareCode(ownerId: string): string {
  const db = getDb();
  const row = db
    .prepare("SELECT share_code FROM plans WHERE user_id = ?")
    .get(ownerId) as unknown as { share_code: string | null } | undefined;
  if (row?.share_code) return row.share_code;

  const code = makeShareCode();
  if (row) {
    db.prepare("UPDATE plans SET share_code = ? WHERE user_id = ?").run(code, ownerId);
  } else {
    db.prepare(
      "INSERT INTO plans (user_id, data, updated_at, share_code) VALUES (?, ?, ?, ?)",
    ).run(ownerId, JSON.stringify(EMPTY_PLAN), nowIso(), code);
  }
  return code;
}

export function joinPlanByCode(
  userId: string,
  code: string,
): { ok: boolean; error?: string } {
  const db = getDb();
  const owner = db
    .prepare("SELECT user_id FROM plans WHERE share_code = ?")
    .get(code.trim().toUpperCase()) as unknown as { user_id: string } | undefined;
  if (!owner) return { ok: false, error: "That family code was not found — check it and try again." };
  if (owner.user_id === userId) {
    return { ok: false, error: "That is your own plan's code — share it with family instead." };
  }
  db.prepare(
    `INSERT INTO plan_members (user_id, owner_id, joined_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET owner_id = excluded.owner_id, joined_at = excluded.joined_at`,
  ).run(userId, owner.user_id, nowIso());
  return { ok: true };
}

export function leaveSharedPlan(userId: string): void {
  getDb().prepare("DELETE FROM plan_members WHERE user_id = ?").run(userId);
}

export interface PlanMemberInfo {
  email: string;
  name: string;
}

/** Who has joined this owner's plan. */
export function listPlanMembers(ownerId: string): PlanMemberInfo[] {
  return getDb()
    .prepare(
      `SELECT u.email, u.name FROM plan_members m JOIN users u ON u.id = m.user_id
       WHERE m.owner_id = ? ORDER BY m.joined_at`,
    )
    .all(ownerId) as unknown as PlanMemberInfo[];
}

/** The owner this user has joined, if any. */
export function joinedPlanOwner(userId: string): PlanMemberInfo | null {
  const row = getDb()
    .prepare(
      `SELECT u.email, u.name FROM plan_members m JOIN users u ON u.id = m.owner_id
       WHERE m.user_id = ?`,
    )
    .get(userId) as unknown as PlanMemberInfo | undefined;
  return row ?? null;
}
