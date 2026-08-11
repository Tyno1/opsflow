import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CategoriesGetParameters = Path["get"]["parameters"];
export type CategoriesGetQuery = PathQuery<typeof path, "get">;
export type CategoriesGetRequest = PathRequest<typeof path, "get">;
export type CategoriesGetResponse = PathResponse<typeof path, "get", 200>;
