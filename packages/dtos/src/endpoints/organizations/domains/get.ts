import type { PathRequest, PathResponse } from "@repo/dtos/src/lib/path.js";
import type { Path, path } from "./path.js";

export type DomainsGetParameters = Path["get"]["parameters"];
export type DomainsGetRequest = PathRequest<typeof path, "get">;
export type DomainsGetResponse = PathResponse<typeof path, "get", 200>;
