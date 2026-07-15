"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server/auth";
import { setCoordinationStatus } from "@/lib/server/coordination";
import { setApplicationStatus } from "@/lib/server/partners";
import { unpublishMemorial } from "@/lib/server/memorials";

async function requireCoordinator(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "coordinator";
}

export async function updateRequestStatus(formData: FormData): Promise<void> {
  if (!(await requireCoordinator())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (id) setCoordinationStatus(id, status);
  revalidatePath("/admin");
}

export async function updateApplicationStatus(formData: FormData): Promise<void> {
  if (!(await requireCoordinator())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (id) setApplicationStatus(id, status);
  revalidatePath("/admin");
}

export async function unpublishMemorialAction(formData: FormData): Promise<void> {
  if (!(await requireCoordinator())) return;
  const slug = String(formData.get("slug") ?? "");
  if (slug) unpublishMemorial(slug);
  revalidatePath("/admin");
  revalidatePath("/memorials");
}
