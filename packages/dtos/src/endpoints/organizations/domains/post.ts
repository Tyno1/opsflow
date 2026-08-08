import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DomainsPostParameters = Path["post"]["parameters"];
export type DomainsPostRequest = PathRequest<typeof path, "post">;
export type DomainsPostResponse = PathResponse<typeof path, "post", 201>;
export type DomainsPost403Response = PathResponse<typeof path, "post", 403>;
export type DomainsPost409Response = PathResponse<typeof path, "post", 409>;
