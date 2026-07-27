import { randomUUID } from "node:crypto";
import { getDb, makeReference, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";
import { INQUIRY_EMAIL } from "@/lib/consulting";

/**
 * Steward AI discovery-call inquiries. Each one is stored, the practice
 * inbox is notified, and the church receives a short acknowledgment —
 * all through the same outbox rails the rest of the site uses, so
 * nothing is lost even before RESEND_API_KEY is configured.
 */

export interface ConsultingInquiryRow {
  id: string;
  reference: string;
  name: string;
  church: string;
  email: string;
  size: string;
  interest: string;
  message: string;
  status: string;
  created_at: string;
}

function inboxEmail(): string {
  return process.env.CONSULTING_INQUIRY_EMAIL || INQUIRY_EMAIL;
}

export async function createConsultingInquiry(input: {
  name: string;
  church: string;
  email: string;
  size: string;
  interest: string;
  message: string;
}): Promise<{ id: string; reference: string }> {
  const id = randomUUID();
  const reference = makeReference("STWD");
  const now = nowIso();
  const db = await getDb();
  await db.run(
    `INSERT INTO consulting_inquiries (id, reference, name, church, email, size, interest, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received', ?)`,
    [id, reference, input.name, input.church, input.email, input.size, input.interest, input.message, now],
  );

  await sendMessage({
    channel: "email",
    recipient: inboxEmail(),
    subject: `New church inquiry — ${input.church} (${reference})`,
    body: [
      `Name: ${input.name}`,
      `Church: ${input.church}`,
      `Email: ${input.email}`,
      `Size: ${input.size}`,
      `Interested in: ${input.interest}`,
      "",
      input.message || "(no message)",
    ].join("\n"),
    relatedType: "consulting-inquiry",
    relatedId: id,
  });

  await sendMessage({
    channel: "email",
    recipient: input.email,
    subject: `We received your note (${reference}) — Steward AI`,
    body: [
      `Dear ${input.name},`,
      "",
      `Thank you for reaching out on behalf of ${input.church}. Your inquiry (${reference}) has reached us, and a real person will reply within two business days.`,
      "",
      `Until then, our free church AI policy template is yours to adapt — and if anything is urgent, write us directly at ${inboxEmail()}.`,
      "",
      '"If any of you lacks wisdom, let him ask of God." — James 1:5',
      "",
      "With care,",
      "Steward AI",
    ].join("\n"),
    relatedType: "consulting-inquiry",
    relatedId: id,
  });

  return { id, reference };
}

export async function listConsultingInquiries(limit = 100): Promise<ConsultingInquiryRow[]> {
  const db = await getDb();
  return db.all<ConsultingInquiryRow>(
    "SELECT * FROM consulting_inquiries ORDER BY created_at DESC LIMIT ?",
    [limit],
  );
}
