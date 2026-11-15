import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path = "/auth/session" as const satisfies keyof paths;
type Path = paths[typeof path];

export type SessionPostParameters = Path["post"]["parameters"];
export type SessionPostRequest = PathRequest<typeof path, "post">;
export type SessionPostResponse = PathResponse<typeof path, "post", 200>;
export type SessionPost201Response = PathResponse<typeof path, "post", 201>;
export type SessionPost401Response = PathResponse<typeof path, "post", 401>;
