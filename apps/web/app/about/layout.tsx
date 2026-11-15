import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Opsflow helps organizations run a clearer internal service desk across IT, people, and facilities teams.",
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
