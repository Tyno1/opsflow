import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path =
	"/ai/tickets/{ticketId}/summarize" as const satisfies keyof paths;
type Path = paths[typeof path];

export type SummarizePostParameters = Path["post"]["parameters"];
export type SummarizePostPath = PathParams<typeof path, "post">;
export type SummarizePostRequest = PathRequest<typeof path, "post">;
export type SummarizePostResponse = PathResponse<typeof path, "post", 200>;
