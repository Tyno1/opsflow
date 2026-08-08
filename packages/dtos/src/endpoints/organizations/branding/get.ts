import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type BrandingGetParameters = Path["get"]["parameters"];
export type BrandingGetRequest = PathRequest<typeof path, "get">;
export type BrandingGetResponse = PathResponse<typeof path, "get", 200>;
