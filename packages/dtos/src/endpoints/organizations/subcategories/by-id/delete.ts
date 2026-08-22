import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type SubcategoryDeleteParameters = Path["delete"]["parameters"];
export type SubcategoryDeletePath = PathParams<typeof path, "delete">;
export type SubcategoryDeleteRequest = PathRequest<typeof path, "delete">;
export type SubcategoryDeleteResponse = PathResponse<typeof path, "delete", 200>;
export type SubcategoryDelete403Response = PathResponse<typeof path, "delete", 403>;
