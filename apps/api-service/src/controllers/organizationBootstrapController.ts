import type { Request, Response } from "express";
import { completeOrganizationBootstrap } from "../services/organizationBootstrapService.js";
import { syncSession } from "../services/SessionService.js";
import { apiError, sendApiError } from "../utils/apiError.js";

const bootstrapOrganization = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const authorization = req.headers.authorization;
		const name = req.body?.name as string | undefined;
		const subdomain = req.body?.subdomain as string | undefined;

		if (
			!authorization ||
			Array.isArray(authorization) ||
			!authorization.startsWith("Bearer ")
		) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		if (!name || !subdomain) {
			throw apiError(400, "name and subdomain are required");
		}

		const idToken = authorization.slice("Bearer ".length);
		const claims = await syncSession(idToken);
		const { user, organization, needsOnboarding } =
			await completeOrganizationBootstrap(claims, { name, subdomain });

		res.status(201).json({ user, organization, needsOnboarding });
	} catch (error) {
		sendApiError(res, error, "POST /organizations/bootstrap failed");
	}
};

export { bootstrapOrganization };
