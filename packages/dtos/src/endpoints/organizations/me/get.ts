import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type OrganizationGetParameters = Path["get"]["parameters"];
export type OrganizationGetRequest = PathRequest<typeof path, "get">;
export type OrganizationGetResponse = PathResponse<typeof path, "get", 200>;
export type OrganizationGet401Response = PathResponse<typeof path, "get", 401>;
