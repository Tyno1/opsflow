import type { paths } from "@/generated/api.js";

export const path = "/platform/organizations" as const satisfies keyof paths;
export type Path = paths[typeof path];
