import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketSummariesGetParameters = Path["get"]["parameters"];
export type TicketSummariesGetPath = PathParams<typeof path, "get">;
export type TicketSummariesGetRequest = PathRequest<typeof path, "get">;
export type TicketSummariesGetResponse = PathResponse<typeof path, "get", 200>;
