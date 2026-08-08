import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CommentsGetParameters = Path["get"]["parameters"];
export type CommentsGetPath = PathParams<typeof path, "get">;
export type CommentsGetRequest = PathRequest<typeof path, "get">;
export type CommentsGetResponse = PathResponse<typeof path, "get", 200>;
