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
  relatedType?: "coordination" | "order" | "partner-application" | "remembrance";
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

type DeliveryStatus = "sent" | "queued" | "failed";

interface Transport {
  name: string;
  deliver(msg: OutgoingMessage): Promise<DeliveryStatus>;
}

/** Demo transport: the outbox row itself is the delivery record. */
const outboxOnly: Transport = {
  name: "outbox",
  deliver: async () => "queued",
};

/** Resend (https://resend.com) — live email when RESEND_API_KEY is set. */
async function deliverEmail(msg: OutgoingMessage): Promise<DeliveryStatus> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "queued";
  // Placeholder partner addresses stay in the outbox — nothing real to reach.
  if (msg.recipient.endsWith(".example.com") || msg.recipient.endsWith("@legacy.example")) {
    return "queued";
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Legacy <onboarding@resend.dev>",
        to: [msg.recipient],
        subject: msg.subject || "A message from Legacy",
        text: msg.body,
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** Twilio — live SMS when TWILIO_ACCOUNT_SID/AUTH_TOKEN/FROM are set. */
async function deliverSms(msg: OutgoingMessage): Promise<DeliveryStatus> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return "queued";
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: msg.recipient, Body: msg.body }).toString(),
      },
    );
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

const liveTransport: Transport = {
  name: "live",
  deliver: (msg) => (msg.channel === "email" ? deliverEmail(msg) : deliverSms(msg)),
};

function getTransport(): Transport {
  const emailLive = Boolean(process.env.RESEND_API_KEY);
  const smsLive = Boolean(process.env.TWILIO_ACCOUNT_SID);
  return emailLive || smsLive ? liveTransport : outboxOnly;
}

export async function sendMessage(msg: OutgoingMessage): Promise<string> {
  const status = await getTransport().deliver(msg);
  const id = randomUUID();
  const db = await getDb();
  await db.run(
    `INSERT INTO messages (id, channel, recipient, subject, body, related_type, related_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      msg.channel,
      msg.recipient,
      msg.subject ?? "",
      msg.body,
      msg.relatedType ?? "",
      msg.relatedId ?? "",
      status,
      nowIso(),
    ],
  );
  return id;
}

export async function listMessages(limit = 100): Promise<MessageRow[]> {
  const db = await getDb();
  return db.all<MessageRow>("SELECT * FROM messages ORDER BY created_at DESC LIMIT ?", [limit]);
}
