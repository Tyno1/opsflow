import type {
	CreateOrganizationInviteRequest,
	Invite as InviteDto,
} from "@repo/dtos/validation";
import prisma from "@/helpers/prisma-client.js";
import type { EntraIdClaims } from "@/services/auth/session.js";
import { apiError } from "@/utils/apiError.js";

const INVITE_TTL_DAYS = 7;

async function createOrganizationInvite(
	claims: EntraIdClaims,
	input: CreateOrganizationInviteRequest,
): Promise<InviteDto> {
	const actor = await prisma.user.findUnique({
		where: {
			identityProvider_externalId: {
				identityProvider: "ENTRA_ID",
				externalId: claims.oid,
			},
		},
	});

	if (!actor?.organizationId || !actor.role) {
		throw apiError(403, "Insufficient permissions");
	}

	if (actor.role !== "OWNER" && actor.role !== "ADMIN") {
		throw apiError(403, "Insufficient permissions");
	}

	const existingInvite = await prisma.invite.findFirst({
		where: {
			organizationId: actor.organizationId,
			email: input.email,
			status: "PENDING",
			expiresAt: { gt: new Date() },
		},
	});

	if (existingInvite) {
		throw apiError(
			409,
			"A pending invite already exists for this email in this organization",
		);
	}

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + INVITE_TTL_DAYS);

	const invite = await prisma.invite.create({
		data: {
			organizationId: actor.organizationId,
			email: input.email,
			role: input.role,
			invitedByUserId: actor.id,
			expiresAt,
		},
	});

	return {
		id: invite.id,
		organizationId: invite.organizationId,
		email: invite.email,
		role: invite.role,
		status: invite.status,
		invitedByUserId: invite.invitedByUserId ?? undefined,
		expiresAt: invite.expiresAt.toISOString(),
		createdAt: invite.createdAt.toISOString(),
		acceptedAt: invite.acceptedAt?.toISOString() ?? null,
	} satisfies InviteDto;
}

export { createOrganizationInvite };
