import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketClassificationsGetParameters = Path["get"]["parameters"];
export type TicketClassificationsGetPath = PathParams<typeof path, "get">;
export type TicketClassificationsGetRequest = PathRequest<typeof path, "get">;
export type TicketClassificationsGetResponse = PathResponse<
	typeof path,
	"get",
	200
>;
