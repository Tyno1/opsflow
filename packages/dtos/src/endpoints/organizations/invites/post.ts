import type { paths } from "@/generated/api.js";
import type { PathRequest, PathResponse } from "@/lib/path.js";

export const path = "/organizations/invites" as const satisfies keyof paths;
export type Path = paths[typeof path];

export type InvitePostParameters = Path["post"]["parameters"];
export type InvitePostRequest = PathRequest<typeof path, "post">;
export type InvitePostResponse = PathResponse<typeof path, "post", 201>;
export type InvitePost401Response = PathResponse<typeof path, "post", 401>;
export type InvitePost403Response = PathResponse<typeof path, "post", 403>;
