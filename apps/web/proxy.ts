import type { NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth } from "@/lib/auth";
import {
	DEFAULT_AUTHENTICATED_PATH,
	defaultPathForUser,
	isPublicPath,
	LOGIN_PATH,
	matchesPath,
	ONBOARDING_PATH,
	PENDING_APPROVAL_PATH,
	ROUTE_ACCESS_RULES,
} from "./lib/rbac/route-access";


export default auth((req: NextAuthRequest, _event: NextFetchEvent) => {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/api/")) {
		return NextResponse.next();
	}

	const user = req.auth?.user;

	if (isPublicPath(pathname)) {
		if (!user) {
			return NextResponse.next();
		}

		const destination = defaultPathForUser(user);
		if (destination !== pathname) {
			return NextResponse.redirect(new URL(destination, req.url));
		}

		return NextResponse.next();
	}

	if (!user) {
		return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
	}

	if (user.needsOnboarding || user.status === "PENDING_ONBOARDING") {
		if (!matchesPath(pathname, ONBOARDING_PATH)) {
			return NextResponse.redirect(new URL(ONBOARDING_PATH, req.url));
		}

		return NextResponse.next();
	}

	if (user.status === "PENDING_APPROVAL") {
		if (!matchesPath(pathname, PENDING_APPROVAL_PATH)) {
			return NextResponse.redirect(new URL(PENDING_APPROVAL_PATH, req.url));
		}

		return NextResponse.next();
	}

	if (user.status === "DEACTIVATED") {
		return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
	}

	const rule = ROUTE_ACCESS_RULES.find((entry) =>
		matchesPath(pathname, entry.pathPrefix),
	);

	if (
		rule &&
		(!user.role || !rule.roles.includes(user.role))
	) {
		return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_PATH, req.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
