import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type OrganizationPatchParameters = Path["patch"]["parameters"];
export type OrganizationPatchRequest = PathRequest<typeof path, "patch">;
export type OrganizationPatchResponse = PathResponse<typeof path, "patch", 200>;
export type OrganizationPatch401Response = PathResponse<
	typeof path,
	"patch",
	401
>;
export type OrganizationPatch403Response = PathResponse<
	typeof path,
	"patch",
	403
>;
