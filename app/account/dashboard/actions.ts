"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server/auth";
import { joinPlanByCode, leaveSharedPlan } from "@/lib/server/plans";
import { deactivateRemembranceForUser } from "@/lib/server/remembrances";

export interface JoinPlanState {
  ok: boolean;
  error: string;
}

export async function joinPlanAction(
  _prev: JoinPlanState,
  formData: FormData,
): Promise<JoinPlanState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { ok: false, error: "Enter the family code you were given." };
  const result = joinPlanByCode(user.id, code);
  if (result.ok) revalidatePath("/account/dashboard");
  return { ok: result.ok, error: result.error ?? "" };
}

export async function leavePlanAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  leaveSharedPlan(user.id);
  revalidatePath("/account/dashboard");
}

export async function endRemembranceAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") ?? "");
  if (id) deactivateRemembranceForUser(id, user.id);
  revalidatePath("/account/dashboard");
}
