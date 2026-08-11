import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type PlatformSessionPostParameters = Path["post"]["parameters"];
export type PlatformSessionPostRequest = PathRequest<typeof path, "post">;
export type PlatformSessionPostResponse = PathResponse<typeof path, "post", 200>;
export type PlatformSessionPost401Response = PathResponse<typeof path, "post", 401>;
export type PlatformSessionPost404Response = PathResponse<typeof path, "post", 404>;
