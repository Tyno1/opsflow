import type { PathQuery, PathRequest, PathResponse } from "@/lib/path.js";
import type { Path, path } from "./path.js";

export type DepartmentsGetParameters = Path["get"]["parameters"];
export type DepartmentsGetQuery = PathQuery<typeof path, "get">;
export type DepartmentsGetRequest = PathRequest<typeof path, "get">;
export type DepartmentsGetResponse = PathResponse<typeof path, "get", 200>;
