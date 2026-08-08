# @repo/dtos

Shared API contract and TypeScript types for opsflow.

Single source of truth: [`openapi.yaml`](./openapi.yaml) → generated types → entity and endpoint DTOs.

## Structure

```
src/
├── generated/     # Auto-generated from openapi.yaml (do not edit)
├── entities/      # Domain schemas (Ticket, User, etc.)
├── endpoints/     # Per-route request/response types
└── lib/           # Path and schema helpers
```

## Generate types

```sh
npm run generate
```

Or from the repo root:

```sh
npm run gen
```

## Usage

```ts
// Domain entities
import type { Ticket, User } from "@repo/dtos";

// Endpoint-specific types
import type {
  TicketGetResponse,
  TicketGet404Response,
} from "@repo/dtos/endpoints/tickets/by-id/get.js";
```

## Type helpers

Types follow the [openapi-typescript](https://openapi-typescript.dev) `paths` / `components` pattern:

- `Schema<"Ticket">`: domain schema from `components["schemas"]`
- `PathResponse<"/tickets/{ticketId}", "get", 200>`: response body for a path + method + status

## OpenAPI spec

The spec covers auth, organizations (including branding and domains), users,
tickets, comments, AI features, analytics, and notifications. Local dev server URL:

```
http://localhost:4000/v1
```
