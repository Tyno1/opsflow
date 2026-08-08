import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type TicketPostParameters = Path["post"]["parameters"];
export type TicketPostRequest = PathRequest<typeof path, "post">;
export type TicketPostResponse = PathResponse<typeof path, "post", 201>;
