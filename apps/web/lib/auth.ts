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
				return {
					id: profile.sub,
					name: profile.name ?? profile.preferred_username,
					email: (profile as { email?: string }).email ?? profile.emails?.[0] ?? null,
					image: null,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (!account?.access_token) return token;

			token.accessToken = account.access_token;
			token.idToken = account.id_token;

			try {
				const { user, organization } = await syncAppSession(
					account.access_token,
				);
				if (user && organization) {
					token.role = user.role ?? null;
					token.status = user.status ?? "PENDING_APPROVAL";
					token.organizationId = organization.id ?? null;
				}
			} catch {
				token.role = null;
				token.status = "PENDING_APPROVAL";
				token.organizationId = null;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
});

declare module "@auth/core/jwt" {
	interface JWT {
		accessToken?: string;
		idToken?: string;
		role?: string | null;
		status?: string | null;
		organizationId?: string | null;
	}
}

declare module "next-auth" {
	interface Session {
		user: { id: string };
	}
}

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
