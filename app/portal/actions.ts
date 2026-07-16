"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server/auth";
import { setCoordinationStatus } from "@/lib/server/coordination";
import { getPartnerLink, listRequestsForPartner } from "@/lib/server/portal";

/** Partners may move only their own requests through the stages. */
export async function partnerUpdateStatus(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "partner") return;
  const link = await getPartnerLink(user.id);
  if (!link) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const mine = (await listRequestsForPartner(link)).some((r) => r.id === id);
  if (!mine) return;

  await setCoordinationStatus(id, status);
  revalidatePath("/portal");
}
