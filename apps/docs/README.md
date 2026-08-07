# docs

Swagger UI documentation server for the opsflow API.

## Development

From the repo root:

```sh
npm run dev -- --filter=docs
```

Or from this directory:

```sh
npm run dev
```

Open [http://localhost:3001/docs](http://localhost:3001/docs).

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start dev server on port 3001 |
| `build` | Production build |
| `start` | Start production server |
| `check` | Run Biome lint and format check |
| `check:fix` | Run Biome lint and format with fixes |
| `check-types` | TypeScript check |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |

## Dependencies

- `@repo/dtos`: OpenAPI spec
- `swagger-ui-express`: API documentation UI

The OpenAPI spec lives in [`packages/dtos/openapi.yaml`](../../packages/dtos/openapi.yaml).
