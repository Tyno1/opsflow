import {
	createOrganizationInviteRequestSchema,
	getOrganizationsInvitesQueryParamsSchema,
	inviteSchema,
} from "@repo/dtos/validation";
import type { Request, Response } from "express";
import { z } from "zod";
import {
	createOrganizationInvite,
	deleteOrganizationInvite,
	listOrganizationInvites,
} from "@/services/organization/invite.js";
import { apiError, sendApiError } from "@/utils/apiError.js";
import { parseBody, parseQuery, sendJson } from "@/validation/parseRequest.js";

const inviteListSchema = z.array(inviteSchema);

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

const getOrganisationInvite = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!req.auth) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const query = parseQuery(
			getOrganizationsInvitesQueryParamsSchema,
			req.query,
		);
		const invites = await listOrganizationInvites(req.auth, query);

		sendJson(res, 200, inviteListSchema, invites);
	} catch (error) {
		sendApiError(res, error, "GET /organizations/invites failed");
	}
};

const deleteOrganisationInvite = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!req.auth) {
			throw apiError(401, "Unauthorized, bearer token is required");
		}

		const inviteIdResult = z.uuid().safeParse(req.params.inviteId);
		if (!inviteIdResult.success) {
			throw apiError(400, "Invalid invite ID");
		}

		await deleteOrganizationInvite(req.auth, inviteIdResult.data);

		res.sendStatus(204);
	} catch (error) {
		sendApiError(res, error, "DELETE /organizations/invites/:inviteId failed");
	}
};

export { createOrganisationInvite, deleteOrganisationInvite, getOrganisationInvite };
