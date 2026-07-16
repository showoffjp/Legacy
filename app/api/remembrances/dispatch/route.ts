import { NextResponse, type NextRequest } from "next/server";
import { dispatchDueRemembrances } from "@/lib/server/remembrances";

/**
 * Send every remembrance note that has come due. Wired to a daily
 * Vercel cron (vercel.json); any scheduler that can make a request
 * works. When CRON_SECRET is set, callers must present it — Vercel
 * sends it automatically as `Authorization: Bearer <CRON_SECRET>`.
 */
async function dispatch(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sent = await dispatchDueRemembrances();
  return NextResponse.json({ ok: true, sent });
}

export function GET(req: NextRequest) {
  return dispatch(req);
}

export function POST(req: NextRequest) {
  return dispatch(req);
}
