import type { NextFunction, Request, Response } from "express";
import { syncSession } from "@/services/auth/session.js";
import { apiError } from "@/utils/apiError.js";

export default async function middleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	try {
		const authorization = req.headers.authorization;
		if (
			!authorization ||
			Array.isArray(authorization) ||
			!authorization.startsWith("Bearer ")
		) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const idToken = authorization.slice("Bearer ".length);
		req.auth = await syncSession(idToken);

		next();
	} catch (error) {
		next(error);
	}
}
