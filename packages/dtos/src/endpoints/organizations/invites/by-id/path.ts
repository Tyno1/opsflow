import type { paths } from "@/generated/api.js";

export const path =
	"/organizations/invites/{inviteId}" as const satisfies keyof paths;
export type Path = paths[typeof path];
