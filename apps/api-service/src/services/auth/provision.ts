import type { CreateAuthSessionRequest } from "@repo/dtos/validation";
import type { Invite, User } from "@/generated/prisma/client.js";
import prisma from "@/helpers/prisma-client.js";
import { apiError } from "@/utils/apiError.js";
import type { EntraIdClaims } from "./session.js";

type AuthSessionResult = {
	statusCode: 200 | 201;
	user: User;
	organization: Awaited<
		ReturnType<typeof prisma.organization.findUnique>
	> | null;
	needsOnboarding: boolean;
};

function buildAuthSessionResult(
	statusCode: 200 | 201,
	user: User,
	organization: AuthSessionResult["organization"],
): AuthSessionResult {
	const needsOnboarding = user.status === "PENDING_ONBOARDING";
	return {
		statusCode,
		user,
		organization: needsOnboarding ? null : organization,
		needsOnboarding,
	};
}

async function findExistingUser(oid: string) {
	return prisma.user.findUnique({
		where: {
			identityProvider_externalId: {
				identityProvider: "ENTRA_ID",
				externalId: oid,
			},
		},
	});
}

async function loadOrganization(organizationId: string) {
	return prisma.organization.findUniqueOrThrow({
		where: { id: organizationId },
	});
}

async function provisionFromInvite(
	claims: EntraIdClaims,
	invite: Pick<Invite, "id" | "organizationId" | "role">,
): Promise<AuthSessionResult> {
	const user = await prisma.$transaction(async (tx) => {
		const created = await tx.user.create({
			data: {
				identityProvider: "ENTRA_ID",
				externalId: claims.oid,
				email: claims.email,
				name: claims.name,
				role: invite.role,
				organizationId: invite.organizationId,
				status: "ACTIVE",
			},
		});

		await tx.invite.update({
			where: { id: invite.id },
			data: { status: "ACCEPTED", acceptedAt: new Date() },
		});

		return created;
	});

	const organization = await loadOrganization(invite.organizationId);
	return buildAuthSessionResult(201, user, organization);
}

async function provisionPendingApproval(
	claims: EntraIdClaims,
	organizationId: string,
): Promise<AuthSessionResult> {
	const user = await prisma.user.create({
		data: {
			identityProvider: "ENTRA_ID",
			externalId: claims.oid,
			email: claims.email,
			name: claims.name,
			role: null,
			organizationId,
			status: "PENDING_APPROVAL",
		},
	});

	const organization = await loadOrganization(organizationId);
	return buildAuthSessionResult(201, user, organization);
}

async function provisionPendingOnboarding(
	claims: EntraIdClaims,
): Promise<AuthSessionResult> {
	const user = await prisma.user.create({
		data: {
			identityProvider: "ENTRA_ID",
			externalId: claims.oid,
			email: claims.email,
			name: claims.name,
			role: null,
			organizationId: null,
			status: "PENDING_ONBOARDING",
		},
	});

	return buildAuthSessionResult(201, user, null);
}

async function provisionAuthSession(
	claims: EntraIdClaims,
	input: CreateAuthSessionRequest = {},
): Promise<AuthSessionResult> {
	const existingUser = await findExistingUser(claims.oid);
	if (existingUser) {
		if (existingUser.status === "PENDING_ONBOARDING") {
			return buildAuthSessionResult(200, existingUser, null);
		}

		if (!existingUser.organizationId) {
			throw apiError(
				500,
				"User has no organization but is not pending onboarding",
			);
		}

		const organization = await loadOrganization(existingUser.organizationId);
		return buildAuthSessionResult(200, existingUser, organization);
	}

	const invite = await prisma.invite.findFirst({
		where: {
			email: claims.email,
			status: "PENDING",
			expiresAt: { gt: new Date() },
		},
	});
	if (invite) {
		return provisionFromInvite(claims, invite);
	}

	if (input.organizationSubdomain) {
		const organization = await prisma.organization.findUnique({
			where: { subdomain: input.organizationSubdomain },
		});
		if (!organization) {
			throw apiError(
				404,
				`No organization with subdomain: ${input.organizationSubdomain}`,
			);
		}

		return provisionPendingApproval(claims, organization.id);
	}

	return provisionPendingOnboarding(claims);
}

export { type AuthSessionResult, buildAuthSessionResult, provisionAuthSession };
