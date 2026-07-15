"use server";

import {
  createPartnerApplication,
  PARTNER_CATEGORIES,
  type PartnerCategory,
} from "@/lib/server/partners";

export interface PartnerFormState {
  ok: boolean;
  error: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitPartnerApplication(
  _prev: PartnerFormState,
  formData: FormData,
): Promise<PartnerFormState> {
  const orgName = String(formData.get("orgName") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!orgName) return { ok: false, error: "Please tell us your organization's name." };
  if (!PARTNER_CATEGORIES.includes(category as PartnerCategory)) {
    return { ok: false, error: "Please choose the kind of care you provide." };
  }
  if (!contactName) return { ok: false, error: "Please tell us who we should speak with." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };

  await createPartnerApplication({
    orgName,
    category: category as PartnerCategory,
    contactName,
    email,
    phone: String(formData.get("phone") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim().toUpperCase().slice(0, 2),
    zip: String(formData.get("zip") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  });

  return { ok: true, error: "" };
}
