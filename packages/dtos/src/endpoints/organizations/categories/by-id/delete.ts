import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CategoryDeleteParameters = Path["delete"]["parameters"];
export type CategoryDeletePath = PathParams<typeof path, "delete">;
export type CategoryDeleteRequest = PathRequest<typeof path, "delete">;
export type CategoryDeleteResponse = PathResponse<typeof path, "delete", 200>;
export type CategoryDelete403Response = PathResponse<typeof path, "delete", 403>;
export type CategoryDelete409Response = PathResponse<typeof path, "delete", 409>;
