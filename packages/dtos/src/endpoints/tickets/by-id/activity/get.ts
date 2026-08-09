import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketActivityGetParameters = Path["get"]["parameters"];
export type TicketActivityGetPath = PathParams<typeof path, "get">;
export type TicketActivityGetRequest = PathRequest<typeof path, "get">;
export type TicketActivityGetResponse = PathResponse<typeof path, "get", 200>;
