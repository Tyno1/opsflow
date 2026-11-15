import type { paths } from "@repo/dtos/src/generated/api.js";

export const path = "/platform/organizations" as const satisfies keyof paths;
export type Path = paths[typeof path];
