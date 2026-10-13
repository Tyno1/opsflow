import { getToken } from "next-auth/jwt";
import { inspectPasskeyToken } from "@/lib/passkeys/claims";
import type { PasskeyTokenState } from "@/lib/passkeys/config";

function secureCookie(): boolean {
	return process.env.AUTH_URL?.startsWith("https://") ?? false;
}

export class PasskeySignInRequired extends Error {
	readonly status: Exclude<PasskeyTokenState, "ready">;

	constructor(status: Exclude<PasskeyTokenState, "ready">) {
		super(
			status === "mfa_required"
				? "This sign-in did not include MFA."
				: status === "stale"
					? "MFA is older than five minutes."
					: "Sign in before managing passkeys.",
		);
		this.name = "PasskeySignInRequired";
		this.status = status;
	}
}

export async function passkeyUser(request: Request): Promise<string> {
	const jwt = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET,
		secureCookie: secureCookie(),
	});
	const idToken = typeof jwt?.idToken === "string" ? jwt.idToken : undefined;
	const inspection = inspectPasskeyToken(idToken);
	if (inspection.status !== "ready" || !inspection.userId) {
		throw new PasskeySignInRequired(
			inspection.status === "ready" ? "stale" : inspection.status,
		);
	}
	return inspection.userId;
}
