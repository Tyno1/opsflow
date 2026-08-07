import type { paths } from "@/generated/api.js";

export const path = "/tickets/{ticketId}/comments" as const satisfies keyof paths;
export type Path = paths[typeof path];
