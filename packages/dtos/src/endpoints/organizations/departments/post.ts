import type { PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DepartmentsPostParameters = Path["post"]["parameters"];
export type DepartmentsPostRequest = PathRequest<typeof path, "post">;
export type DepartmentsPostResponse = PathResponse<typeof path, "post", 201>;
export type DepartmentsPost403Response = PathResponse<typeof path, "post", 403>;
export type DepartmentsPost409Response = PathResponse<typeof path, "post", 409>;
