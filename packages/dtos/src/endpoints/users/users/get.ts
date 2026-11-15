import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path = "/users" as const satisfies keyof paths;
type Path = paths[typeof path];

export type UsersGetParameters = Path["get"]["parameters"];
export type UsersGetQuery = PathQuery<typeof path, "get">;
export type UsersGetRequest = PathRequest<typeof path, "get">;
export type UsersGetResponse = PathResponse<typeof path, "get", 200>;
