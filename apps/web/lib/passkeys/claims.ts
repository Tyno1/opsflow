import {
	PASSKEY_MFA_WINDOW_SECONDS,
	type PasskeyTokenState,
} from "@/lib/passkeys/config";

const OBJECT_ID =
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

type SignInClaims = {
	oid?: string;
	amr?: string | string[];
	auth_time?: number;
	iat?: number;
	exp?: number;
};

export type PasskeyTokenInspection = {
	status: PasskeyTokenState;
	userId?: string;
	methods?: string;
	authenticatedAt?: number;
};

function decodeSegment(segment: string): SignInClaims | null {
	try {
		const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
		const pad =
			padded.length % 4 === 0
				? padded
				: padded + "=".repeat(4 - (padded.length % 4));
		const binary = atob(pad);
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		const json = new TextDecoder().decode(bytes);
		return JSON.parse(json) as SignInClaims;
	} catch {
		return null;
	}
}

function methods(amr: string | string[] | undefined): string[] {
	if (!amr) return [];
	return Array.isArray(amr) ? amr : amr.split(" ");
}

function isRecent(authenticatedAt: number | undefined): boolean {
	return (
		!!authenticatedAt &&
		authenticatedAt + PASSKEY_MFA_WINDOW_SECONDS >=
			Math.floor(Date.now() / 1000)
	);
}

export function inspectPasskeyToken(
	idToken: string | undefined,
): PasskeyTokenInspection {
	const claims = idToken ? decodeSegment(idToken.split(".")[1] ?? "") : null;
	if (!claims) return { status: "missing" };

	const authenticatedAt = claims.auth_time ?? claims.iat;
	const usedMethods = methods(claims.amr);
	const userId = OBJECT_ID.test(claims.oid ?? "") ? claims.oid : undefined;
	const report = {
		userId,
		methods: usedMethods.join(" ") || undefined,
		authenticatedAt,
	};

	const now = Math.floor(Date.now() / 1000);
	if (claims.exp !== undefined && claims.exp < now) {
		return { status: "stale", ...report };
	}

	if (!usedMethods.some((method) => method.toLowerCase() === "mfa")) {
		return { status: "mfa_required", ...report };
	}

	if (!isRecent(authenticatedAt)) {
		return { status: "stale", ...report };
	}

	if (!userId) return { status: "missing", ...report };

	return { status: "ready", ...report };
}
