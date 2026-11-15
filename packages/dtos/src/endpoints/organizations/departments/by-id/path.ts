import type { paths } from "@repo/dtos/src/generated/api.js";

export const path =
	"/organizations/departments/{departmentId}" as const satisfies keyof paths;
export type Path = paths[typeof path];
