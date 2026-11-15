import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

type MarketingShellProps = {
	children: ReactNode;
};

export default function MarketingShell({ children }: MarketingShellProps) {
	return (
		<div className="relative isolate min-h-svh overflow-x-hidden bg-linear-to-br from-background via-background-mid to-background-deep text-foreground">
			<NavBar />
			{children}
		</div>
	);
}
