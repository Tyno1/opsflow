import {
	beginPasskeyRegistration,
	listPasskeys,
} from "@/lib/passkeys/credential-api";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyAccessToken } from "@/lib/passkeys/session-token";

export async function POST(request: Request) {
	try {
		const accessToken = await passkeyAccessToken(request);
		const { enrollHref } = await listPasskeys(accessToken);
		if (!enrollHref) {
			return Response.json(
				{
					code: "enrollment_unavailable",
					message:
						"This account cannot register a passkey. Self-service setup has to be enabled, with a passkey profile assigned.",
				},
				{ status: 403 },
			);
		}

		const registration = await beginPasskeyRegistration(
			accessToken,
			enrollHref,
		);
		return Response.json(registration, { status: 202 });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
