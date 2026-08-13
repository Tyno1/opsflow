import type { Role } from "@repo/dtos/src/entities/user.js";

export const PUBLIC_PATHS = ["/", "/login", "/register"];

export type RouteAccessRule = {
	pathPrefix: string;
	roles?: Role[];
	allowPendingApproval?: boolean;
};

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
	{
		pathPrefix: "/pending-approval",
		allowPendingApproval: true,
	},
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

export const LOGIN_PATH = "/login";

export const PENDING_APPROVAL_PATH = "/pending-approval";

export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";
