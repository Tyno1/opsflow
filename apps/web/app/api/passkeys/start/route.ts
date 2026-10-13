import { creationOptions } from "@/lib/passkeys/graph";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyUser } from "@/lib/passkeys/session-token";

export async function POST(request: Request) {
	try {
		const userId = await passkeyUser(request);
		const registration = await creationOptions(userId);
		return Response.json(registration);
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
