"use server";

import { redirect } from "next/navigation";
import {
  createSessionCookie,
  createUser,
  destroySessionCookie,
  ensureCoordinatorSeeded,
  findUserByEmail,
  verifyPassword,
} from "@/lib/server/auth";

export interface AuthFormState {
  error: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Please choose a password of at least 8 characters." };
  if (findUserByEmail(email)) {
    return { error: "An account with that email already exists — you can sign in instead." };
  }

  const user = createUser({ name, email, password });
  await createSessionCookie(user.id);
  redirect("/account/dashboard");
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  ensureCoordinatorSeeded();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "That email and password do not match our records." };
  }

  await createSessionCookie(user.id);
  redirect(
    user.role === "coordinator"
      ? "/admin"
      : user.role === "partner"
        ? "/portal"
        : "/account/dashboard",
  );
}

export async function signOut(): Promise<void> {
  await destroySessionCookie();
  redirect("/");
}
