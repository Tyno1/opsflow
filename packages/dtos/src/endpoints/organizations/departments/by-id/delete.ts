import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DepartmentDeleteParameters = Path["delete"]["parameters"];
export type DepartmentDeletePath = PathParams<typeof path, "delete">;
export type DepartmentDeleteRequest = PathRequest<typeof path, "delete">;
export type DepartmentDeleteResponse = PathResponse<typeof path, "delete", 200>;
export type DepartmentDelete403Response = PathResponse<typeof path, "delete", 403>;
export type DepartmentDelete409Response = PathResponse<typeof path, "delete", 409>;
