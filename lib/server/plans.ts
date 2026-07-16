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
export async function resolvePlanOwner(userId: string): Promise<string> {
  const db = await getDb();
  const membership = await db.get<{ owner_id: string }>(
    "SELECT owner_id FROM plan_members WHERE user_id = ?",
    [userId],
  );
  return membership?.owner_id ?? userId;
}

export async function getPlanForUser(
  userId: string,
): Promise<{ data: unknown; updatedAt: string } | null> {
  const ownerId = await resolvePlanOwner(userId);
  const db = await getDb();
  const row = await db.get<PlanRow>(
    "SELECT user_id, data, updated_at, share_code FROM plans WHERE user_id = ?",
    [ownerId],
  );
  if (!row) return null;
  try {
    return { data: JSON.parse(row.data), updatedAt: row.updated_at };
  } catch {
    return null;
  }
}

export async function upsertPlanForUser(userId: string, data: unknown): Promise<string> {
  const ownerId = await resolvePlanOwner(userId);
  const updatedAt = nowIso();
  const db = await getDb();
  await db.run(
    `INSERT INTO plans (user_id, data, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    [ownerId, JSON.stringify(data), updatedAt],
  );
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
export async function getOrCreateShareCode(ownerId: string): Promise<string> {
  const db = await getDb();
  const row = await db.get<{ share_code: string | null }>(
    "SELECT share_code FROM plans WHERE user_id = ?",
    [ownerId],
  );
  if (row?.share_code) return row.share_code;

  const code = makeShareCode();
  if (row) {
    await db.run("UPDATE plans SET share_code = ? WHERE user_id = ?", [code, ownerId]);
  } else {
    await db.run(
      "INSERT INTO plans (user_id, data, updated_at, share_code) VALUES (?, ?, ?, ?)",
      [ownerId, JSON.stringify(EMPTY_PLAN), nowIso(), code],
    );
  }
  return code;
}

export async function joinPlanByCode(
  userId: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const db = await getDb();
  const owner = await db.get<{ user_id: string }>(
    "SELECT user_id FROM plans WHERE share_code = ?",
    [code.trim().toUpperCase()],
  );
  if (!owner) return { ok: false, error: "That family code was not found — check it and try again." };
  if (owner.user_id === userId) {
    return { ok: false, error: "That is your own plan's code — share it with family instead." };
  }
  await db.run(
    `INSERT INTO plan_members (user_id, owner_id, joined_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET owner_id = excluded.owner_id, joined_at = excluded.joined_at`,
    [userId, owner.user_id, nowIso()],
  );
  return { ok: true };
}

export async function leaveSharedPlan(userId: string): Promise<void> {
  const db = await getDb();
  await db.run("DELETE FROM plan_members WHERE user_id = ?", [userId]);
}

export interface PlanMemberInfo {
  email: string;
  name: string;
}

/** Who has joined this owner's plan. */
export async function listPlanMembers(ownerId: string): Promise<PlanMemberInfo[]> {
  const db = await getDb();
  return db.all<PlanMemberInfo>(
    `SELECT u.email, u.name FROM plan_members m JOIN users u ON u.id = m.user_id
     WHERE m.owner_id = ? ORDER BY m.joined_at`,
    [ownerId],
  );
}

/** The owner this user has joined, if any. */
export async function joinedPlanOwner(userId: string): Promise<PlanMemberInfo | null> {
  const db = await getDb();
  const row = await db.get<PlanMemberInfo>(
    `SELECT u.email, u.name FROM plan_members m JOIN users u ON u.id = m.owner_id
     WHERE m.user_id = ?`,
    [userId],
  );
  return row ?? null;
}
