import type { paths } from "@/generated/api.js";

export const path = "/users/{userId}/approve" as const satisfies keyof paths;
export type Path = paths[typeof path];
