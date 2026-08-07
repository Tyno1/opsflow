import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CommentPostParameters = Path["post"]["parameters"];
export type CommentPostPath = PathParams<typeof path, "post">;
export type CommentPostRequest = PathRequest<typeof path, "post">;
export type CommentPostResponse = PathResponse<typeof path, "post", 201>;
export type CommentPost401Response = PathResponse<typeof path, "post", 401>;
export type CommentPost403Response = PathResponse<typeof path, "post", 403>;
export type CommentPost404Response = PathResponse<typeof path, "post", 404>;
