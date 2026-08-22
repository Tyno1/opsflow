import type {
	CreateOrganizationInviteRequest,
	GetOrganizationsInvitesQueryParams,
	Invite as InviteDto,
} from "@repo/dtos/validation";
import type { Invite } from "@/generated/prisma/client.js";
import prisma from "@/helpers/prisma-client.js";
import type { EntraIdClaims } from "@/services/auth/session.js";
import { apiError } from "@/utils/apiError.js";

const INVITE_TTL_DAYS = 7;

function toInviteDto(invite: Invite): InviteDto {
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

async function requireInviteAdmin(claims: EntraIdClaims) {
	const actor = await prisma.user.findUnique({
		where: {
			identityProvider_externalId: {
				identityProvider: "ENTRA_ID",
				externalId: claims.oid,
			},
		},
	});

	const organizationId = actor?.organizationId;
	const role = actor?.role;

	if (!actor || !organizationId || !role) {
		throw apiError(403, "Insufficient permissions");
	}

	if (role !== "OWNER" && role !== "ADMIN") {
		throw apiError(403, "Insufficient permissions");
	}

	return { id: actor.id, organizationId, role };
}

async function createOrganizationInvite(
	claims: EntraIdClaims,
	input: CreateOrganizationInviteRequest,
): Promise<InviteDto> {
	const actor = await requireInviteAdmin(claims);

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

	return toInviteDto(invite);
}

async function listOrganizationInvites(
	claims: EntraIdClaims,
	query: GetOrganizationsInvitesQueryParams = {},
): Promise<InviteDto[]> {
	const actor = await requireInviteAdmin(claims);

	const invites = await prisma.invite.findMany({
		where: {
			organizationId: actor.organizationId,
			...(query.status ? { status: query.status } : {}),
		},
		orderBy: { createdAt: "desc" },
	});

	return invites.map(toInviteDto);
}

async function deleteOrganizationInvite(
	claims: EntraIdClaims,
	inviteId: string,
): Promise<void> {
	const actor = await requireInviteAdmin(claims);

	const invite = await prisma.invite.findFirst({
		where: {
			id: inviteId,
			organizationId: actor.organizationId,
		},
	});

	if (!invite) {
		throw apiError(404, "Invite not found");
	}

	if (invite.status === "ACCEPTED") {
		throw apiError(409, "Invite already accepted, cannot revoke");
	}

	if (invite.status === "REVOKED") {
		return;
	}

	await prisma.invite.update({
		where: { id: inviteId },
		data: { status: "REVOKED" },
	});
}

export {
	createOrganizationInvite,
	deleteOrganizationInvite,
	listOrganizationInvites,
};
