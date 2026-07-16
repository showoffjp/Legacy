import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/server/db";
import { createUser, findUserByEmail } from "@/lib/server/auth";
import { sendMessage } from "@/lib/server/notify";
import {
  listCoordinationRequests,
  type CoordinationRequestRow,
} from "@/lib/server/coordination";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";

/**
 * The partner portal — funeral homes and ministers sign in to receive and
 * confirm the coordination requests addressed to them.
 */

export type PartnerKind = "funeral-home" | "clergy";

export interface PartnerLink {
  user_id: string;
  kind: PartnerKind;
  ref_id: string;
  org_name: string;
}

export function getPartnerLink(userId: string): PartnerLink | null {
  const row = getDb()
    .prepare("SELECT user_id, kind, ref_id, org_name FROM partner_links WHERE user_id = ?")
    .get(userId) as unknown as PartnerLink | undefined;
  return row ?? null;
}

export interface PortalAccountRow extends PartnerLink {
  email: string;
  name: string;
}

export function listPortalAccounts(): PortalAccountRow[] {
  return getDb()
    .prepare(
      `SELECT p.user_id, p.kind, p.ref_id, p.org_name, u.email, u.name
       FROM partner_links p JOIN users u ON u.id = p.user_id
       ORDER BY p.org_name`,
    )
    .all() as unknown as PortalAccountRow[];
}

function friendlyTempPassword(): string {
  const words = ["still", "waters", "green", "pastures", "goodness", "mercy", "shepherd", "comfort"];
  const pick = () => words[randomBytes(1)[0] % words.length];
  return `${pick()}-${pick()}-${randomBytes(2).toString("hex")}`;
}

export interface InvitePartnerInput {
  kind: PartnerKind;
  refId: string;
  email: string;
  contactName: string;
}

export async function invitePartner(
  input: InvitePartnerInput,
): Promise<{ ok: boolean; error?: string }> {
  const entity =
    input.kind === "funeral-home" ? funeralHomeById(input.refId) : clergyById(input.refId);
  if (!entity) return { ok: false, error: "Choose which partner this account is for." };
  if (findUserByEmail(input.email)) {
    return { ok: false, error: "An account with that email already exists." };
  }

  const orgName = entity.name;
  const tempPassword = friendlyTempPassword();
  const user = createUser({
    email: input.email,
    name: input.contactName || orgName,
    password: tempPassword,
    role: "partner",
  });
  getDb()
    .prepare("INSERT INTO partner_links (user_id, kind, ref_id, org_name) VALUES (?, ?, ?, ?)")
    .run(user.id, input.kind, input.refId, orgName);

  await sendMessage({
    channel: "email",
    recipient: input.email,
    subject: `Your Legacy partner portal is ready — ${orgName}`,
    body: `Dear ${input.contactName || orgName},\n\nA Legacy coordinator has opened a partner portal for ${orgName}. Families' coordination requests addressed to you will arrive there, with every detail of the service they are planning.\n\nSign in at /account with:\n  Email: ${input.email}\n  Temporary password: ${tempPassword}\n\nPlease change your password after first sign-in. Thank you for serving grieving families with us.\n\nThe Legacy Care Team`,
    relatedType: "partner-application",
    relatedId: user.id,
  });

  return { ok: true };
}

/** The requests addressed to this partner, newest first. */
export function listRequestsForPartner(link: PartnerLink): CoordinationRequestRow[] {
  return listCoordinationRequests().filter((r) =>
    link.kind === "funeral-home" ? r.funeral_home_id === link.ref_id : r.clergy_id === link.ref_id,
  );
}
