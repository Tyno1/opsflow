import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type SubcategoriesGetParameters = Path["get"]["parameters"];
export type SubcategoriesGetQuery = PathQuery<typeof path, "get">;
export type SubcategoriesGetRequest = PathRequest<typeof path, "get">;
export type SubcategoriesGetResponse = PathResponse<typeof path, "get", 200>;
