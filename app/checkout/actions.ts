"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import { createOrder, getPaymentProvider, markOrderPaid } from "@/lib/server/payments";

export interface CheckoutFormState {
  error: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function startCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const packageId = String(formData.get("packageId") ?? "");
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();

  if (!contactName) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(contactEmail)) return { error: "Please enter a valid email address." };

  const user = await getCurrentUser();
  const order = createOrder({
    userId: user?.id ?? null,
    packageId,
    contactName,
    contactEmail,
  });
  if (!order) return { error: "That package could not be found — please choose again." };

  redirect(getPaymentProvider().checkoutUrl(order));
}

export async function confirmDemoPayment(formData: FormData): Promise<void> {
  const reference = String(formData.get("reference") ?? "");
  const order = await markOrderPaid(reference);
  if (!order) redirect("/pricing");
  redirect(`/checkout/${reference}/receipt`);
}
