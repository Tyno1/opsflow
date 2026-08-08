import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type InviteDeleteParameters = Path["delete"]["parameters"];
export type InviteDeletePath = PathParams<typeof path, "delete">;
export type InviteDeleteRequest = PathRequest<typeof path, "delete">;
export type InviteDeleteResponse = PathResponse<typeof path, "delete", 204>;
export type InviteDelete403Response = PathResponse<typeof path, "delete", 403>;
export type InviteDelete404Response = PathResponse<typeof path, "delete", 404>;
export type InviteDelete409Response = PathResponse<typeof path, "delete", 409>;
