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
  const db = await getDb();
  await db.run(
    `INSERT INTO partner_applications
       (id, org_name, category, contact_name, email, phone, city, state, zip, website, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?)`,
    [
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
    ],
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

export async function listPartnerApplications(): Promise<PartnerApplicationRow[]> {
  const db = await getDb();
  return db.all<PartnerApplicationRow>(
    "SELECT * FROM partner_applications ORDER BY created_at DESC",
  );
}

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "received",
  "reviewing",
  "approved",
  "declined",
];

export async function setApplicationStatus(id: string, status: string): Promise<boolean> {
  if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) return false;
  const db = await getDb();
  await db.run("UPDATE partner_applications SET status = ? WHERE id = ?", [status, id]);
  return true;
}
