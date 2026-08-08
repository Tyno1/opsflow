import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type BrandingRefreshPostParameters = Path["post"]["parameters"];
export type BrandingRefreshPostRequest = PathRequest<typeof path, "post">;
export type BrandingRefreshPostResponse = PathResponse<
	typeof path,
	"post",
	202
>;
export type BrandingRefreshPost403Response = PathResponse<
	typeof path,
	"post",
	403
>;
export type BrandingRefreshPost409Response = PathResponse<
	typeof path,
	"post",
	409
>;
