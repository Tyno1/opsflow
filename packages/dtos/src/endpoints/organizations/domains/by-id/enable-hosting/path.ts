import type { paths } from "@/generated/api.js";

export const path =
	"/organizations/domains/{domainId}/enable-hosting" as const satisfies keyof paths;
export type Path = paths[typeof path];
