import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type UserPatchParameters = Path["patch"]["parameters"];
export type UserPatchPath = PathParams<typeof path, "patch">;
export type UserPatchRequest = PathRequest<typeof path, "patch">;
export type UserPatchResponse = PathResponse<typeof path, "patch", 200>;
export type UserPatch403Response = PathResponse<typeof path, "patch", 403>;
export type UserPatch409Response = PathResponse<typeof path, "patch", 409>;
