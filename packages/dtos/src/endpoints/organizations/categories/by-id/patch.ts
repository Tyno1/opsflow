import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CategoryPatchParameters = Path["patch"]["parameters"];
export type CategoryPatchPath = PathParams<typeof path, "patch">;
export type CategoryPatchRequest = PathRequest<typeof path, "patch">;
export type CategoryPatchResponse = PathResponse<typeof path, "patch", 200>;
export type CategoryPatch403Response = PathResponse<typeof path, "patch", 403>;
