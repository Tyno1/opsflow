import { PasskeyApiError } from "@/lib/passkeys/graph";
import { PasskeySignInRequired } from "@/lib/passkeys/session-token";

export function passkeyErrorResponse(error: unknown): Response {
	if (error instanceof PasskeySignInRequired) {
		return Response.json(
			{ code: error.status, message: error.message },
			{ status: 401 },
		);
	}

	if (error instanceof PasskeyApiError) {
		console.error(
			"[passkey] graph",
			error.status,
			error.code ?? "",
			error.message,
		);
		return Response.json(
			{
				code: "graph",
				message: error.message,
				correlationId: error.correlationId,
			},
			{ status: error.status },
		);
	}

	console.error("Passkey request failed");
	return Response.json(
		{ code: "error", message: "Passkey request failed." },
		{ status: 500 },
	);
}
