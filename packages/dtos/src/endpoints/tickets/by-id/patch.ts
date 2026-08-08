import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketPatchParameters = Path["patch"]["parameters"];
export type TicketPatchPath = PathParams<typeof path, "patch">;
export type TicketPatchRequest = PathRequest<typeof path, "patch">;
export type TicketPatchResponse = PathResponse<typeof path, "patch", 200>;
export type TicketPatch403Response = PathResponse<typeof path, "patch", 403>;
