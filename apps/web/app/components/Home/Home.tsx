"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import HomeLayoutWrapper from "@/app/components/HomeLayoutWrapper";

const tickets = [
	{
		label: "Laptop cannot join VPN",
		path: "Incident · IT · Network",
		tag: "P2",
		status: "open" as const,
	},
	{
		label: "New starter access pack",
		path: "Request · People · Onboarding",
		tag: "P3",
		status: "waiting" as const,
	},
	{
		label: "Printer queue stalled",
		path: "Incident · Facilities · Print",
		tag: "P4",
		status: "resolved" as const,
	},
];

const statusClassName = {
	open: "bg-primary",
	waiting: "bg-status-waiting",
	resolved: "bg-primary-hot",
} as const;

const rise = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function Home() {
	const reduceMotion = useReducedMotion();

	return (
		<HomeLayoutWrapper>
			<main>
				<section className="relative flex min-h-svh flex-col justify-start px-6 pt-[5.75rem] pb-[min(48svh,22rem)] md:px-10 md:pt-28 md:pb-[min(52svh,26rem)]">
					<div className="relative z-10 flex max-w-xl flex-col gap-4 py-5 md:py-6">
						<motion.p
							className="font-display m-0 text-[clamp(3.4rem,13vw,6.2rem)] leading-[0.9] font-bold tracking-[-0.055em] text-foreground"
							initial={reduceMotion ? false : "hidden"}
							animate="show"
							variants={rise}
							transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
						>
							Opsflow
						</motion.p>
						<motion.h1
							className="m-0 text-[clamp(1.35rem,3.4vw,1.9rem)] leading-tight font-medium tracking-tight text-secondary"
							initial={reduceMotion ? false : "hidden"}
							animate="show"
							variants={rise}
							transition={{
								duration: 0.7,
								delay: 0.08,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							Internal service desk, routed with clarity.
						</motion.h1>
						<motion.p
							className="m-0 max-w-md text-base leading-relaxed text-muted-foreground"
							initial={reduceMotion ? false : "hidden"}
							animate="show"
							variants={rise}
							transition={{
								duration: 0.7,
								delay: 0.14,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							Employees raise work to the right team. Opsflow classifies,
							prioritizes, and keeps every org&apos;s queue in one place.
						</motion.p>
						<motion.div
							className="flex flex-wrap gap-3 pt-1.5 max-sm:flex-col max-sm:items-stretch"
							initial={reduceMotion ? false : "hidden"}
							animate="show"
							variants={rise}
							transition={{
								duration: 0.7,
								delay: 0.2,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<Link
								href="/auth/sign-in"
								className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-bright/45 bg-linear-to-b from-primary-hot to-primary px-4 text-[0.95rem] font-semibold tracking-tight text-primary-foreground transition hover:-translate-y-px hover:from-primary-bright hover:to-primary-deep max-sm:w-full"
							>
								Get started
							</Link>
							<Link
								href="/pricing"
								className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-[0.95rem] font-semibold tracking-tight text-foreground transition hover:border-primary/55 hover:bg-primary/14 max-sm:w-full"
							>
								View pricing
							</Link>
						</motion.div>
					</div>

					<motion.div
						className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(48svh,22rem)] md:h-[min(52svh,26rem)]"
						aria-hidden="true"
						initial={reduceMotion ? false : { opacity: 0, y: 32 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.9,
							delay: 0.18,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<div className="h-full w-full border-t border-border bg-linear-to-b from-[rgb(28_35_48_/_78%)] to-[rgb(10_13_18_/_96%)] [mask-image:linear-gradient(180deg,rgb(0_0_0_/_98%),rgb(0_0_0_/_28%))]">
							<div className="mx-auto flex h-full w-full max-w-5xl flex-col px-6 md:px-10">
								<div className="flex items-center justify-between gap-4 border-b border-border px-1 py-3.5">
									<span className="text-[0.78rem] font-semibold tracking-wide text-accent-foreground uppercase">
										Active queue
									</span>
									<span className="font-mono text-[0.72rem] text-faint-foreground">
										3 open
									</span>
								</div>
								<ul className="grid list-none gap-0">
									{tickets.map((ticket, index) => (
										<motion.li
											key={ticket.label}
											className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border-soft px-1 py-3.5 last:border-b-0"
											initial={reduceMotion ? false : { opacity: 0.45 }}
											animate={
												reduceMotion
													? undefined
													: {
															opacity: [0.45, 1, 0.45],
															borderColor: [
																"rgb(148 163 184 / 12%)",
																"rgb(58 47 176 / 45%)",
																"rgb(148 163 184 / 12%)",
															],
														}
											}
											transition={{
												duration: 4.5,
												delay: index * 0.7,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeInOut",
											}}
										>
											<span
												className={`size-2.5 rounded-full ${statusClassName[ticket.status]}`}
											/>
											<div className="grid min-w-0 gap-0.5">
												<span className="truncate text-sm font-medium text-foreground">
													{ticket.label}
												</span>
												<span className="text-xs text-subtle-foreground">
													{ticket.path}
												</span>
											</div>
											<span className="font-mono text-[0.68rem] text-tag">
												{ticket.tag}
											</span>
										</motion.li>
									))}
								</ul>
							</div>
						</div>
					</motion.div>
				</section>

				<section className="relative z-10 border-t border-border px-6 py-20 md:px-10 md:py-28">
					<div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
						<div className="max-w-sm">
							<h2 className="font-display m-0 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
								Work finds the right queue.
							</h2>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground">
								Opsflow classifies every request, assigns ownership, and keeps
								status visible—without another scattered inbox.
							</p>
						</div>
						<ol className="m-0 grid list-none gap-8 p-0">
							{[
								{
									step: "01",
									title: "Raise",
									copy: "Employees submit incidents and requests in one place.",
								},
								{
									step: "02",
									title: "Route",
									copy: "Classification and priority land work with the owning team.",
								},
								{
									step: "03",
									title: "Resolve",
									copy: "Queues stay current so ops can close the loop faster.",
								},
							].map((item) => (
								<li
									key={item.step}
									className="grid grid-cols-[auto_1fr] gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-6"
								>
									<span className="font-mono text-sm text-faint-foreground">
										{item.step}
									</span>
									<div>
										<p className="m-0 text-lg font-medium text-foreground">
											{item.title}
										</p>
										<p className="mt-1 m-0 text-sm leading-relaxed text-muted-foreground">
											{item.copy}
										</p>
									</div>
								</li>
							))}
						</ol>
					</div>
				</section>
			</main>
		</HomeLayoutWrapper>
	);
}
