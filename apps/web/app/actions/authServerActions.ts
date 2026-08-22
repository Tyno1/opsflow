"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInAction() {
	return await signIn("azure-ad-b2c", {
		redirectTo: "/dashboard",
	});
}

export async function signUpAction() {
	return await signIn("azure-ad-b2c", {
		redirectTo: "/dashboard",
	});
}

export async function signOutAction() {
	return await signOut({ redirectTo: "/login" });
}
