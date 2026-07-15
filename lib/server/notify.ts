import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/server/db";

/**
 * Outgoing family/partner messaging.
 *
 * Every message is recorded in the `messages` outbox table, which the
 * coordinator console displays. Delivery is pluggable: the default
 * transport only records (demo mode); an SMTP or Twilio transport can be
 * added by implementing `Transport` and selecting it from environment
 * configuration — the call sites never change.
 */

export interface OutgoingMessage {
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
  body: string;
  relatedType?: "coordination" | "order" | "partner-application";
  relatedId?: string;
}

export interface MessageRow {
  id: string;
  channel: string;
  recipient: string;
  subject: string;
  body: string;
  related_type: string;
  related_id: string;
  status: string;
  created_at: string;
}

interface Transport {
  name: string;
  deliver(msg: OutgoingMessage): Promise<"sent" | "queued">;
}

/** Demo transport: the outbox row itself is the delivery record. */
const outboxOnly: Transport = {
  name: "outbox",
  deliver: async () => "queued",
};

function getTransport(): Transport {
  // Future: return an SMTP/Twilio transport when credentials are configured
  // (e.g. SMTP_URL / TWILIO_AUTH_TOKEN). Demo builds record to the outbox.
  return outboxOnly;
}

export async function sendMessage(msg: OutgoingMessage): Promise<string> {
  const status = await getTransport().deliver(msg);
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO messages (id, channel, recipient, subject, body, related_type, related_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      msg.channel,
      msg.recipient,
      msg.subject ?? "",
      msg.body,
      msg.relatedType ?? "",
      msg.relatedId ?? "",
      status,
      nowIso(),
    );
  return id;
}

export function listMessages(limit = 100): MessageRow[] {
  return getDb()
    .prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT ?")
    .all(limit) as unknown as MessageRow[];
}
