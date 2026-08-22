import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type PlatformAccessLogGetParameters = Path["get"]["parameters"];
export type PlatformAccessLogGetQuery = PathQuery<typeof path, "get">;
export type PlatformAccessLogGetRequest = PathRequest<typeof path, "get">;
export type PlatformAccessLogGetResponse = PathResponse<typeof path, "get", 200>;
