import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path = "/analytics/overview" as const satisfies keyof paths;
type Path = paths[typeof path];

export type OverviewGetParameters = Path["get"]["parameters"];
export type OverviewGetQuery = PathQuery<typeof path, "get">;
export type OverviewGetRequest = PathRequest<typeof path, "get">;
export type OverviewGetResponse = PathResponse<typeof path, "get", 200>;
