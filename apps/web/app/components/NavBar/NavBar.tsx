import { Button } from "@repo/ui/components";
import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";
import NavLink from "./NavLink";

const links = [
	{ name: "About", href: "/about" },
	{ name: "Pricing", href: "/pricing" },
] as const;

export default function NavBar() {
	return (
		<header className="fixed inset-x-0 z-20 flex items-center justify-between px-6 py-5 md:px-10 md:py-6 backdrop-blur">
			<Link
				href="/"
				className="font-display text-[1.15rem] font-semibold tracking-tight text-foreground md:text-lg"
			>
				Opsflow
			</Link>
			<nav aria-label="Primary" className="flex gap-2">
				<ul className="flex items-center gap-1 md:gap-2">
					{links.map((item) => (
						<li key={item.href}>
							<NavLink href={item.href}>{item.name}</NavLink>
						</li>
					))}
					<li>
						<NavLink href="/auth/sign-in" variant="emphasis">
							Sign in
						</NavLink>
					</li>
				</ul>
				<ThemeToggle />
			</nav>
		</header>
	);
}
