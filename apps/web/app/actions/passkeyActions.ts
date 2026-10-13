"use server";

import { cookies } from "next/headers";
import { signIn } from "@/lib/auth";
import { PASSKEY_SCOPE } from "@/lib/passkeys/config";

export async function requestPasskeyToken() {
	const appCookie = await cookies();
	appCookie.set("passkey-token", "1", {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10,
	});

	await signIn(
		"microsoft-entra-id",
		{ redirectTo: "/dashboard/security" },
		{
			scope: `openid profile email ${PASSKEY_SCOPE}`,
		},
	);
}
