import { describe, expect, it } from "vitest";
import {
	DEFAULT_AUTHENTICATED_PATH,
	defaultPathForUser,
	isPublicPath,
	matchesPath,
	ONBOARDING_PATH,
	PENDING_APPROVAL_PATH,
	SIGN_IN_PATH,
} from "./route-access";

describe("matchesPath", () => {
	it("matches exact paths", () => {
		expect(matchesPath("/dashboard", "/dashboard")).toBe(true);
	});

	it("matches nested prefixes", () => {
		expect(matchesPath("/dashboard/security", "/dashboard")).toBe(true);
	});

	it("does not match unrelated paths", () => {
		expect(matchesPath("/dash", "/dashboard")).toBe(false);
		expect(matchesPath("/about", "/pricing")).toBe(false);
	});
});

describe("isPublicPath", () => {
	it("treats marketing and auth entry paths as public", () => {
		expect(isPublicPath("/")).toBe(true);
		expect(isPublicPath(SIGN_IN_PATH)).toBe(true);
		expect(isPublicPath("/about")).toBe(true);
		expect(isPublicPath("/pricing")).toBe(true);
	});

	it("does not treat protected app routes as public", () => {
		expect(isPublicPath("/dashboard")).toBe(false);
		expect(isPublicPath("/tickets")).toBe(false);
	});

	it("requires an exact match for the root path", () => {
		expect(isPublicPath("/about")).toBe(true);
		expect(isPublicPath("/anything")).toBe(false);
	});
});

describe("defaultPathForUser", () => {
	it("sends users who need onboarding to onboarding", () => {
		expect(
			defaultPathForUser({
				needsOnboarding: true,
				status: "ACTIVE",
			} as Parameters<typeof defaultPathForUser>[0]),
		).toBe(ONBOARDING_PATH);

		expect(
			defaultPathForUser({
				needsOnboarding: false,
				status: "PENDING_ONBOARDING",
			} as Parameters<typeof defaultPathForUser>[0]),
		).toBe(ONBOARDING_PATH);
	});

	it("sends pending approval users to the pending page", () => {
		expect(
			defaultPathForUser({
				needsOnboarding: false,
				status: "PENDING_APPROVAL",
			} as Parameters<typeof defaultPathForUser>[0]),
		).toBe(PENDING_APPROVAL_PATH);
	});

	it("defaults authenticated users to the dashboard", () => {
		expect(
			defaultPathForUser({
				needsOnboarding: false,
				status: "ACTIVE",
			} as Parameters<typeof defaultPathForUser>[0]),
		).toBe(DEFAULT_AUTHENTICATED_PATH);
	});
});
