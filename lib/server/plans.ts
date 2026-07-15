import { getDb, nowIso } from "@/lib/server/db";

interface PlanRow {
  user_id: string;
  data: string;
  updated_at: string;
}

export function getPlanForUser(userId: string): { data: unknown; updatedAt: string } | null {
  const row = getDb()
    .prepare("SELECT user_id, data, updated_at FROM plans WHERE user_id = ?")
    .get(userId) as unknown as PlanRow | undefined;
  if (!row) return null;
  try {
    return { data: JSON.parse(row.data), updatedAt: row.updated_at };
  } catch {
    return null;
  }
}

export function upsertPlanForUser(userId: string, data: unknown): string {
  const updatedAt = nowIso();
  getDb()
    .prepare(
      `INSERT INTO plans (user_id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .run(userId, JSON.stringify(data), updatedAt);
  return updatedAt;
}
