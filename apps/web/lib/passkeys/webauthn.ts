export type PublicKeyCreationJSON = {
	rp: { id: string; name: string };
	user: { id: string; name: string; displayName: string };
	challenge: string;
	pubKeyCredParams: PublicKeyCredentialParameters[];
	timeout?: number;
	excludeCredentials?: Array<{
		id: string;
		type: PublicKeyCredentialType;
		transports?: AuthenticatorTransport[];
	}>;
	authenticatorSelection?: AuthenticatorSelectionCriteria;
	attestation?: AttestationConveyancePreference;
	extensions?: AuthenticationExtensionsClientInputs;
};

export type PasskeyCredentialJSON = {
	id: string;
	attestationObject: string;
	clientDataJSON: string;
};

function base64urlToBuffer(value: string): Uint8Array<ArrayBuffer> {
	const padded = value.replace(/-/g, "+").replace(/_/g, "/");
	const pad =
		padded.length % 4 === 0
			? padded
			: padded + "=".repeat(4 - (padded.length % 4));
	const binary = atob(pad);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index++) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

export function bufferToBase64url(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

export function creationOptionsFromJson(
	json: PublicKeyCreationJSON,
): CredentialCreationOptions {
	const publicKey: PublicKeyCredentialCreationOptions = {
		rp: json.rp,
		user: {
			id: base64urlToBuffer(json.user.id),
			name: json.user.name,
			displayName: json.user.displayName,
		},
		challenge: base64urlToBuffer(json.challenge),
		pubKeyCredParams: json.pubKeyCredParams,
		excludeCredentials: json.excludeCredentials?.map((credential) => ({
			type: credential.type,
			id: base64urlToBuffer(credential.id),
			transports: credential.transports,
		})),
		authenticatorSelection: json.authenticatorSelection,
		attestation: json.attestation,
		extensions: json.extensions,
	};

	if (json.timeout && json.timeout > 0) {
		publicKey.timeout = json.timeout;
	}

	return { publicKey };
}

export async function createPasskey(
	json: PublicKeyCreationJSON,
): Promise<PasskeyCredentialJSON> {
	if (!window.PublicKeyCredential) {
		throw new Error("This browser cannot create a passkey.");
	}

	const credential = await navigator.credentials.create(
		creationOptionsFromJson(json),
	);
	if (credential?.type !== "public-key") {
		throw new Error("The authenticator did not return a passkey.");
	}

	const attestation = (credential as PublicKeyCredential)
		.response as AuthenticatorAttestationResponse;

	return {
		id: credential.id,
		attestationObject: bufferToBase64url(attestation.attestationObject),
		clientDataJSON: bufferToBase64url(attestation.clientDataJSON),
	};
}
