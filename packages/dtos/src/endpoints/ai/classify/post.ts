import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path =
	"/ai/tickets/{ticketId}/classify" as const satisfies keyof paths;
type Path = paths[typeof path];

export type ClassifyPostParameters = Path["post"]["parameters"];
export type ClassifyPostPath = PathParams<typeof path, "post">;
export type ClassifyPostRequest = PathRequest<typeof path, "post">;
export type ClassifyPostResponse = PathResponse<typeof path, "post", 200>;
