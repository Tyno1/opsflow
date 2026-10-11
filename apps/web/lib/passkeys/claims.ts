import {
	PASSKEY_MFA_WINDOW_SECONDS,
	PASSKEY_RESOURCE_ID,
	PASSKEY_SCOPE_NAME,
	type PasskeyTokenState,
} from "@/lib/passkeys/config";

type AccessTokenClaims = {
	aud?: string | string[];
	scp?: string | string[];
	iat?: number;
};

export type PasskeyTokenInspection = {
	status: PasskeyTokenState;
	audience?: string;
	scopes?: string;
};

function decodeSegment(segment: string): AccessTokenClaims | null {
	try {
		const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
		const pad =
			padded.length % 4 === 0
				? padded
				: padded + "=".repeat(4 - (padded.length % 4));
		const binary = atob(pad);
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		const json = new TextDecoder().decode(bytes);
		return JSON.parse(json) as AccessTokenClaims;
	} catch {
		return null;
	}
}

function audiences(aud: string | string[] | undefined): string[] {
	if (!aud) return [];
	return Array.isArray(aud) ? aud : [aud];
}

export function grantsPasskeyScope(scope: string | undefined): boolean {
	return scope?.includes(PASSKEY_SCOPE_NAME) ?? false;
}

function isFresh(issuedAt: number | undefined): boolean {
	return (
		!!issuedAt &&
		issuedAt + PASSKEY_MFA_WINDOW_SECONDS >= Math.floor(Date.now() / 1000)
	);
}

export function inspectPasskeyToken(
	accessToken: string | undefined,
	hints?: { grantedScope?: string; issuedAt?: number; forceReady?: boolean },
): PasskeyTokenInspection {
	const grantedScope = hints?.grantedScope;
	const granted = grantsPasskeyScope(grantedScope);

	if (!accessToken) {
		return { status: "missing", scopes: grantedScope };
	}

	const claims = decodeSegment(accessToken.split(".")[1] ?? "");
	if (!claims) {
		if (hints?.forceReady && isFresh(hints.issuedAt)) {
			return { status: "ready", scopes: grantedScope };
		}
		if (!granted) return { status: "missing", scopes: grantedScope };
		return {
			status: isFresh(hints?.issuedAt) ? "ready" : "stale",
			scopes: grantedScope,
		};
	}

	const audience = audiences(claims.aud).join(" ");
	const scopes = Array.isArray(claims.scp)
		? claims.scp.join(" ")
		: (claims.scp ?? grantedScope);
	const acceptedAudience = audiences(claims.aud).some((value) =>
		value.includes(PASSKEY_RESOURCE_ID),
	);
	const scopeOk = grantsPasskeyScope(scopes) || granted;

	if (!acceptedAudience && !granted) {
		return { status: "wrong_audience", audience, scopes };
	}

	if (!scopeOk) {
		return { status: "missing_scope", audience, scopes };
	}

	const issuedAt = claims.iat ?? hints?.issuedAt;
	if (hints?.forceReady && isFresh(issuedAt)) {
		return { status: "ready", audience, scopes };
	}
	if (!isFresh(issuedAt)) {
		return { status: "stale", audience, scopes };
	}

	return { status: "ready", audience, scopes };
}
