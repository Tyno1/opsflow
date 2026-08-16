import NextAuth, { type NextAuthResult } from "next-auth";
import AzureADB2C from "next-auth/providers/azure-ad-b2c";
import { syncAppSession } from "@/lib/api/sync-app-session";

const ciamTenantId = process.env.AUTH_CIAM_TENANT_ID ?? "";

const result = NextAuth({
	trustHost: true,
	providers: [
		AzureADB2C({
			clientId: process.env.AUTH_ENTRA_ID_CLIENT_ID ?? "",
			clientSecret: process.env.AUTH_ENTRA_ID_CLIENT_SECRET ?? "",
			issuer: `https://${ciamTenantId}.ciamlogin.com/${ciamTenantId}/v2.0`,
			authorization: {
				params: {
					scope: "openid profile email",
					prompt: "login",
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

			token.accessToken = account.access_token;
			token.idToken = account.id_token;

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
		role?: string | null;
		status?: string | null;
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
			role?: string | null;
			status?: string | null;
			organizationId?: string | null;
			needsOnboarding?: boolean;
		};
	}
}

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
