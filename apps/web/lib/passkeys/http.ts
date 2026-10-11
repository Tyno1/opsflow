import {
	CredentialApiError,
	StepUpRequired,
} from "@/lib/passkeys/credential-api";

export function passkeyErrorResponse(error: unknown): Response {
	if (error instanceof StepUpRequired) {
		return Response.json({ code: "step_up_required" }, { status: 401 });
	}

	if (error instanceof CredentialApiError) {
		const code = error.status === 401 ? "token_rejected" : "credential_api";
		return Response.json(
			{
				code,
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
