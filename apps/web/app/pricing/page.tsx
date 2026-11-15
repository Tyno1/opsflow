"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import HomeLayoutWrapper from "@/app/components/HomeLayoutWrapper";

const plans = [
	{
		name: "Team",
		price: "$29",
		period: "/ seat / month",
		summary: "For a single operations group getting started.",
		features: [
			"Shared intake and queues",
			"Priority and ownership routing",
			"Email notifications",
		],
		cta: "Start with Team",
		emphasis: false,
	},
	{
		name: "Organization",
		price: "$49",
		period: "/ seat / month",
		summary: "For multi-team desks that need clearer boundaries.",
		features: [
			"Everything in Team",
			"Departments and categories",
			"Cross-org visibility controls",
		],
		cta: "Start with Organization",
		emphasis: true,
	},
] as const;

const rise = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0 },
};

export default function PricingPage() {
	const reduceMotion = useReducedMotion();

	return (
		<HomeLayoutWrapper>
			<main className="relative z-10 px-6 pt-[5.75rem] pb-24 md:px-10 md:pt-28 md:pb-32">
				<section className="mx-auto max-w-3xl pt-10 pb-14 md:pt-14 md:pb-20">
					<motion.p
						className="font-display m-0 text-[clamp(2.6rem,8vw,4.2rem)] leading-[0.94] font-bold tracking-[-0.05em] text-foreground"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						Pricing
					</motion.p>
					<motion.h1
						className="mt-4 m-0 text-[clamp(1.25rem,2.8vw,1.7rem)] leading-tight font-medium tracking-tight text-secondary"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{
							duration: 0.7,
							delay: 0.08,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						Simple seats. Clear queues.
					</motion.h1>
					<motion.p
						className="mt-3 m-0 max-w-lg text-base leading-relaxed text-muted-foreground"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{
							duration: 0.7,
							delay: 0.14,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						Pick the plan that matches how your desk is organized. Upgrade when
						more teams join the same intake.
					</motion.p>
				</section>

				<section className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
					{plans.map((plan, index) => (
						<motion.article
							key={plan.name}
							className={`flex flex-col rounded-2xl border p-6 md:p-8 ${
								plan.emphasis
									? "border-primary/50 bg-primary/10"
									: "border-border bg-card"
							}`}
							initial={reduceMotion ? false : { opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.12 + index * 0.1,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<h2 className="font-display m-0 text-2xl font-semibold tracking-tight text-foreground">
								{plan.name}
							</h2>
							<p className="mt-3 m-0 flex items-baseline gap-1">
								<span className="text-4xl font-semibold tracking-tight text-foreground">
									{plan.price}
								</span>
								<span className="text-sm text-muted-foreground">
									{plan.period}
								</span>
							</p>
							<p className="mt-3 m-0 text-sm leading-relaxed text-muted-foreground">
								{plan.summary}
							</p>
							<ul className="mt-8 mb-0 flex list-none flex-col gap-3 p-0">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="border-t border-border-soft pt-3 text-sm text-secondary first:border-t-0 first:pt-0"
									>
										{feature}
									</li>
								))}
							</ul>
							<Link
								href="/auth/sign-in"
								className={`mt-10 inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-[0.95rem] font-semibold tracking-tight transition ${
									plan.emphasis
										? "border border-primary-bright/45 bg-linear-to-b from-primary-hot to-primary text-primary-foreground hover:from-primary-bright hover:to-primary-deep"
										: "border border-border bg-background/40 text-foreground hover:border-primary/55 hover:bg-primary/14"
								}`}
							>
								{plan.cta}
							</Link>
						</motion.article>
					))}
				</section>
			</main>
		</HomeLayoutWrapper>
	);
}
