import type { Schema } from "@/lib/schema.js";

export type PlatformUser = Schema<"PlatformUser">;
export type PlatformAccessSession = Schema<"PlatformAccessSession">;
export type PaginatedPlatformAccessSessions =
	Schema<"PaginatedPlatformAccessSessions">;
export type PlatformRole = NonNullable<PlatformUser["role"]>;
