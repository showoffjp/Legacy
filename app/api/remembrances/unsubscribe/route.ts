import { NextResponse, type NextRequest } from "next/server";
import { deactivateRemembrance } from "@/lib/server/remembrances";

/**
 * One-click, no-questions unsubscribe — the link carried in every
 * remembrance email. The id is an unguessable UUID, so possession of
 * the link is the authorization.
 */
export function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const ended = id ? deactivateRemembrance(id) : false;
  const url = req.nextUrl.clone();
  url.pathname = "/aftercare";
  url.search = ended ? "?remembrance=ended" : "";
  return NextResponse.redirect(url);
}
