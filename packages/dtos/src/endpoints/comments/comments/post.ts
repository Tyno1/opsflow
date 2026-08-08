import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CommentPostParameters = Path["post"]["parameters"];
export type CommentPostPath = PathParams<typeof path, "post">;
export type CommentPostRequest = PathRequest<typeof path, "post">;
export type CommentPostResponse = PathResponse<typeof path, "post", 201>;
