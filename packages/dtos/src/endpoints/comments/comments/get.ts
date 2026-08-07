import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CommentsGetParameters = Path["get"]["parameters"];
export type CommentsGetPath = PathParams<typeof path, "get">;
export type CommentsGetRequest = PathRequest<typeof path, "get">;
export type CommentsGetResponse = PathResponse<typeof path, "get", 200>;
export type CommentsGet401Response = PathResponse<typeof path, "get", 401>;
export type CommentsGet403Response = PathResponse<typeof path, "get", 403>;
export type CommentsGet404Response = PathResponse<typeof path, "get", 404>;
