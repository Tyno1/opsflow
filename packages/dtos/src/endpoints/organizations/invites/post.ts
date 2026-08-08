import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type InvitePostParameters = Path["post"]["parameters"];
export type InvitePostRequest = PathRequest<typeof path, "post">;
export type InvitePostResponse = PathResponse<typeof path, "post", 201>;
export type InvitePost403Response = PathResponse<typeof path, "post", 403>;
export type InvitePost409Response = PathResponse<typeof path, "post", 409>;
