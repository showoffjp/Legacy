"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import {
  createAssignmentOrder,
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
  const order = await createOrder({
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

export async function startAssignment(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const packageId = String(formData.get("packageId") ?? "");
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const insurer = String(formData.get("insurer") ?? "").trim().slice(0, 120);
  const policyNumber = String(formData.get("policyNumber") ?? "").trim().slice(0, 60);
  const policyholder = String(formData.get("policyholder") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 30);
  const faceAmountUsd = Math.max(
    0,
    Math.min(10_000_000, Math.round(Number(formData.get("faceAmount") ?? 0) || 0)),
  );

  if (!contactName) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(contactEmail)) return { error: "Please enter a valid email address." };
  if (!insurer) return { error: "Please tell us the insurance company." };
  if (!policyholder) {
    return { error: "Please tell us whose name the policy is in." };
  }

  const user = await getCurrentUser();
  const order = await createAssignmentOrder({
    userId: user?.id ?? null,
    packageId,
    contactName,
    contactEmail,
    funding: { insurer, policyNumber, policyholder, faceAmountUsd, phone },
  });
  if (!order) return { error: "That package could not be found — please choose again." };
  redirect(`/checkout/${order.reference}/assignment`);
}

export async function confirmDemoPayment(formData: FormData): Promise<void> {
  const reference = String(formData.get("reference") ?? "");
  {
    // Assignment orders are completed by coordinator verification, never here.
    const order = await getOrderByReference(reference);
    if (order?.provider === "insurance-assignment") {
      redirect(`/checkout/${reference}/assignment`);
    }
  }
  const provider = getPaymentProvider();
  if (provider.name !== "demo") {
    // Live payments configured: nothing completes without real payment —
    // this page becomes the way back into the hosted checkout.
    const order = await getOrderByReference(reference);
    if (!order) redirect("/pricing");
    redirect(await provider.beginCheckout(order));
  }
  const order = await markOrderPaid(reference);
  if (!order) redirect("/pricing");
  redirect(`/checkout/${reference}/receipt`);
}
