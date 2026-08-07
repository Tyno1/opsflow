import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/auth/accept-invite" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type AcceptInvitePostParameters = Path["post"]["parameters"];
export type AcceptInvitePostRequest = PathRequest<typeof path, "post">;
export type AcceptInvitePostResponse = PathResponse<typeof path, "post", 201>;
export type AcceptInvitePost401Response = PathResponse<typeof path, "post", 401>;
export type AcceptInvitePost409Response = PathResponse<typeof path, "post", 409>;
