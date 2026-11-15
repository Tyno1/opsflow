"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import HomeLayoutWrapper from "@/app/components/HomeLayoutWrapper";

const rise = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
	const reduceMotion = useReducedMotion();

	return (
		<HomeLayoutWrapper>
			<main className="relative z-10 px-6 pt-[5.75rem] pb-24 md:px-10 md:pt-28 md:pb-32">
				<section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center gap-5 py-10">
					<motion.p
						className="font-display m-0 text-[clamp(3rem,10vw,5rem)] leading-[0.92] font-bold tracking-[-0.05em] text-foreground"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						Opsflow
					</motion.p>
					<motion.h1
						className="m-0 text-[clamp(1.35rem,3vw,1.85rem)] leading-tight font-medium tracking-tight text-secondary"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{
							duration: 0.7,
							delay: 0.08,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						Built for internal operations that need a clearer desk.
					</motion.h1>
					<motion.p
						className="m-0 max-w-xl text-base leading-relaxed text-muted-foreground"
						initial={reduceMotion ? false : "hidden"}
						animate="show"
						variants={rise}
						transition={{
							duration: 0.7,
							delay: 0.14,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						We help organizations replace scattered tickets and side channels
						with one service desk that routes work, surfaces priority, and keeps
						every team aligned.
					</motion.p>
				</section>

				<section className="mx-auto max-w-5xl border-t border-border pt-16 md:pt-20">
					<h2 className="font-display m-0 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
						Who it&apos;s for
					</h2>
					<p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
						Ops, IT, facilities, and people teams that share one intake but own
						different queues.
					</p>
					<ul className="mt-10 m-0 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-10">
						{[
							{
								title: "IT & infrastructure",
								copy: "Incidents and access requests land with the right on-call owners.",
							},
							{
								title: "People & facilities",
								copy: "Onboarding packs and workplace requests stay visible end to end.",
							},
							{
								title: "Ops leadership",
								copy: "One queue model across orgs—without losing ownership boundaries.",
							},
						].map((item, index) => (
							<motion.li
								key={item.title}
								className="border-t border-border pt-5"
								initial={reduceMotion ? false : { opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{
									duration: 0.55,
									delay: index * 0.08,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<p className="m-0 text-lg font-medium text-foreground">
									{item.title}
								</p>
								<p className="mt-2 m-0 text-sm leading-relaxed text-muted-foreground">
									{item.copy}
								</p>
							</motion.li>
						))}
					</ul>
					<div className="mt-14">
						<Link
							href="/auth/sign-in"
							className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-bright/45 bg-linear-to-b from-primary-hot to-primary px-4 text-[0.95rem] font-semibold tracking-tight text-primary-foreground transition hover:from-primary-bright hover:to-primary-deep"
						>
							Get started
						</Link>
					</div>
				</section>
			</main>
		</HomeLayoutWrapper>
	);
}
