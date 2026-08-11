import type { paths } from "@/generated/api.js";

export const path =
	"/organizations/platform-access-log" as const satisfies keyof paths;
export type Path = paths[typeof path];
