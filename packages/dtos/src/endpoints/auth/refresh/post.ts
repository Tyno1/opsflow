import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/refresh" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type RefreshPostParameters = Path["post"]["parameters"];
export type RefreshPostRequest = PathRequest<typeof path, "post">;
export type RefreshPostResponse = PathResponse<typeof path, "post", 200>;
export type RefreshPost401Response = PathResponse<typeof path, "post", 401>;
