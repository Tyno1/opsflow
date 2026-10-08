"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInAction() {
  return await signIn("microsoft-entra-id", {
    redirectTo: "/dashboard",
  });
}

export async function signUpAction() {
  return await signIn("microsoft-entra-id", {
    redirectTo: "/dashboard",
  });
}

export async function signOutAction() {
  return await signOut({ redirectTo: "/login" });
}
