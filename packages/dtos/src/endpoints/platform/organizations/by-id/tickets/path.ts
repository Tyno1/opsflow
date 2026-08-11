import type { paths } from "@/generated/api.js";

export const path =
	"/platform/organizations/{organizationId}/tickets" as const satisfies keyof paths;
export type Path = paths[typeof path];
