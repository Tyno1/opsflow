import type { PathParams, PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type PlatformOrganizationTicketsGetParameters = Path["get"]["parameters"];
export type PlatformOrganizationTicketsGetPath = PathParams<typeof path, "get">;
export type PlatformOrganizationTicketsGetQuery = PathQuery<typeof path, "get">;
export type PlatformOrganizationTicketsGetRequest = PathRequest<typeof path, "get">;
export type PlatformOrganizationTicketsGetResponse = PathResponse<typeof path, "get", 200>;
export type PlatformOrganizationTicketsGet403Response = PathResponse<typeof path, "get", 403>;
export type PlatformOrganizationTicketsGet404Response = PathResponse<typeof path, "get", 404>;
