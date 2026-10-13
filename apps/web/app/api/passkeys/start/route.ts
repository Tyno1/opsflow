import { beginPasskeyRegistration } from "@/lib/passkeys/credential-api";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyAccessToken } from "@/lib/passkeys/session-token";

export async function POST(request: Request) {
	try {
		const accessToken = await passkeyAccessToken(request);
		const registration = await beginPasskeyRegistration(accessToken);
		return Response.json(registration, { status: 202 });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
