import { getToken } from "next-auth/jwt";
import { inspectPasskeyToken } from "@/lib/passkeys/claims";
import { PasskeyTokenRequired } from "@/lib/passkeys/credential-api";

function secureCookie(): boolean {
	return process.env.AUTH_URL?.startsWith("https://") ?? false;
}

export async function passkeyAccessToken(request: Request): Promise<string> {
	const jwt = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET,
		secureCookie: secureCookie(),
	});
	const accessToken = jwt?.passkeyAccessToken;
	const inspection = inspectPasskeyToken(
		typeof accessToken === "string" ? accessToken : undefined,
		{
			grantedScope:
				typeof jwt?.grantedScope === "string" ? jwt.grantedScope : undefined,
			issuedAt:
				typeof jwt?.passkeyIssuedAt === "number"
					? jwt.passkeyIssuedAt
					: undefined,
			forceReady: jwt?.passkeyTokenRequested === true,
		},
	);
	if (typeof accessToken !== "string" || inspection.status !== "ready") {
		throw new PasskeyTokenRequired();
	}
	return accessToken;
}
