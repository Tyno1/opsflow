import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DomainHostingStatusGetParameters = Path["get"]["parameters"];
export type DomainHostingStatusGetPath = PathParams<typeof path, "get">;
export type DomainHostingStatusGetRequest = PathRequest<typeof path, "get">;
export type DomainHostingStatusGetResponse = PathResponse<
	typeof path,
	"get",
	200
>;
export type DomainHostingStatusGet404Response = PathResponse<
	typeof path,
	"get",
	404
>;
