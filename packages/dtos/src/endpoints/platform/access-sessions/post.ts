import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type AccessSessionsPostParameters = Path["post"]["parameters"];
export type AccessSessionsPostRequest = PathRequest<typeof path, "post">;
export type AccessSessionsPostResponse = PathResponse<typeof path, "post", 201>;
export type AccessSessionsPost403Response = PathResponse<typeof path, "post", 403>;
export type AccessSessionsPost404Response = PathResponse<typeof path, "post", 404>;
