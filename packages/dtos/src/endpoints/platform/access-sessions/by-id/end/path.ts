import type { paths } from "@/generated/api.js";

export const path =
	"/platform/access-sessions/{sessionId}/end" as const satisfies keyof paths;
export type Path = paths[typeof path];
