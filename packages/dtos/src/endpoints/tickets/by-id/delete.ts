import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketDeleteParameters = Path["delete"]["parameters"];
export type TicketDeletePath = PathParams<typeof path, "delete">;
export type TicketDeleteRequest = PathRequest<typeof path, "delete">;
export type TicketDeleteResponse = PathResponse<typeof path, "delete", 204>;
export type TicketDelete403Response = PathResponse<typeof path, "delete", 403>;
