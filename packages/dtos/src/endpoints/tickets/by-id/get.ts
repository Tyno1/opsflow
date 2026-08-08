import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketGetParameters = Path["get"]["parameters"];
export type TicketGetPath = PathParams<typeof path, "get">;
export type TicketGetRequest = PathRequest<typeof path, "get">;
export type TicketGetResponse = PathResponse<typeof path, "get", 200>;
export type TicketGet403Response = PathResponse<typeof path, "get", 403>;
export type TicketGet404Response = PathResponse<typeof path, "get", 404>;
