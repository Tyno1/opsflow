import type { paths } from "@/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";

export const path =
  "/ai/tickets/{ticketId}/summarize" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type SummarizePostParameters = Path["post"]["parameters"];
export type SummarizePostPath = PathParams<typeof path, "post">;
export type SummarizePostRequest = PathRequest<typeof path, "post">;
export type SummarizePostResponse = PathResponse<typeof path, "post", 200>;
export type SummarizePost401Response = PathResponse<typeof path, "post", 401>;
export type SummarizePost403Response = PathResponse<typeof path, "post", 403>;
export type SummarizePost404Response = PathResponse<typeof path, "post", 404>;
