import { deletePasskey, listPasskeys } from "@/lib/passkeys/graph";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyUser } from "@/lib/passkeys/session-token";

export async function GET(request: Request) {
	try {
		const userId = await passkeyUser(request);
		const methods = await listPasskeys(userId);
		console.log(userId, methods);
		
		return Response.json({ methods, canEnroll: true });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}

export async function DELETE(request: Request) {
	try {
		const userId = await passkeyUser(request);
		const body = (await request.json()) as { id?: unknown };
		if (typeof body.id !== "string" || body.id.length === 0) {
			return Response.json(
				{ code: "invalid_request", message: "Choose a passkey to delete." },
				{ status: 400 },
			);
		}

		await deletePasskey(userId, body.id);
		return new Response(null, { status: 204 });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
