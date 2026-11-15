"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
	href: string;
	children: ReactNode;
	variant?: "default" | "emphasis";
};

export default function NavLink({
	href,
	children,
	variant = "default",
}: NavLinkProps) {
	const pathname = usePathname();
	const active = pathname === href;

	if (variant === "emphasis") {
		return (
			<Link
				href={href}
				className="rounded-md border border-primary-bright/40 bg-linear-to-b from-primary-hot to-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:from-primary-bright hover:to-primary-deep"
				aria-current={active ? "page" : undefined}
			>
				{children}
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className={`rounded-md px-3 py-2 text-sm font-medium transition ${
				active
					? "text-foreground"
					: "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
			}`}
			aria-current={active ? "page" : undefined}
		>
			<span className="relative">
				{children}
				{active ? (
					<span className="absolute inset-x-0 -bottom-1 h-px bg-primary-bright" />
				) : null}
			</span>
		</Link>
	);
}
