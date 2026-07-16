"use server";

import { changePassword, getCurrentUser } from "@/lib/server/auth";

export interface SettingsFormState {
  ok: boolean;
  error: string;
}

export async function changePasswordAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next !== confirm) {
    return { ok: false, error: "The new passwords do not match." };
  }
  const result = changePassword(user.id, current, next);
  return { ok: result.ok, error: result.error ?? "" };
}
