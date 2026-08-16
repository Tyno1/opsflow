import type { NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth } from "@/lib/auth";
import { PUBLIC_PATHS } from "./lib/rbac/route-access";

/**
 * Runs before matched routes (see `config.matcher` below).
 * `req.auth` is the Auth.js session (null if signed out).
 *
 * Add your public-path skips, redirects, role checks, and rewrites here.
 */
export default auth((req: NextAuthRequest, _event: NextFetchEvent) => {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/api/")) {
		return NextResponse.next();
	}

	if (PUBLIC_PATHS.includes(pathname)) {
		return NextResponse.next();
	}


	if (!req.auth) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
});


export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
