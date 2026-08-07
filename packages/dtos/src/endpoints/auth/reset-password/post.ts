import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/reset-password" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type ResetPasswordPostParameters = Path["post"]["parameters"];
export type ResetPasswordPostRequest = PathRequest<typeof path, "post">;
export type ResetPasswordPostResponse = PathResponse<typeof path, "post", 200>;
export type ResetPasswordPost401Response = PathResponse<
	typeof path,
	"post",
	401
>;
