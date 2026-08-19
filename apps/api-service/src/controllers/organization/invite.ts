import {
	createOrganizationInviteRequestSchema,
	inviteSchema,
} from "@repo/dtos/validation";
import type { Request, Response } from "express";
import { createOrganizationInvite } from "@/services/organization/invite.js";
import { apiError, sendApiError } from "@/utils/apiError.js";
import { parseBody, sendJson } from "@/validation/parseRequest.js";

const createOrganisationInvite = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!req.auth) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const body = parseBody(createOrganizationInviteRequestSchema, req.body);
		const invite = await createOrganizationInvite(req.auth, body);

		sendJson(res, 201, inviteSchema, invite);
	} catch (error) {
		sendApiError(res, error, "POST /organizations/invites failed");
	}
};

export { createOrganisationInvite };
