import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketAssignmentsGetParameters = Path["get"]["parameters"];
export type TicketAssignmentsGetPath = PathParams<typeof path, "get">;
export type TicketAssignmentsGetRequest = PathRequest<typeof path, "get">;
export type TicketAssignmentsGetResponse = PathResponse<
	typeof path,
	"get",
	200
>;
