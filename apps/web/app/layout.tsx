import type { Metadata } from "next";
import { Syne } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ProvidersWrapper } from "./providers/ProvidersWrapper";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});
const syne = Syne({
	subsets: ["latin"],
	variable: "--font-syne",
});

export const metadata: Metadata = {
	title: {
		default: "Opsflow",
		template: "%s · Opsflow",
	},
	description:
		"Internal service desk that classifies, prioritizes, and routes work to the right team.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${syne.variable}`}
			>
				<ProvidersWrapper>{children}</ProvidersWrapper>
			</body>
		</html>
	);
}
