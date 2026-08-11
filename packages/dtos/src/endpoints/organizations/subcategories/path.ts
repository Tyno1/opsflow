import type { paths } from "@/generated/api.js";

export const path = "/organizations/subcategories" as const satisfies keyof paths;
export type Path = paths[typeof path];
