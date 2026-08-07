import type { paths } from "@/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/analytics/overview" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type OverviewGetParameters = Path["get"]["parameters"];
export type OverviewGetQuery = PathQuery<typeof path, "get">;
export type OverviewGetRequest = PathRequest<typeof path, "get">;
export type OverviewGetResponse = PathResponse<typeof path, "get", 200>;
export type OverviewGet401Response = PathResponse<typeof path, "get", 401>;
export type OverviewGet403Response = PathResponse<typeof path, "get", 403>;
