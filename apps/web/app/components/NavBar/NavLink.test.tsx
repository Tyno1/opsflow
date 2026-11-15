import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavLink from "./NavLink";

vi.mock("next/navigation", () => ({
	usePathname: () => "/about",
}));

describe("NavLink", () => {
	it("marks the active route for assistive tech", () => {
		render(<NavLink href="/about">About</NavLink>);

		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	it("does not mark inactive routes as current", () => {
		render(<NavLink href="/pricing">Pricing</NavLink>);

		expect(
			screen.getByRole("link", { name: "Pricing" }),
		).not.toHaveAttribute("aria-current");
	});

	it("renders the emphasis sign-in style", () => {
		render(
			<NavLink href="/auth/sign-in" variant="emphasis">
				Sign in
			</NavLink>,
		);

		expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
	});
});
