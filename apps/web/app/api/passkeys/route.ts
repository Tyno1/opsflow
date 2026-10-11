import { deletePasskey, listPasskeys } from "@/lib/passkeys/credential-api";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyAccessToken } from "@/lib/passkeys/session-token";

export async function GET(request: Request) {
	try {
		const accessToken = await passkeyAccessToken(request);
		const listed = await listPasskeys(accessToken);
		return Response.json({
			methods: listed.methods,
			canEnroll: listed.enrollHref !== null,
		});
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}

export async function DELETE(request: Request) {
	try {
		const accessToken = await passkeyAccessToken(request);
		const body = (await request.json()) as { deleteHref?: unknown };
		if (typeof body.deleteHref !== "string" || body.deleteHref.length === 0) {
			return Response.json(
				{ code: "invalid_request", message: "Choose a passkey to delete." },
				{ status: 400 },
			);
		}

		await deletePasskey(accessToken, body.deleteHref);
		return new Response(null, { status: 204 });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
