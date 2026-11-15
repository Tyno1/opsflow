import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

type HomeLayoutWrapperProps = {
	children: ReactNode;
};

export default function HomeLayoutWrapper({ children }: HomeLayoutWrapperProps) {
	return (
		<div className="relative isolate min-h-svh overflow-x-hidden bg-linear-to-br from-background via-background-mid to-background-deep text-foreground">
			<NavBar />
			{children}
		</div>
	);
}
