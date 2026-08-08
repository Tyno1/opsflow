import type { paths } from "@/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";

export const path =
	"/ai/tickets/{ticketId}/suggest-reply" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type SuggestReplyPostParameters = Path["post"]["parameters"];
export type SuggestReplyPostPath = PathParams<typeof path, "post">;
export type SuggestReplyPostRequest = PathRequest<typeof path, "post">;
export type SuggestReplyPostResponse = PathResponse<typeof path, "post", 200>;
