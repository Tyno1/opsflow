import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type SubcategoriesPostParameters = Path["post"]["parameters"];
export type SubcategoriesPostRequest = PathRequest<typeof path, "post">;
export type SubcategoriesPostResponse = PathResponse<typeof path, "post", 201>;
export type SubcategoriesPost403Response = PathResponse<typeof path, "post", 403>;
export type SubcategoriesPost404Response = PathResponse<typeof path, "post", 404>;
