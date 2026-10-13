import { GRAPH_BASE } from "@/lib/passkeys/config";
import type { PublicKeyCreationJSON } from "@/lib/passkeys/webauthn";

const OBJECT_ID =
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const METHOD_ID = /^[A-Za-z0-9_-]{1,200}$/;

type GraphFido2Method = {
	id?: string;
	displayName?: string;
	model?: string;
	createdDateTime?: string;
};

type GraphCreationOptions = {
	publicKey?: {
		rp?: { id?: string; name?: string };
		user?: { id?: string; name?: string; displayName?: string };
		challenge?: string;
		pubKeyCredParams?: PublicKeyCreationJSON["pubKeyCredParams"];
		timeout?: number;
		excludeCredentials?: PublicKeyCreationJSON["excludeCredentials"];
		authenticatorSelection?: PublicKeyCreationJSON["authenticatorSelection"];
		attestation?: PublicKeyCreationJSON["attestation"];
	};
};

export type PasskeyMethod = {
	id: string;
	displayName: string | null;
	model: string | null;
	createdDateTime: string | null;
};

export class PasskeyApiError extends Error {
	readonly status: number;
	readonly code?: string;
	readonly correlationId?: string;

	constructor(
		message: string,
		status: number,
		code?: string,
		correlationId?: string,
	) {
		super(message);
		this.name = "PasskeyApiError";
		this.status = status;
		this.code = code;
		this.correlationId = correlationId;
	}
}

function graphUrl(path: string): URL {
	return new URL(`${GRAPH_BASE}${path}`);
}

let cachedToken: { value: string; expiresAt: number } | undefined;

async function graphApplicationToken(): Promise<string> {
	const now = Date.now();
	if (cachedToken && cachedToken.expiresAt > now) return cachedToken.value;

	const tenantId = process.env.AUTH_CIAM_TENANT_ID;
	const clientId = process.env.AUTH_ENTRA_ID_CLIENT_ID;
	const clientSecret = process.env.AUTH_ENTRA_ID_CLIENT_SECRET;
	if (!tenantId || !clientId || !clientSecret) {
		throw new PasskeyApiError("Graph credentials are not configured.", 500);
	}

	const response = await fetch(
		`https://${tenantId}.ciamlogin.com/${tenantId}/oauth2/v2.0/token`,
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				scope: "https://graph.microsoft.com/.default",
				grant_type: "client_credentials",
			}),
			cache: "no-store",
		},
	);
	if (!response.ok) throw await graphError(response);

	const body = (await response.json()) as {
		access_token?: string;
		expires_in?: number;
	};
	if (!body.access_token) {
		throw new PasskeyApiError("Graph did not return an access token.", 502);
	}

	const expiresIn = body.expires_in ?? 300;
	cachedToken = {
		value: body.access_token,
		expiresAt: now + Math.max(expiresIn - 60, 30) * 1000,
	};
	return body.access_token;
}

function userPath(userId: string): string {
	if (!OBJECT_ID.test(userId)) {
		throw new PasskeyApiError(
			"The signed-in account has no Entra object id for passkey registration.",
			400,
		);
	}
	return `/users/${userId}/authentication/fido2Methods`;
}

async function graphError(response: Response): Promise<PasskeyApiError> {
	let code: string | undefined;
	let message = `Microsoft Graph returned ${response.status}.`;
	let correlationId: string | undefined;

	try {
		const body = (await response.json()) as {
			error?: {
				code?: string;
				message?: string;
				innerError?: { "request-id"?: string };
			};
		};
		code = body.error?.code;
		message = body.error?.message ?? message;
		correlationId = body.error?.innerError?.["request-id"];
	} catch {
		// The body is not the Graph error envelope.
	}

	return new PasskeyApiError(message, response.status, code, correlationId);
}

async function graphFetch(
	url: URL,
	accessToken: string,
	init?: { method?: string; body?: string },
): Promise<Response> {
	const response = await fetch(url, {
		method: init?.method ?? "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
			...(init?.body ? { "Content-Type": "application/json" } : {}),
		},
		body: init?.body,
		cache: "no-store",
	});

	if (!response.ok) {
		throw await graphError(response);
	}

	return response;
}

function methodFromGraph(
	method: GraphFido2Method,
	fallbackName?: string,
): PasskeyMethod {
	if (!method.id || !METHOD_ID.test(method.id)) {
		throw new PasskeyApiError("Graph returned an unusable passkey id.", 502);
	}
	return {
		id: method.id,
		displayName: method.displayName ?? fallbackName ?? null,
		model: method.model ?? null,
		createdDateTime: method.createdDateTime ?? null,
	};
}

export async function listPasskeys(userId: string): Promise<PasskeyMethod[]> {
	const response = await graphFetch(
		graphUrl(userPath(userId)),
		await graphApplicationToken(),
	);
	const body = (await response.json()) as { value?: GraphFido2Method[] };
	return (body.value ?? []).map((method) => methodFromGraph(method));
}

export async function creationOptions(
	userId: string,
): Promise<{ publicKey: PublicKeyCreationJSON }> {
	const response = await graphFetch(
		graphUrl(`${userPath(userId)}/creationOptions`),
		await graphApplicationToken(),
	);
	const body = (await response.json()) as GraphCreationOptions;
	const publicKey = body.publicKey;
	if (
		!publicKey?.rp?.id ||
		!publicKey.rp.name ||
		!publicKey.user?.id ||
		!publicKey.user.name ||
		!publicKey.user.displayName ||
		!publicKey.challenge ||
		!publicKey.pubKeyCredParams?.length
	) {
		throw new PasskeyApiError(
			"Graph did not return passkey creation options.",
			502,
		);
	}

	const selection = publicKey.authenticatorSelection;
	return {
		publicKey: {
			rp: { id: publicKey.rp.id, name: publicKey.rp.name },
			user: {
				id: publicKey.user.id,
				name: publicKey.user.name,
				displayName: publicKey.user.displayName,
			},
			challenge: publicKey.challenge,
			pubKeyCredParams: publicKey.pubKeyCredParams.map((param) => ({
				type: param.type,
				alg: param.alg,
			})),
			timeout: publicKey.timeout,
			excludeCredentials: publicKey.excludeCredentials?.map((credential) => ({
				id: credential.id,
				type: credential.type,
				transports: credential.transports,
			})),
			authenticatorSelection: selection
				? {
						authenticatorAttachment: selection.authenticatorAttachment,
						requireResidentKey: selection.requireResidentKey,
						residentKey: selection.residentKey,
						userVerification: selection.userVerification,
					}
				: undefined,
			attestation: publicKey.attestation,
		},
	};
}

export async function registerPasskey(
	userId: string,
	input: {
		displayName: string;
		credential: {
			id: string;
			attestationObject: string;
			clientDataJSON: string;
		};
	},
): Promise<PasskeyMethod> {
	const response = await graphFetch(
		graphUrl(userPath(userId)),
		await graphApplicationToken(),
		{
			method: "POST",
			body: JSON.stringify({
				displayName: input.displayName,
				publicKeyCredential: {
					id: input.credential.id,
					response: {
						clientDataJSON: input.credential.clientDataJSON,
						attestationObject: input.credential.attestationObject,
					},
				},
			}),
		},
	);

	if (response.status !== 201) {
		throw new PasskeyApiError(
			"Graph did not register the passkey.",
			response.status,
		);
	}

	const body = (await response.json()) as GraphFido2Method;
	return methodFromGraph(body, input.displayName);
}

export async function deletePasskey(
	userId: string,
	methodId: string,
): Promise<void> {
	if (!METHOD_ID.test(methodId)) {
		throw new PasskeyApiError("Choose a passkey to delete.", 400);
	}

	const response = await graphFetch(
		graphUrl(`${userPath(userId)}/${methodId}`),
		await graphApplicationToken(),
		{ method: "DELETE" },
	);
	if (response.status !== 204) {
		throw new PasskeyApiError(
			"Graph did not delete the passkey.",
			response.status,
		);
	}
}
