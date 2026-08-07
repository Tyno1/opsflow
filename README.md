# opsflow

Monorepo for an AI helpdesk platform: multi-tenant support with role-based access control, ticket management, and AI-assisted triage.

Built with [Turborepo](https://turborepo.dev), npm workspaces, and TypeScript.

## What's inside

### Apps

| App | Port | Description |
|-----|------|-------------|
| [`web`](./apps/web) | 3000 | Main Next.js frontend |
| [`docs`](./apps/docs) | 3001 | Documentation site (Next.js) |
| [`api-service`](./apps/api-service) | 4000 | Express API server (`/v1/*`) |

### Packages

| Package | Description |
|---------|-------------|
| [`@repo/dtos`](./packages/dtos) | OpenAPI spec, generated types, entities, and endpoint DTOs |
| [`@repo/ui`](./packages/ui) | Shared React component library |
| [`@repo/typescript-config`](./packages/typescript-config) | Shared `tsconfig.json` presets |

## Prerequisites

- Node.js >= 18
- npm 10.x

## Getting started

```sh
npm install
```

### Development

Run all apps:

```sh
npm run dev
```

Run a single app:

```sh
npm run dev -- --filter=web
npm run dev -- --filter=docs
npm run dev -- --filter=api-service
```

### API types

Regenerate TypeScript types from the OpenAPI spec:

```sh
npm run gen
```

### Other commands

```sh
npm run build         # build all apps and packages
npm run check-types   # typecheck across the monorepo
npm run check         # lint and format check
npm run check:fix     # lint and format with fixes
```

## Project structure

```
opsflow/
├── apps/
│   ├── api-service/   # Express backend
│   ├── docs/          # Next.js docs app
│   └── web/           # Next.js frontend
└── packages/
    ├── dtos/          # OpenAPI spec + shared types
    ├── typescript-config/
    └── ui/            # Shared React components
```

## API contract

The API is defined in [`packages/dtos/openapi.yaml`](./packages/dtos/openapi.yaml). The local dev server runs at:

```
http://localhost:4000/v1
```

Health check:

```sh
curl http://localhost:4000/v1/health
```

## Useful links

- [Turborepo docs](https://turborepo.dev/docs)
- [OpenAPI spec](./packages/dtos/openapi.yaml)
