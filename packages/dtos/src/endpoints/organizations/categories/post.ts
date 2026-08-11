import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type CategoriesPostParameters = Path["post"]["parameters"];
export type CategoriesPostRequest = PathRequest<typeof path, "post">;
export type CategoriesPostResponse = PathResponse<typeof path, "post", 201>;
export type CategoriesPost403Response = PathResponse<typeof path, "post", 403>;
export type CategoriesPost404Response = PathResponse<typeof path, "post", 404>;
