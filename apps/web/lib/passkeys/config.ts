/** Microsoft Entra credential management API (Me-CredentialProfileManagement). */
export const PASSKEY_RESOURCE_ID = "6bf38b3c-a70f-49aa-a1d9-10e4cc74dde9";

export const PASSKEY_SCOPE = `api://${PASSKEY_RESOURCE_ID}/Me.UserAuthenticationMethod.Passkey.ReadWrite`;

/** Registration requires MFA within this window. The step-up token's `iat` is that clock. */
export const PASSKEY_MFA_WINDOW_SECONDS = 5 * 60;

export const PASSKEY_SCOPE_NAME =
	"Me.UserAuthenticationMethod.Passkey.ReadWrite";

export type PasskeyTokenState =
	| "missing"
	| "ready"
	| "stale"
	| "wrong_audience"
	| "missing_scope";

export function tenantId(): string {
	const id = process.env.AUTH_CIAM_TENANT_ID;
	if (!id) {
		throw new Error("AUTH_CIAM_TENANT_ID is not set");
	}
	return id;
}

export function credentialApiOrigin(): string {
	const subdomain = process.env.AUTH_CIAM_TENANT_SUBDOMAIN || tenantId();
	return `https://${subdomain}.ciamlogin.com`;
}

export function credentialApiBase(): string {
	return `${credentialApiOrigin()}/${tenantId()}/api/v1.0`;
}
