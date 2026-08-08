import type { paths } from "@/generated/api.js";

export const path =
	"/organizations/domains/{domainId}/hosting-status" as const satisfies keyof paths;
export type Path = paths[typeof path];
