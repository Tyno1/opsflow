import type { SessionPostResponse } from "@repo/dtos/src/endpoints/auth/session/post.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/v1";

export async function syncAppSession(
	accessToken: string,
	options?: { organizationSubdomain?: string },
): Promise<SessionPostResponse> {
	const response = await fetch(`${API_BASE_URL}/auth/session`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			organizationSubdomain: options?.organizationSubdomain,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`POST /auth/session failed: ${response.status} ${response.statusText}`,
		);
	}

	return response.json() ;
}
