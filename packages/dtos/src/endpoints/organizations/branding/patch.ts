import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type BrandingPatchParameters = Path["patch"]["parameters"];
export type BrandingPatchRequest = PathRequest<typeof path, "patch">;
export type BrandingPatchResponse = PathResponse<typeof path, "patch", 200>;
export type BrandingPatch403Response = PathResponse<typeof path, "patch", 403>;
