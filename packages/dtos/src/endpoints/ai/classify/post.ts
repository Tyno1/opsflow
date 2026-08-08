import type { paths } from "@/generated/api.js";
import type { PathParams, PathRequest, PathResponse } from "@/lib/path.js";

export const path =
	"/ai/tickets/{ticketId}/classify" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type ClassifyPostParameters = Path["post"]["parameters"];
export type ClassifyPostPath = PathParams<typeof path, "post">;
export type ClassifyPostRequest = PathRequest<typeof path, "post">;
export type ClassifyPostResponse = PathResponse<typeof path, "post", 200>;
