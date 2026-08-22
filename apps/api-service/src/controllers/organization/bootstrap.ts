import {
	authResponseSchema,
	createOrganizationBootstrapRequestSchema,
} from "@repo/dtos/validation";
import type { Request, Response } from "express";
import { completeOrganizationBootstrap } from "@/services/organization/bootstrap.js";
import { apiError, sendApiError } from "@/utils/apiError.js";
import { parseBody, sendJson } from "@/validation/parseRequest.js";

const bootstrapOrganization = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!req.auth) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const body = parseBody(createOrganizationBootstrapRequestSchema, req.body);
		const { user, organization, needsOnboarding } =
			await completeOrganizationBootstrap(req.auth, body);

		sendJson(res, 201, authResponseSchema, {
			user,
			organization,
			needsOnboarding,
		});
	} catch (error) {
		sendApiError(res, error, "POST /organizations/bootstrap failed");
	}
};

export { bootstrapOrganization };
