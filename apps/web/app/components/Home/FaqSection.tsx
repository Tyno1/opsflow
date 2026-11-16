"use client";

import { useState } from "react";
import { faqs } from "./home-content";

export default function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section className="relative z-10 border-t border-border px-6 py-20 md:px-10 md:py-28">
			<div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
				<div className="max-w-sm">
					<h2 className="font-display m-0 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
						Questions, answered.
					</h2>
					<p className="mt-4 text-base leading-relaxed text-muted-foreground">
						Straight answers for teams evaluating an internal service desk.
					</p>
				</div>
				<ul className="m-0 grid list-none gap-0 p-0">
					{faqs.map((item, index) => {
						const open = openIndex === index;
						return (
							<li key={item.question} className="border-t border-border">
								<button
									type="button"
									className="flex w-full items-start justify-between gap-6 py-5 text-left"
									aria-expanded={open}
									onClick={() => setOpenIndex(open ? null : index)}
								>
									<span className="text-base font-medium text-foreground md:text-lg">
										{item.question}
									</span>
									<span
										className="mt-1 font-mono text-sm text-faint-foreground"
										aria-hidden="true"
									>
										{open ? "–" : "+"}
									</span>
								</button>
								{open ? (
									<p className="m-0 max-w-xl pb-5 text-sm leading-relaxed text-muted-foreground">
										{item.answer}
									</p>
								) : null}
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
