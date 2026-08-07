import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type UserDeleteParameters = Path["delete"]["parameters"];
export type UserDeletePath = PathParams<typeof path, "delete">;
export type UserDeleteRequest = PathRequest<typeof path, "delete">;
export type UserDeleteResponse = PathResponse<typeof path, "delete", 204>;
export type UserDelete401Response = PathResponse<typeof path, "delete", 401>;
export type UserDelete403Response = PathResponse<typeof path, "delete", 403>;
export type UserDelete404Response = PathResponse<typeof path, "delete", 404>;
