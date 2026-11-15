import type { paths } from "@repo/dtos/src/generated/api.js";

export const path =
	"/organizations/domains/{domainId}/verify" as const satisfies keyof paths;
export type Path = paths[typeof path];
