import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pricing",
	description:
		"Simple per-seat pricing for Opsflow team and organization service desks.",
};

export default function PricingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
