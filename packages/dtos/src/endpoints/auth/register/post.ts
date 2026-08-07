import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/register" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type RegisterPostParameters = Path["post"]["parameters"];
export type RegisterPostRequest = PathRequest<typeof path, "post">;
export type RegisterPostResponse = PathResponse<typeof path, "post", 201>;
export type RegisterPost409Response = PathResponse<typeof path, "post", 409>;
