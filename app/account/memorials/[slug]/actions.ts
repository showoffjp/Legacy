"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import {
  unpublishMemorialByOwner,
  updateMemorialByOwner,
  type MemorialPrivacy,
} from "@/lib/server/memorials";

export interface EditMemorialState {
  ok: boolean;
  error: string;
}

export async function updateMemorialAction(
  _prev: EditMemorialState,
  formData: FormData,
): Promise<EditMemorialState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const slug = String(formData.get("slug") ?? "");
  const privacyRaw = String(formData.get("privacy") ?? "public");
  const privacy: MemorialPrivacy = privacyRaw === "link-only" ? "link-only" : "public";

  const serviceDate = String(formData.get("serviceDate") ?? "");
  const serviceTime = String(formData.get("serviceTime") ?? "");
  const venueName = String(formData.get("venueName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim().toUpperCase().slice(0, 2);
  const kind = String(formData.get("serviceKind") ?? "");
  const livestream = formData.get("livestream") === "on";
  const hasService = Boolean(kind && (serviceDate || venueName || city));

  const ok = updateMemorialByOwner(slug, user.id, {
    story: String(formData.get("story") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    survivedBy: String(formData.get("survivedBy") ?? "").trim(),
    nickname: String(formData.get("nickname") ?? "").trim(),
    locationText: String(formData.get("locationText") ?? "").trim(),
    giftsNote: String(formData.get("giftsNote") ?? "").trim(),
    photos: (() => {
      try {
        return JSON.parse(String(formData.get("photos") ?? "[]")) as string[];
      } catch {
        return [];
      }
    })(),
    service: hasService
      ? { kind, date: serviceDate, time: serviceTime, venueName, city, state, livestream }
      : null,
    privacy,
  });
  if (!ok) return { ok: false, error: "This memorial could not be updated." };

  revalidatePath(`/memorials/${slug}`);
  revalidatePath("/memorials");
  revalidatePath("/account/dashboard");
  return { ok: true, error: "" };
}

export async function unpublishOwnMemorialAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const slug = String(formData.get("slug") ?? "");
  if (unpublishMemorialByOwner(slug, user.id)) {
    revalidatePath("/memorials");
    revalidatePath("/account/dashboard");
    redirect("/account/dashboard");
  }
}
