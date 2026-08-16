import { randomUUID } from "node:crypto";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../helpers/prisma-client.js";
import { apiError } from "../utils/apiError.js";
import {
	type AuthSessionResult,
	buildAuthSessionResult,
} from "./authSessionService.js";
import type { EntraIdClaims } from "./SessionService.js";

const FREE_EMAIL_DOMAINS = new Set([
	"gmail.com",
	"googlemail.com",
	"outlook.com",
	"hotmail.com",
	"live.com",
	"yahoo.com",
	"icloud.com",
	"me.com",
	"protonmail.com",
	"proton.me",
	"aol.com",
	"gmx.com",
	"mail.com",
]);

function emailDomain(email: string): string {
	const domain = email.split("@")[1]?.toLowerCase();
	if (!domain) {
		throw apiError(400, "Invalid email address");
	}
	return domain;
}

function isFreeEmailDomain(domain: string): boolean {
	return FREE_EMAIL_DOMAINS.has(domain);
}

async function completeOrganizationBootstrap(
	claims: EntraIdClaims,
	input: { name: string; subdomain: string },
): Promise<AuthSessionResult> {
	const user = await prisma.user.findUnique({
		where: {
			identityProvider_externalId: {
				identityProvider: "ENTRA_ID",
				externalId: claims.oid,
			},
		},
	});

	if (user?.status !== "PENDING_ONBOARDING") {
		throw apiError(403, "No PENDING_ONBOARDING user exists for this identity");
	}

	const existingSubdomain = await prisma.organization.findUnique({
		where: { subdomain: input.subdomain },
	});
	if (existingSubdomain) {
		throw apiError(409, "Subdomain already taken");
	}

	const domain = emailDomain(user.email);
	const shouldRegisterDomain = !isFreeEmailDomain(domain);

	try {
		const result = await prisma.$transaction(async (tx) => {
			const organization = await tx.organization.create({
				data: {
					name: input.name,
					subdomain: input.subdomain,
					supportEmail: user.email,
				},
			});

			if (shouldRegisterDomain) {
				await tx.organizationDomain.create({
					data: {
						organizationId: organization.id,
						domain,
						verified: false,
						verificationToken: randomUUID(),
					},
				});
			}

			const updatedUser = await tx.user.update({
				where: { id: user.id },
				data: {
					organizationId: organization.id,
					role: "OWNER",
					status: "ACTIVE",
				},
			});

			return { user: updatedUser, organization };
		});

		return buildAuthSessionResult(201, result.user, result.organization);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			throw apiError(
				409,
				"Subdomain already taken, or email domain already claimed by another organization",
			);
		}

		throw error;
	}
}

export { completeOrganizationBootstrap };
