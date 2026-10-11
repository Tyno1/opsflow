import type { Role, UserStatus } from "@repo/dtos/src/entities/user.js";
import { cookies } from "next/headers";
import NextAuth, { type NextAuthResult } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
// import AzureADB2C from "next-auth/providers/azure-ad-b2c";
import { syncAppSession } from "@/lib/api/sync-app-session";
import { grantsPasskeyScope, inspectPasskeyToken } from "@/lib/passkeys/claims";
import type { PasskeyTokenState } from "@/lib/passkeys/config";

const ciamTenantId = process.env.AUTH_CIAM_TENANT_ID ?? "";

const result = NextAuth({
	trustHost: true,
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_ENTRA_ID_CLIENT_ID ?? "",
			clientSecret: process.env.AUTH_ENTRA_ID_CLIENT_SECRET ?? "",
			issuer: `https://${ciamTenantId}.ciamlogin.com/${ciamTenantId}/v2.0`,
			authorization: {
				params: {
					scope: "openid profile email",
				},
			},
			profile(profile) {
				const claims = profile as {
					sub: string;
					oid?: string;
					name?: string;
					preferred_username?: string;
					email?: string;
					emails?: string[];
				};
				return {
					id: claims.oid ?? claims.sub,
					name: claims.name ?? claims.preferred_username,
					email: claims.email ?? claims.emails?.[0] ?? null,
					image: null,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (!account?.id_token) return token;

			const stepUpCookie = await cookies();
			const stepUp = stepUpCookie.get("passkey-step-up")?.value === "1";
			const grantedScope =
				typeof account.scope === "string" ? account.scope : undefined;
			const inspection = inspectPasskeyToken(account.access_token, {
				grantedScope,
			});
			const passkeyToken = Boolean(
				account.access_token &&
					(stepUp ||
						grantsPasskeyScope(grantedScope) ||
						grantsPasskeyScope(inspection.scopes) ||
						inspection.status === "ready" ||
						inspection.status === "stale" ||
						inspection.status === "missing_scope"),
			);

			console.info(
				"[passkey] sign-in",
				JSON.stringify({
					stepUp,
					scope: grantedScope ?? null,
					accessParts: account.access_token?.split(".").length ?? 0,
					status: inspection.status,
					audience: inspection.audience ?? null,
					scopes: inspection.scopes ?? null,
					stored: passkeyToken,
				}),
			);

			token.grantedScope = grantedScope;
			token.signInStatus = inspection.status;
			token.signInAudience = inspection.audience;
			token.signInScopes = inspection.scopes ?? grantedScope;
			if (passkeyToken && account.access_token) {
				token.passkeyAccessToken = account.access_token;
				token.passkeyIssuedAt = Math.floor(Date.now() / 1000);
				token.passkeyFromStepUp = true;
				stepUpCookie.delete("passkey-step-up");
				// The id token is only needed for session sync during this callback.
				// Keeping it beside the passkey access token makes the session
				// cookie large enough that the browser can ignore it.
				token.idToken = undefined;
				token.accessToken = undefined;
			} else {
				token.idToken = account.id_token;
				if (account.access_token) token.accessToken = account.access_token;
			}

			try {
				const { user, organization, needsOnboarding } = await syncAppSession(
					account.id_token,
				);
				if (user) {
					token.userId = user.id ?? null;
					token.externalId = user.externalId ?? null;
					token.role = user.role ?? null;
					token.status = user.status ?? "PENDING_ONBOARDING";
					token.organizationId =
						user.organizationId ?? organization?.id ?? null;
					token.needsOnboarding = needsOnboarding ?? false;
				}
			} catch {
				token.userId = null;
				token.externalId = null;
				token.role = null;
				token.status = "PENDING_ONBOARDING";
				token.organizationId = null;
				token.needsOnboarding = true;
			}

			return token;
		},
		async session({ session, token }) {
			const passkey = inspectPasskeyToken(token.passkeyAccessToken, {
				grantedScope: token.grantedScope,
				issuedAt: token.passkeyIssuedAt,
				forceReady: token.passkeyFromStepUp === true,
			});
			const passkeyStatus =
				passkey.status === "missing" && token.signInStatus
					? token.signInStatus
					: passkey.status;
			if (session.user) {
				session.user.id = token.userId ?? token.sub ?? "";
				session.user.externalId = token.externalId ?? undefined;
				session.user.email = token.email ?? "";
				session.user.accessToken = token.accessToken ?? "";
				session.user.idToken = token.idToken ?? "";
				session.user.role = token.role ?? null;
				session.user.status = token.status ?? "PENDING_ONBOARDING";
				session.user.organizationId = token.organizationId ?? null;
				session.user.needsOnboarding = token.needsOnboarding ?? false;
				session.user.passkeyStatus = passkeyStatus;
				session.user.passkeyAudience = passkey.audience ?? token.signInAudience;
				session.user.passkeyScopes = passkey.scopes ?? token.signInScopes;
			}

			return session;
		},
	},
});

declare module "@auth/core/jwt" {
	interface JWT {
		userId?: string | null;
		externalId?: string | null;
		accessToken?: string;
		idToken?: string;
		passkeyAccessToken?: string;
		passkeyIssuedAt?: number;
		grantedScope?: string;
		signInStatus?: PasskeyTokenState;
		signInAudience?: string;
		signInScopes?: string;
		passkeyFromStepUp?: boolean;
		role?: Role | null;
		status?: UserStatus | null;
		organizationId?: string | null;
		needsOnboarding?: boolean;
	}
}

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			externalId?: string;
			email: string;
			accessToken: string;
			idToken: string;
			role?: Role | null;
			status?: UserStatus | null;
			organizationId?: string | null;
			needsOnboarding?: boolean;
			passkeyStatus: PasskeyTokenState;
			passkeyAudience?: string;
			passkeyScopes?: string;
		};
	}
}

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
