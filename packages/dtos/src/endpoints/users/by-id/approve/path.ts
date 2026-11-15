import type { paths } from "@repo/dtos/src/generated/api.js";

export const path = "/users/{userId}/approve" as const satisfies keyof paths;
export type Path = paths[typeof path];
