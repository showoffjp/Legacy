import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/server/db";
import type { User } from "@/lib/server/auth";
import { getPartnerLink } from "@/lib/server/portal";
import type { CoordinationRequestRow } from "@/lib/server/coordination";

/**
 * The conversation that travels with a coordination request — one thread
 * shared by the family, the partner serving them, and the coordinator.
 */

export interface RequestMessageRow {
  id: string;
  request_id: string;
  author_role: "family" | "coordinator" | "partner";
  author_name: string;
  body: string;
  created_at: string;
}

async function getRequest(requestId: string): Promise<CoordinationRequestRow | null> {
  const db = await getDb();
  const row = await db.get<CoordinationRequestRow>(
    "SELECT * FROM coordination_requests WHERE id = ?",
    [requestId],
  );
  return row ?? null;
}

/** May this user read and write on this request's thread? */
export async function canAccessRequest(user: User, requestId: string): Promise<boolean> {
  const request = await getRequest(requestId);
  if (!request) return false;
  if (user.role === "coordinator") return true;
  if (user.role === "family") return request.user_id === user.id;
  if (user.role === "partner") {
    const link = await getPartnerLink(user.id);
    if (!link) return false;
    return link.kind === "funeral-home"
      ? request.funeral_home_id === link.ref_id
      : request.clergy_id === link.ref_id;
  }
  return false;
}

export async function listRequestMessages(requestId: string): Promise<RequestMessageRow[]> {
  const db = await getDb();
  return db.all<RequestMessageRow>(
    "SELECT * FROM request_messages WHERE request_id = ? ORDER BY created_at ASC",
    [requestId],
  );
}

export async function addRequestMessage(input: {
  requestId: string;
  authorRole: RequestMessageRow["author_role"];
  authorName: string;
  body: string;
}): Promise<RequestMessageRow> {
  const id = randomUUID();
  const now = nowIso();
  const db = await getDb();
  await db.run(
    "INSERT INTO request_messages (id, request_id, author_role, author_name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, input.requestId, input.authorRole, input.authorName, input.body, now],
  );
  return {
    id,
    request_id: input.requestId,
    author_role: input.authorRole,
    author_name: input.authorName,
    body: input.body,
    created_at: now,
  };
}
