import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type PlatformOrganizationsGetParameters = Path["get"]["parameters"];
export type PlatformOrganizationsGetQuery = PathQuery<typeof path, "get">;
export type PlatformOrganizationsGetRequest = PathRequest<typeof path, "get">;
export type PlatformOrganizationsGetResponse = PathResponse<typeof path, "get", 200>;
