import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type UserGetParameters = Path["get"]["parameters"];
export type UserGetPath = PathParams<typeof path, "get">;
export type UserGetRequest = PathRequest<typeof path, "get">;
export type UserGetResponse = PathResponse<typeof path, "get", 200>;
export type UserGet401Response = PathResponse<typeof path, "get", 401>;
export type UserGet404Response = PathResponse<typeof path, "get", 404>;
