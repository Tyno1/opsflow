import type { paths } from "@/generated/api.js";

export const path = "/organizations/invites" as const satisfies keyof paths;
export type Path = paths[typeof path];
