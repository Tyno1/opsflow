import type { Role } from "@repo/dtos/src/entities/user.js";
import type { NextAuthRequest } from "next-auth";

export const LOGIN_PATH = "/login";
export const ONBOARDING_PATH = "/onboarding";
export const PENDING_APPROVAL_PATH = "/pending-approval";
export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

export const PUBLIC_PATHS = ["/", LOGIN_PATH, "/register"] as const;

export type RouteAccessRule = {
	pathPrefix: string;
	roles: Role[];
};

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
	{
		pathPrefix: "/admin",
		roles: ["OWNER", "ADMIN"],
	},
	{
		pathPrefix: "/tickets",
		roles: ["OWNER", "ADMIN", "AGENT", "REQUESTER", "VENDOR"],
	},
	{
		pathPrefix: "/dashboard",
		roles: ["OWNER", "ADMIN", "AGENT", "REQUESTER", "VENDOR"],
	},
];

export function matchesPath(pathname: string, prefix: string): boolean {
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((path) =>
		path === "/" ? pathname === "/" : matchesPath(pathname, path),
	);
}

export function defaultPathForUser(
	user: NonNullable<NextAuthRequest["auth"]>["user"],
) {
	if (user.needsOnboarding || user.status === "PENDING_ONBOARDING") {
		return ONBOARDING_PATH;
	}

	if (user.status === "PENDING_APPROVAL") {
		return PENDING_APPROVAL_PATH;
	}

	return DEFAULT_AUTHENTICATED_PATH;
}
