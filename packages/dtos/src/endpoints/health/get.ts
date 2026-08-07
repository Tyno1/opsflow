import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/health" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type HealthGetParameters = Path["get"]["parameters"];
export type HealthGetRequest = PathRequest<typeof path, "get">;
export type HealthGetResponse = PathResponse<typeof path, "get", 200>;
