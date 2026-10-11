"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInAction() {
	return await signIn(
		"microsoft-entra-id",
		{ redirectTo: "/dashboard" },
		{ prompt: "login" },
	);
}

export async function signUpAction() {
	return await signIn(
		"microsoft-entra-id",
		{ redirectTo: "/dashboard" },
		{ prompt: "login" },
	);
}

export async function signOutAction() {
	return await signOut({ redirectTo: "/login" });
}
