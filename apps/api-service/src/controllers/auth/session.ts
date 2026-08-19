import {
	authResponseSchema,
	createAuthSessionRequestSchema,
} from "@repo/dtos/validation";
import type { Request, Response } from "express";
import { provisionAuthSession } from "@/services/auth/authSession.js";
import { apiError, sendApiError } from "@/utils/apiError.js";
import { parseBody, sendJson } from "@/validation/parseRequest.js";

const validateSession = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.auth) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const body = parseBody(createAuthSessionRequestSchema, req.body ?? {});
		const { statusCode, user, organization, needsOnboarding } =
			await provisionAuthSession(req.auth, body);

		sendJson(res, statusCode, authResponseSchema, {
			user,
			organization,
			needsOnboarding,
		});
	} catch (error) {
		sendApiError(res, error, "POST /auth/session failed");
	}
};

export { validateSession };
