import type { paths } from "@/generated/api.js";
import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/users" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type UsersGetParameters = Path["get"]["parameters"];
export type UsersGetQuery = PathQuery<typeof path, "get">;
export type UsersGetRequest = PathRequest<typeof path, "get">;
export type UsersGetResponse = PathResponse<typeof path, "get", 200>;
export type UsersGet401Response = PathResponse<typeof path, "get", 401>;
export type UsersGet403Response = PathResponse<typeof path, "get", 403>;
