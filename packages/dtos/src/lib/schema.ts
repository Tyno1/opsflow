import type { components } from "@/generated/api.js";

export type Schemas = components["schemas"];

export type Schema<S extends keyof Schemas> = Schemas[S];
