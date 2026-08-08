import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type UserApprovePostParameters = Path["post"]["parameters"];
export type UserApprovePostPath = PathParams<typeof path, "post">;
export type UserApprovePostRequest = PathRequest<typeof path, "post">;
export type UserApprovePostResponse = PathResponse<typeof path, "post", 200>;
export type UserApprovePost403Response = PathResponse<typeof path, "post", 403>;
export type UserApprovePost409Response = PathResponse<typeof path, "post", 409>;
