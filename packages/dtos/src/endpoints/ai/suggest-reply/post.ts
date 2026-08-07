import type { paths } from "@/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";

export const path =
  "/ai/tickets/{ticketId}/suggest-reply" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type SuggestReplyPostParameters = Path["post"]["parameters"];
export type SuggestReplyPostPath = PathParams<typeof path, "post">;
export type SuggestReplyPostRequest = PathRequest<typeof path, "post">;
export type SuggestReplyPostResponse = PathResponse<typeof path, "post", 200>;
export type SuggestReplyPost401Response = PathResponse<typeof path, "post", 401>;
export type SuggestReplyPost403Response = PathResponse<typeof path, "post", 403>;
export type SuggestReplyPost404Response = PathResponse<typeof path, "post", 404>;
