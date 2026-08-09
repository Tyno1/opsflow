import type { paths } from "@/generated/api.js";

export const path =
	"/tickets/{ticketId}/assignments" as const satisfies keyof paths;
export type Path = paths[typeof path];
