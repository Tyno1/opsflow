import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { apiError } from "@/utils/apiError.js";
import { requireEnv } from "@/utils/requireEnv.js";

const ciamTenantId = requireEnv("AUTH_CIAM_TENANT_ID");
const issuer = `https://${ciamTenantId}.ciamlogin.com/${ciamTenantId}/v2.0`;
const audience = requireEnv("AUTH_ENTRA_ID_CLIENT_ID");
const jwks = createRemoteJWKSet(
	new URL(
		`https://${ciamTenantId}.ciamlogin.com/${ciamTenantId}/discovery/v2.0/keys`,
	),
);

type EntraIdClaims = {
	email: string;
	oid: string;
	name: string;
};

function parseEntraIdClaims(payload: JWTPayload): EntraIdClaims {
	const oid = payload.oid ?? payload.sub;
	if (typeof oid !== "string" || oid.length === 0) {
		throw apiError(401, "Token missing required claim: oid/sub");
	}

	const email =
		typeof payload.email === "string"
			? payload.email
			: typeof payload.preferred_username === "string"
				? payload.preferred_username
				: undefined;
	if (!email) {
		throw apiError(401, "Token missing required claim: email");
	}

	const name =
		typeof payload.name === "string" && payload.name.length > 0
			? payload.name
			: email;

	return { email, oid, name };
}

async function verifyEntraIdToken(idToken: string): Promise<JWTPayload> {
	const { payload } = await jwtVerify(idToken, jwks, { issuer, audience });
	return payload;
}

async function syncSession(
	idToken: string,
	_organizationSubdomain?: string,
): Promise<EntraIdClaims> {
	return parseEntraIdClaims(await verifyEntraIdToken(idToken));
}

export { type EntraIdClaims, syncSession, verifyEntraIdToken };
