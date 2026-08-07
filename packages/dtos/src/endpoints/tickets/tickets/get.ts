import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketsGetParameters = Path["get"]["parameters"];
export type TicketsGetQuery = PathQuery<typeof path, "get">;
export type TicketsGetRequest = PathRequest<typeof path, "get">;
export type TicketsGetResponse = PathResponse<typeof path, "get", 200>;
export type TicketsGet401Response = PathResponse<typeof path, "get", 401>;
