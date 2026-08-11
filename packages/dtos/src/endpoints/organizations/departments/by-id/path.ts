import type { paths } from "@/generated/api.js";

export const path =
	"/organizations/departments/{departmentId}" as const satisfies keyof paths;
export type Path = paths[typeof path];
