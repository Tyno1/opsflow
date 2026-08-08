import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DomainEnableHostingPostParameters = Path["post"]["parameters"];
export type DomainEnableHostingPostPath = PathParams<typeof path, "post">;
export type DomainEnableHostingPostRequest = PathRequest<typeof path, "post">;
export type DomainEnableHostingPostResponse = PathResponse<
	typeof path,
	"post",
	202
>;
export type DomainEnableHostingPost403Response = PathResponse<
	typeof path,
	"post",
	403
>;
export type DomainEnableHostingPost404Response = PathResponse<
	typeof path,
	"post",
	404
>;
export type DomainEnableHostingPost409Response = PathResponse<
	typeof path,
	"post",
	409
>;
