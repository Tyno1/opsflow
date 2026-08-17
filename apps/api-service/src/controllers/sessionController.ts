import type { Request, Response } from "express";
import { provisionAuthSession } from "../services/authSessionService.js";
import { syncSession } from "../services/SessionService.js";
import { apiError, sendApiError } from "../utils/apiError.js";

const validateSession = async (req: Request, res: Response): Promise<void> => {
	try {
		const authorization = req.headers.authorization;
		const organizationSubdomain = req.body?.organizationSubdomain as
			| string
			| undefined;

		if (
			!authorization ||
			Array.isArray(authorization) ||
			!authorization.startsWith("Bearer ")
		) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const idToken = authorization.slice("Bearer ".length);
		const claims = await syncSession(idToken, organizationSubdomain);
		const { statusCode, user, organization, needsOnboarding } =
			await provisionAuthSession(claims, organizationSubdomain);

		res.status(statusCode).json({ user, organization, needsOnboarding });
	} catch (error) {
		sendApiError(res, error, "POST /auth/session failed");
	}
};

export { validateSession };
