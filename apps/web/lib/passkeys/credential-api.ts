import {
	credentialApiBase,
	credentialApiOrigin,
	tenantId,
} from "@/lib/passkeys/config";
import type { PublicKeyCreationJSON } from "@/lib/passkeys/webauthn";

type HalLink = { href: string; name?: string };

type ListedMethod = {
	id: string;
	displayName?: string;
	model?: string;
	createdDateTime?: string;
	_links?: { delete?: HalLink };
};

type ListResponse = {
	_embedded?: { methods?: ListedMethod[] };
	_links?: { enroll?: HalLink[] };
};

type BeginResponse = {
	publicKey?: PublicKeyCreationJSON;
	continuationToken?: string;
	_links?: { activate?: HalLink };
};

export type PasskeyMethod = {
	id: string;
	displayName: string | null;
	model: string | null;
	createdDateTime: string | null;
	deleteHref: string;
};

export class CredentialApiError extends Error {
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
		this.name = "CredentialApiError";
		this.status = status;
		this.code = code;
		this.correlationId = correlationId;
	}
}

export class StepUpRequired extends Error {
	constructor() {
		super("Passkey management needs a fresh sign-in.");
		this.name = "StepUpRequired";
	}
}

function methodsRoot(): string {
	return `/${tenantId()}/api/v1.0/me/methods`;
}

export function resolveCredentialUrl(href: string): URL {
	let url: URL;
	try {
		url = new URL(href, credentialApiOrigin());
	} catch {
		throw new CredentialApiError("Passkey link is not a valid URL.", 400);
	}

	if (url.origin !== credentialApiOrigin()) {
		throw new CredentialApiError("Passkey link is outside this tenant.", 400);
	}

	if (!url.pathname.startsWith(methodsRoot())) {
		throw new CredentialApiError(
			"Passkey link is not a credential method.",
			400,
		);
	}

	return url;
}

function assertActivateUrl(href: string): URL {
	const url = resolveCredentialUrl(href);
	if (!/\/fido\/[^/]+\/activate$/.test(url.pathname)) {
		throw new CredentialApiError("Passkey activation link is invalid.", 400);
	}
	return url;
}

function assertDeleteUrl(href: string): URL {
	const url = resolveCredentialUrl(href);
	if (!/\/fido\/[^/]+$/.test(url.pathname)) {
		throw new CredentialApiError("Passkey delete link is invalid.", 400);
	}
	return url;
}

async function credentialError(
	response: Response,
): Promise<CredentialApiError> {
	let code: string | undefined;
	let message = `Credential management API returned ${response.status}.`;
	let correlationId: string | undefined;

	try {
		const body = (await response.json()) as {
			error?: { code?: string; message?: string; correlationId?: string };
		};
		code = body.error?.code;
		message = body.error?.message ?? message;
		correlationId = body.error?.correlationId;
	} catch {
		// The body is not the documented error envelope.
	}

	return new CredentialApiError(message, response.status, code, correlationId);
}

async function credentialFetch(
	url: URL,
	accessToken: string,
	init?: { method?: string; body?: string },
): Promise<Response> {
	const response = await fetch(url, {
		method: init?.method ?? "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/hal+json",
			...(init?.body ? { "Content-Type": "application/json" } : {}),
		},
		body: init?.body,
		cache: "no-store",
	});

	if (!response.ok) {
		throw await credentialError(response);
	}

	return response;
}

export async function listPasskeys(accessToken: string): Promise<{
	methods: PasskeyMethod[];
	enrollHref: string | null;
}> {
	const response = await credentialFetch(
		new URL(`${credentialApiBase()}/me/methods`),
		accessToken,
	);
	const body = (await response.json()) as ListResponse;
	const methods = (body._embedded?.methods ?? []).flatMap((method) => {
		const deleteHref = method._links?.delete?.href;
		if (!method.id || !deleteHref) return [];
		return [
			{
				id: method.id,
				displayName: method.displayName ?? null,
				model: method.model ?? null,
				createdDateTime: method.createdDateTime ?? null,
				deleteHref,
			},
		];
	});

	const enrollHref =
		body._links?.enroll?.find((link) => link.name === "fido")?.href ?? null;

	return { methods, enrollHref };
}

export async function beginPasskeyRegistration(
	accessToken: string,
	enrollHref: string,
): Promise<{
	publicKey: PublicKeyCreationJSON;
	continuationToken: string;
	activateHref: string;
}> {
	const url = resolveCredentialUrl(enrollHref);
	if (!url.pathname.endsWith("/me/methods/fido")) {
		throw new CredentialApiError("Passkey enrollment link is invalid.", 400);
	}

	const response = await credentialFetch(url, accessToken, { method: "POST" });
	if (response.status !== 202) {
		throw new CredentialApiError(
			"Passkey registration did not return creation options.",
			response.status,
		);
	}

	const body = (await response.json()) as BeginResponse;
	const activateHref = body._links?.activate?.href;
	if (!body.publicKey || !body.continuationToken || !activateHref) {
		throw new CredentialApiError(
			"Passkey registration response was incomplete.",
			502,
		);
	}

	return {
		publicKey: body.publicKey,
		continuationToken: body.continuationToken,
		activateHref,
	};
}

export async function activatePasskey(
	accessToken: string,
	input: {
		activateHref: string;
		continuationToken: string;
		displayName: string;
		credential: {
			id: string;
			attestationObject: string;
			clientDataJSON: string;
		};
	},
): Promise<PasskeyMethod> {
	const url = assertActivateUrl(input.activateHref);
	const response = await credentialFetch(url, accessToken, {
		method: "POST",
		body: JSON.stringify({
			continuationToken: input.continuationToken,
			displayName: input.displayName,
			publicKeyCredential: input.credential,
		}),
	});

	if (response.status !== 201) {
		throw new CredentialApiError(
			"Passkey activation did not complete.",
			response.status,
		);
	}

	const body = (await response.json()) as ListedMethod;
	const deleteHref = body._links?.delete?.href;
	if (!body.id || !deleteHref) {
		throw new CredentialApiError(
			"Passkey activation response was incomplete.",
			502,
		);
	}

	return {
		id: body.id,
		displayName: body.displayName ?? input.displayName,
		model: body.model ?? null,
		createdDateTime: body.createdDateTime ?? null,
		deleteHref,
	};
}

export async function deletePasskey(
	accessToken: string,
	deleteHref: string,
): Promise<void> {
	const url = assertDeleteUrl(deleteHref);
	const response = await credentialFetch(url, accessToken, {
		method: "DELETE",
	});
	if (response.status !== 204) {
		throw new CredentialApiError(
			"Passkey deletion did not complete.",
			response.status,
		);
	}
}
