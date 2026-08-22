import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type AccessSessionEndPostParameters = Path["post"]["parameters"];
export type AccessSessionEndPostPath = PathParams<typeof path, "post">;
export type AccessSessionEndPostRequest = PathRequest<typeof path, "post">;
export type AccessSessionEndPostResponse = PathResponse<typeof path, "post", 200>;
export type AccessSessionEndPost403Response = PathResponse<typeof path, "post", 403>;
export type AccessSessionEndPost404Response = PathResponse<typeof path, "post", 404>;
export type AccessSessionEndPost409Response = PathResponse<typeof path, "post", 409>;
