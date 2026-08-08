import type { paths } from "@/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/notifications" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type NotificationsGetParameters = Path["get"]["parameters"];
export type NotificationsGetQuery = PathQuery<typeof path, "get">;
export type NotificationsGetRequest = PathRequest<typeof path, "get">;
export type NotificationsGetResponse = PathResponse<typeof path, "get", 200>;
