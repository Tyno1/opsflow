import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/login" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type LoginPostParameters = Path["post"]["parameters"];
export type LoginPostRequest = PathRequest<typeof path, "post">;
export type LoginPostResponse = PathResponse<typeof path, "post", 200>;
export type LoginPost401Response = PathResponse<typeof path, "post", 401>;
