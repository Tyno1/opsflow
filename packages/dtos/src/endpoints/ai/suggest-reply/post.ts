import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path =
	"/ai/tickets/{ticketId}/suggest-reply" as const satisfies keyof paths;
type Path = paths[typeof path];

export type SuggestReplyPostParameters = Path["post"]["parameters"];
export type SuggestReplyPostPath = PathParams<typeof path, "post">;
export type SuggestReplyPostRequest = PathRequest<typeof path, "post">;
export type SuggestReplyPostResponse = PathResponse<typeof path, "post", 200>;
