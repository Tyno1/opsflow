import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type OrganizationBySubdomainGetParameters = Path["get"]["parameters"];
export type OrganizationBySubdomainGetPath = PathParams<typeof path, "get">;
export type OrganizationBySubdomainGetRequest = PathRequest<typeof path, "get">;
export type OrganizationBySubdomainGetResponse = PathResponse<
	typeof path,
	"get",
	200
>;
export type OrganizationBySubdomainGet404Response = PathResponse<
	typeof path,
	"get",
	404
>;
