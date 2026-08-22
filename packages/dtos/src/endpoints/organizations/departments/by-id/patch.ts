import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DepartmentPatchParameters = Path["patch"]["parameters"];
export type DepartmentPatchPath = PathParams<typeof path, "patch">;
export type DepartmentPatchRequest = PathRequest<typeof path, "patch">;
export type DepartmentPatchResponse = PathResponse<typeof path, "patch", 200>;
export type DepartmentPatch403Response = PathResponse<typeof path, "patch", 403>;
