import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DomainVerifyPostParameters = Path["post"]["parameters"];
export type DomainVerifyPostPath = PathParams<typeof path, "post">;
export type DomainVerifyPostRequest = PathRequest<typeof path, "post">;
export type DomainVerifyPostResponse = PathResponse<typeof path, "post", 200>;
export type DomainVerifyPost403Response = PathResponse<
	typeof path,
	"post",
	403
>;
export type DomainVerifyPost404Response = PathResponse<
	typeof path,
	"post",
	404
>;
