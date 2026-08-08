import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type InvitesGetParameters = Path["get"]["parameters"];
export type InvitesGetQuery = PathQuery<typeof path, "get">;
export type InvitesGetRequest = PathRequest<typeof path, "get">;
export type InvitesGetResponse = PathResponse<typeof path, "get", 200>;
