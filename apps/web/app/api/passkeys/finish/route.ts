import { activatePasskey } from "@/lib/passkeys/credential-api";
import { passkeyErrorResponse } from "@/lib/passkeys/http";
import { passkeyAccessToken } from "@/lib/passkeys/session-token";

const DISPLAY_NAME_MAX = 120;

type FinishBody = {
	activateHref?: unknown;
	continuationToken?: unknown;
	displayName?: unknown;
	credential?: {
		id?: unknown;
		attestationObject?: unknown;
		clientDataJSON?: unknown;
	};
};

function asString(value: unknown): string | null {
	return typeof value === "string" && value.length > 0 ? value : null;
}

export async function POST(request: Request) {
	try {
		const accessToken = await passkeyAccessToken(request);
		const body = (await request.json()) as FinishBody;
		const activateHref = asString(body.activateHref);
		const continuationToken = asString(body.continuationToken);
		const displayName = asString(body.displayName)?.trim() ?? "";
		const id = asString(body.credential?.id);
		const attestationObject = asString(body.credential?.attestationObject);
		const clientDataJSON = asString(body.credential?.clientDataJSON);

		if (
			!activateHref ||
			!continuationToken ||
			!id ||
			!attestationObject ||
			!clientDataJSON ||
			displayName.length === 0 ||
			displayName.length > DISPLAY_NAME_MAX
		) {
			return Response.json(
				{
					code: "invalid_request",
					message: "Passkey registration details were incomplete.",
				},
				{ status: 400 },
			);
		}

		const method = await activatePasskey(accessToken, {
			activateHref,
			continuationToken,
			displayName,
			credential: { id, attestationObject, clientDataJSON },
		});
		return Response.json(method, { status: 201 });
	} catch (error) {
		return passkeyErrorResponse(error);
	}
}
