import type { Schema } from "@repo/dtos/src/lib/schema.js";

export type User = Schema<"User">;
export type PaginatedUsers = Schema<"PaginatedUsers">;
export type Role = Schema<"Role">;
export type UserStatus = Schema<"User">["status"];
