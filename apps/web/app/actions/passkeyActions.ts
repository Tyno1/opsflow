"use server";

import { signIn } from "@/lib/auth";

export async function refreshSignIn() {
	await signIn(
		"microsoft-entra-id",
		{ redirectTo: "/dashboard/security" },
		{ prompt: "login" },
	);
}
