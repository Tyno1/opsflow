import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type SubcategoryPatchParameters = Path["patch"]["parameters"];
export type SubcategoryPatchPath = PathParams<typeof path, "patch">;
export type SubcategoryPatchRequest = PathRequest<typeof path, "patch">;
export type SubcategoryPatchResponse = PathResponse<typeof path, "patch", 200>;
export type SubcategoryPatch403Response = PathResponse<typeof path, "patch", 403>;
