import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/forgot-password" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type ForgotPasswordPostParameters = Path["post"]["parameters"];
export type ForgotPasswordPostRequest = PathRequest<typeof path, "post">;
export type ForgotPasswordPostResponse = PathResponse<typeof path, "post", 204>;
