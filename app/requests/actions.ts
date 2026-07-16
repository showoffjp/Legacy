"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server/auth";
import { addRequestMessage, canAccessRequest } from "@/lib/server/messaging";

/** Post to a request's shared thread — family, partner, and coordinator. */
export async function postRequestMessage(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const requestId = String(formData.get("requestId") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 4000);
  if (!requestId || !body) return;
  if (!(await canAccessRequest(user, requestId))) return;

  await addRequestMessage({
    requestId,
    authorRole: user.role,
    authorName: user.name,
    body,
  });
  revalidatePath("/account/dashboard");
  revalidatePath("/portal");
  revalidatePath("/admin");
}
