"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import {
  createOrder,
  getOrderByReference,
  getPaymentProvider,
  markOrderPaid,
} from "@/lib/server/payments";

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

  let destination: string;
  try {
    destination = await getPaymentProvider().beginCheckout(order);
  } catch {
    return {
      error:
        "Our payment provider could not be reached — nothing was charged. Please try again in a moment.",
    };
  }
  redirect(destination);
}

export async function confirmDemoPayment(formData: FormData): Promise<void> {
  const reference = String(formData.get("reference") ?? "");
  const provider = getPaymentProvider();
  if (provider.name !== "demo") {
    // Live payments configured: nothing completes without real payment —
    // this page becomes the way back into the hosted checkout.
    const order = getOrderByReference(reference);
    if (!order) redirect("/pricing");
    redirect(await provider.beginCheckout(order));
  }
  const order = await markOrderPaid(reference);
  if (!order) redirect("/pricing");
  redirect(`/checkout/${reference}/receipt`);
}
