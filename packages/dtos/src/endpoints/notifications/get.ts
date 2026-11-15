import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path = "/notifications" as const satisfies keyof paths;
type Path = paths[typeof path];

export type NotificationsGetParameters = Path["get"]["parameters"];
export type NotificationsGetQuery = PathQuery<typeof path, "get">;
export type NotificationsGetRequest = PathRequest<typeof path, "get">;
export type NotificationsGetResponse = PathResponse<typeof path, "get", 200>;
