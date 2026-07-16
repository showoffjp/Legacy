import { randomUUID } from "node:crypto";
import { getDb, makeReference, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { clergyById } from "@/lib/data/clergy";
import type { ServicePlan } from "@/lib/types";

export type RequestStatus = "received" | "confirmed" | "in-progress" | "completed";

export interface CoordinationRequestRow {
  id: string;
  reference: string;
  user_id: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  notes: string;
  plan_json: string;
  funeral_home_id: string;
  clergy_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCoordinationInput {
  userId: string | null;
  contact: { name: string; email: string; phone: string };
  notes: string;
  plan: ServicePlan;
}

/**
 * Record a family's request and queue the messages that put their plan in
 * front of the right people — the funeral home, the minister, and a
 * confirmation back to the family.
 */
export async function createCoordinationRequest(
  input: CreateCoordinationInput,
): Promise<{ id: string; reference: string }> {
  const db = await getDb();
  const id = randomUUID();
  const reference = makeReference();
  const now = nowIso();
  const home = funeralHomeById(input.plan.funeralHomeId);
  const minister = clergyById(input.plan.clergyId);
  const family = input.plan.deceased.fullName || "the family's loved one";

  // Keep the stored plan light — the portrait can be megabytes of data URL.
  const planForStorage: ServicePlan = {
    ...input.plan,
    deceased: { ...input.plan.deceased, portraitDataUrl: "" },
  };

  await db.run(
    `INSERT INTO coordination_requests
       (id, reference, user_id, contact_name, contact_email, contact_phone, notes,
        plan_json, funeral_home_id, clergy_id, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`,
    [
      id,
      reference,
      input.userId,
      input.contact.name,
      input.contact.email,
      input.contact.phone,
      input.notes,
      JSON.stringify(planForStorage),
      input.plan.funeralHomeId,
      input.plan.clergyId,
      now,
      now,
    ],
  );

  const when = [input.plan.service.date, input.plan.service.time].filter(Boolean).join(" at ");
  const where = [
    input.plan.service.venueName,
    input.plan.service.location.city,
    input.plan.service.location.state,
  ]
    .filter(Boolean)
    .join(", ");

  const veteranNote = input.plan.deceased.veteran
    ? `\n\n${family} served in the ${input.plan.deceased.veteranBranch || "armed forces"} — the family asks that veteran honors (flag presentation, Taps, honor guard) be arranged. Legacy will assist with the DD-214 and VA paperwork.`
    : "";

  if (home) {
    await sendMessage({
      channel: "email",
      recipient: `care@${home.website.replace(/^https?:\/\//, "")}`,
      subject: `New service coordination request ${reference} — ${family}`,
      body: `Dear ${home.name},\n\nA family has asked Legacy to coordinate a service for ${family}${when ? ` on ${when}` : ""}${where ? ` (${where})` : ""}. The full plan — service type, casket, flowers, music, and readings — is attached in the coordinator console under reference ${reference}.${veteranNote}\n\nFamily contact: ${input.contact.name}, ${input.contact.email}${input.contact.phone ? `, ${input.contact.phone}` : ""}.\n\nA Legacy coordinator will call you within the hour to confirm receipt.\n\nWith gratitude for your care,\nLegacy Coordination`,
      relatedType: "coordination",
      relatedId: id,
    });
  }

  if (minister) {
    await sendMessage({
      channel: "email",
      recipient: minister.email,
      subject: `Request to officiate — ${family} (${reference})`,
      body: `Dear ${minister.name},\n\nA family has asked whether you would lead the service for ${family}${when ? ` on ${when}` : ""}${where ? ` at ${where}` : ""}. Their chosen hymns and readings are gathered under reference ${reference} in the coordinator console.\n\nFamily contact: ${input.contact.name}, ${input.contact.email}.\n\nPlease reply or call the family at your earliest kindness.\n\nGrace and peace,\nLegacy Coordination`,
      relatedType: "coordination",
      relatedId: id,
    });
  }

  await sendMessage({
    channel: "email",
    recipient: input.contact.email,
    subject: `We have received your plan — reference ${reference}`,
    body: `Dear ${input.contact.name},\n\nYour plan for ${family} is in our hands now. Your reference is ${reference}.\n\n${home ? `${home.name} is being notified, ` : ""}${minister ? `${minister.name} has been asked to lead the service, ` : ""}and a Legacy coordinator will call you shortly to walk through every detail together. Nothing is final until your family says so.\n\n"Come unto me, all ye that labour and are heavy laden, and I will give you rest." — Matthew 11:28\n\nWith you in this hour,\nLegacy`,
    relatedType: "coordination",
    relatedId: id,
  });

  if (input.contact.phone) {
    await sendMessage({
      channel: "sms",
      recipient: input.contact.phone,
      body: `Legacy: your plan (ref ${reference}) is received. A coordinator will call you shortly. We are with you.`,
      relatedType: "coordination",
      relatedId: id,
    });
  }

  return { id, reference };
}

export async function listCoordinationRequests(): Promise<CoordinationRequestRow[]> {
  const db = await getDb();
  return db.all<CoordinationRequestRow>(
    "SELECT * FROM coordination_requests ORDER BY created_at DESC",
  );
}

export async function listCoordinationRequestsForUser(
  userId: string,
): Promise<CoordinationRequestRow[]> {
  const db = await getDb();
  return db.all<CoordinationRequestRow>(
    "SELECT * FROM coordination_requests WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
}

const REQUEST_STATUSES: RequestStatus[] = ["received", "confirmed", "in-progress", "completed"];

export async function setCoordinationStatus(id: string, status: string): Promise<boolean> {
  if (!REQUEST_STATUSES.includes(status as RequestStatus)) return false;
  const db = await getDb();
  await db.run("UPDATE coordination_requests SET status = ?, updated_at = ? WHERE id = ?", [
    status,
    nowIso(),
    id,
  ]);
  return true;
}
