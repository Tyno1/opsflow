import type { PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";
import type { Path, path } from "./path.js";

export type OrganizationGetParameters = Path["get"]["parameters"];
export type OrganizationGetRequest = PathRequest<typeof path, "get">;
export type OrganizationGetResponse = PathResponse<typeof path, "get", 200>;
