"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server/auth";
import { setCoordinationStatus } from "@/lib/server/coordination";
import { setApplicationStatus } from "@/lib/server/partners";
import { setAssignmentStatus } from "@/lib/server/payments";
import { unpublishMemorial } from "@/lib/server/memorials";
import { invitePartner, type PartnerKind } from "@/lib/server/portal";

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

export async function updateAssignmentStatus(formData: FormData): Promise<void> {
  if (!(await requireCoordinator())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (id) await setAssignmentStatus(id, status);
  revalidatePath("/admin");
}

export interface InviteFormState {
  ok: boolean;
  error: string;
}

export async function invitePartnerAction(
  _prev: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  if (!(await requireCoordinator())) return { ok: false, error: "Not authorized." };
  const kind = String(formData.get("kind") ?? "");
  const refId = String(formData.get("refId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const contactName = String(formData.get("contactName") ?? "").trim();
  if (kind !== "funeral-home" && kind !== "clergy") {
    return { ok: false, error: "Choose the kind of partner." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const result = await invitePartner({ kind: kind as PartnerKind, refId, email, contactName });
  if (result.ok) revalidatePath("/admin");
  return { ok: result.ok, error: result.error ?? "" };
}

export async function unpublishMemorialAction(formData: FormData): Promise<void> {
  if (!(await requireCoordinator())) return;
  const slug = String(formData.get("slug") ?? "");
  if (slug) await unpublishMemorial(slug);
  revalidatePath("/admin");
  revalidatePath("/memorials");
}
