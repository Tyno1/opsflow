import type { paths } from "@repo/dtos/src/generated/api.js";
import type { PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";

const path = "/auth/me" as const satisfies keyof paths;
type Path = paths[typeof path];

export type MeGetParameters = Path["get"]["parameters"];
export type MeGetRequest = PathRequest<typeof path, "get">;
export type MeGetResponse = PathResponse<typeof path, "get", 200>;
export type MeGet401Response = PathResponse<typeof path, "get", 401>;
export type MeGet404Response = PathResponse<typeof path, "get", 404>;
