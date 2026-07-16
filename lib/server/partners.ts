import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";

export type ApplicationStatus = "received" | "reviewing" | "approved" | "declined";

export const PARTNER_CATEGORIES = [
  "funeral-home",
  "clergy",
  "florist",
  "casket-provider",
  "monument",
  "catering",
  "livestream",
  "transportation",
  "musicians",
  "cemetery",
  "grief-support",
  "legal",
  "lodging",
  "keepsakes",
] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export interface PartnerApplicationRow {
  id: string;
  org_name: string;
  category: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  message: string;
  status: string;
  created_at: string;
}

export interface PartnerApplicationInput {
  orgName: string;
  category: PartnerCategory;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  message: string;
}

export async function createPartnerApplication(
  input: PartnerApplicationInput,
): Promise<string> {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO partner_applications
         (id, org_name, category, contact_name, email, phone, city, state, zip, website, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?)`,
    )
    .run(
      id,
      input.orgName,
      input.category,
      input.contactName,
      input.email,
      input.phone,
      input.city,
      input.state,
      input.zip,
      input.website,
      input.message,
      nowIso(),
    );

  await sendMessage({
    channel: "email",
    recipient: input.email,
    subject: `Thank you for applying to the Legacy partner network`,
    body: `Dear ${input.contactName},\n\nThank you — we have received ${input.orgName}'s application to join the Legacy trusted partner network. Our care team reviews every application personally: licensing, references, and above all a heart for serving grieving families with dignity.\n\nWe will be in touch within two business days.\n\nWith gratitude,\nThe Legacy Care Team`,
    relatedType: "partner-application",
    relatedId: id,
  });

  return id;
}

export function listPartnerApplications(): PartnerApplicationRow[] {
  return getDb()
    .prepare("SELECT * FROM partner_applications ORDER BY created_at DESC")
    .all() as unknown as PartnerApplicationRow[];
}

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "received",
  "reviewing",
  "approved",
  "declined",
];

export function setApplicationStatus(id: string, status: string): boolean {
  if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) return false;
  getDb()
    .prepare("UPDATE partner_applications SET status = ? WHERE id = ?")
    .run(status, id);
  return true;
}
