import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { path } from "./path.js";

export type OrganizationBootstrapPostRequest = PathRequest<typeof path, "post">;
export type OrganizationBootstrapPostResponse = PathResponse<
	typeof path,
	"post",
	201
>;
export type OrganizationBootstrapPost403Response = PathResponse<
	typeof path,
	"post",
	403
>;
export type OrganizationBootstrapPost409Response = PathResponse<
	typeof path,
	"post",
	409
>;
