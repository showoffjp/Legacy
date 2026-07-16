import { randomUUID } from "node:crypto";
import { getDb, nowIso } from "@/lib/server/db";
import { sendMessage } from "@/lib/server/notify";
import { SITE_URL } from "@/lib/site";

/**
 * The grief year — opt-in notes of comfort timed to the hardest
 * milestones after a loss. Signing up computes the schedule; a daily
 * cron (or any caller of dispatchDueRemembrances) sends what is due
 * through the same messaging rails as everything else, so every note
 * lands in the coordinator console's outbox.
 */

export interface RemembranceRow {
  id: string;
  user_id: string | null;
  loved_one_name: string;
  death_date: string;
  recipient_name: string;
  recipient_email: string;
  active: number;
  created_at: string;
}

export interface RemembranceEventRow {
  id: string;
  remembrance_id: string;
  send_on: string;
  title: string;
  note: string;
  verse_text: string;
  verse_ref: string;
  status: string;
  sent_at: string | null;
}

interface MilestoneTemplate {
  title: string;
  /** Days after the passing; null means "the first Christmas after". */
  afterDays: number | null;
  note: (name: string) => string;
  verseText: string;
  verseRef: string;
}

const MILESTONES: MilestoneTemplate[] = [
  {
    title: "One month",
    afterDays: 30,
    note: (name) =>
      `It has been a month since ${name} went home. Grief can arrive like weather — sudden, out of season. Let it come, and let it pass; you are not walking backward, you are walking through.`,
    verseText:
      "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    verseRef: "Psalm 34:18",
  },
  {
    title: "Three months",
    afterDays: 91,
    note: (name) =>
      `Three months, and the world keeps asking you to be ordinary. It is alright that some days you can be, and some days you cannot. ${name} is safe, and you are held.`,
    verseText: "Blessed are they that mourn: for they shall be comforted.",
    verseRef: "Matthew 5:4",
  },
  {
    title: "Six months",
    afterDays: 182,
    note: (name) =>
      `Half a year without ${name}. By now others may have stopped asking how you are — we have not. May today hold one good memory that makes you smile before it makes you cry.`,
    verseText:
      "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
    verseRef: "Isaiah 41:10",
  },
  {
    title: "The first Christmas",
    afterDays: null,
    note: (name) =>
      `The first Christmas without ${name} may be the hardest table you ever set. Leave room for the sorrow and the celebration both — the light of this season was kindled for exactly such darkness.`,
    verseText: "And the light shineth in darkness; and the darkness comprehended it not.",
    verseRef: "John 1:5",
  },
  {
    title: "One year",
    afterDays: 365,
    note: (name) =>
      `A whole year, carried one day at a time. However you mark this anniversary — flowers, a favorite meal, a story told again — ${name}'s life is still shaping yours, and that is a kind of presence.`,
    verseText:
      "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    verseRef: "Revelation 21:4",
  },
];

function toUtcDate(isoDay: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDay)) return null;
  const d = new Date(`${isoDay}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 86_400_000);
}

/** Dec 25 strictly after the passing. */
function firstChristmasAfter(death: Date): Date {
  const year = death.getUTCFullYear();
  const christmas = new Date(Date.UTC(year, 11, 25));
  return christmas.getTime() > death.getTime()
    ? christmas
    : new Date(Date.UTC(year + 1, 11, 25));
}

export interface ScheduledEvent {
  sendOn: string;
  title: string;
}

export interface CreateRemembranceInput {
  userId: string | null;
  lovedOneName: string;
  deathDate: string;
  recipientName: string;
  recipientEmail: string;
}

/**
 * Create a remembrance schedule. Only milestones still ahead are
 * scheduled; a welcome note goes out immediately so the family knows
 * the year is being kept.
 */
export async function createRemembrance(
  input: CreateRemembranceInput,
): Promise<{ id: string; events: ScheduledEvent[] } | { error: string }> {
  const death = toUtcDate(input.deathDate);
  if (!death) return { error: "Please tell us the day they passed." };
  const today = new Date();
  if (death.getTime() > today.getTime()) {
    return { error: "That day is still to come — the grief year begins after a loss." };
  }

  const id = randomUUID();
  const db = getDb();
  db.prepare(
    `INSERT INTO remembrances
       (id, user_id, loved_one_name, death_date, recipient_name, recipient_email, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
  ).run(
    id,
    input.userId,
    input.lovedOneName,
    input.deathDate,
    input.recipientName,
    input.recipientEmail,
    nowIso(),
  );

  const todayStr = isoDay(today);
  const events: ScheduledEvent[] = [];
  const insert = db.prepare(
    `INSERT INTO remembrance_events
       (id, remembrance_id, send_on, title, note, verse_text, verse_ref, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
  );
  for (const milestone of MILESTONES) {
    const when =
      milestone.afterDays === null ? firstChristmasAfter(death) : addDays(death, milestone.afterDays);
    const sendOn = isoDay(when);
    if (sendOn <= todayStr) continue; // that milestone has already passed
    insert.run(
      randomUUID(),
      id,
      sendOn,
      milestone.title,
      milestone.note(input.lovedOneName),
      milestone.verseText,
      milestone.verseRef,
    );
    events.push({ sendOn, title: milestone.title });
  }
  events.sort((a, b) => (a.sendOn < b.sendOn ? -1 : 1));

  const firstNote = events[0];
  await sendMessage({
    channel: "email",
    recipient: input.recipientEmail,
    subject: `We will walk this year with you, ${input.recipientName}`,
    body: `Dear ${input.recipientName},\n\nGrief does not keep a calendar, but some days are heavier than others — and on those days, a word of comfort will find you. ${
      firstNote
        ? `The first will come around ${firstNote.sendOn} (${firstNote.title.toLowerCase()} since ${input.lovedOneName} went home).`
        : `Every milestone of the first year has already passed, so no scheduled notes remain — but our grief resources are always open.`
    }\n\n"Blessed are they that mourn: for they shall be comforted." — Matthew 5:4\n\nOur grief resources are always open: ${SITE_URL}/resources\nTo end these notes at any time: ${unsubscribeUrl(id)}\n\nWith you still,\nLegacy`,
    relatedType: "remembrance",
    relatedId: id,
  });

  return { id, events };
}

function unsubscribeUrl(id: string): string {
  return `${SITE_URL}/api/remembrances/unsubscribe?id=${id}`;
}

/** End a remembrance by its (unguessable) id — the unsubscribe path. */
export function deactivateRemembrance(id: string): boolean {
  const result = getDb().prepare("UPDATE remembrances SET active = 0 WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

/** End a remembrance from the dashboard — only by its owner. */
export function deactivateRemembranceForUser(id: string, userId: string): boolean {
  const result = getDb()
    .prepare("UPDATE remembrances SET active = 0 WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return Number(result.changes) > 0;
}

export interface RemembranceSummary {
  id: string;
  lovedOneName: string;
  deathDate: string;
  recipientEmail: string;
  sentCount: number;
  nextEvent: { sendOn: string; title: string } | null;
}

export function listRemembrancesForUser(userId: string): RemembranceSummary[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM remembrances WHERE user_id = ? AND active = 1 ORDER BY created_at DESC",
    )
    .all(userId) as unknown as RemembranceRow[];
  return rows.map((row) => {
    const sent = getDb()
      .prepare(
        "SELECT COUNT(*) AS n FROM remembrance_events WHERE remembrance_id = ? AND status = 'sent'",
      )
      .get(row.id) as unknown as { n: number };
    const next = getDb()
      .prepare(
        "SELECT send_on, title FROM remembrance_events WHERE remembrance_id = ? AND status = 'pending' ORDER BY send_on ASC LIMIT 1",
      )
      .get(row.id) as unknown as { send_on: string; title: string } | undefined;
    return {
      id: row.id,
      lovedOneName: row.loved_one_name,
      deathDate: row.death_date,
      recipientEmail: row.recipient_email,
      sentCount: sent.n,
      nextEvent: next ? { sendOn: next.send_on, title: next.title } : null,
    };
  });
}

/**
 * Send every note that has come due. Called by the daily cron
 * (/api/remembrances/dispatch); safe to call any number of times.
 */
export async function dispatchDueRemembrances(): Promise<number> {
  const todayStr = isoDay(new Date());
  const due = getDb()
    .prepare(
      `SELECT e.id AS event_id, e.title, e.note, e.verse_text, e.verse_ref,
              r.id AS remembrance_id, r.loved_one_name, r.recipient_name, r.recipient_email
       FROM remembrance_events e
       JOIN remembrances r ON r.id = e.remembrance_id
       WHERE e.status = 'pending' AND r.active = 1 AND e.send_on <= ?
       ORDER BY e.send_on ASC`,
    )
    .all(todayStr) as unknown as {
    event_id: string;
    title: string;
    note: string;
    verse_text: string;
    verse_ref: string;
    remembrance_id: string;
    loved_one_name: string;
    recipient_name: string;
    recipient_email: string;
  }[];

  const markSent = getDb().prepare(
    "UPDATE remembrance_events SET status = 'sent', sent_at = ? WHERE id = ?",
  );
  for (const event of due) {
    await sendMessage({
      channel: "email",
      recipient: event.recipient_email,
      subject: `Thinking of you and ${event.loved_one_name} — ${event.title.toLowerCase()}`,
      body: `Dear ${event.recipient_name},\n\n${event.note}\n\n"${event.verse_text}" — ${event.verse_ref}\n\nIf it would help to talk with someone who understands, GriefShare groups meet in thousands of churches, and our grief resources are always open: ${SITE_URL}/resources\n\nWith you still,\nLegacy\n\nTo end these notes: ${unsubscribeUrl(event.remembrance_id)}`,
      relatedType: "remembrance",
      relatedId: event.remembrance_id,
    });
    markSent.run(nowIso(), event.event_id);
  }
  return due.length;
}
