import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/logout" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type LogoutPostParameters = Path["post"]["parameters"];
export type LogoutPostRequest = PathRequest<typeof path, "post">;
export type LogoutPostResponse = PathResponse<typeof path, "post", 204>;
export type LogoutPost401Response = PathResponse<typeof path, "post", 401>;
