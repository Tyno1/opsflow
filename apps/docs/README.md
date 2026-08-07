# docs

Documentation site for opsflow, built with Next.js.

## Development

From the repo root:

```sh
npm run dev -- --filter=docs
```

Or from this directory:

```sh
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start dev server on port 3001 |
| `build` | Production build |
| `start` | Start production server |
| `lint` | Run ESLint |
| `check-types` | TypeScript check |

## Dependencies

- `@repo/ui`: shared React components
- `swagger-ui`: API documentation UI

The OpenAPI spec lives in [`packages/dtos/openapi.yaml`](../../packages/dtos/openapi.yaml).
