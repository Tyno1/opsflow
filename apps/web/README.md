# web

Main Next.js frontend for opsflow.

## Development

From the repo root:

```sh
npm run dev -- --filter=web
```

Or from this directory:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start dev server on port 3000 |
| `build` | Production build |
| `start` | Start production server |
| `check` | Run Biome lint and format check |
| `check:fix` | Run Biome lint and format with fixes |
| `check-types` | TypeScript check |

## Dependencies

Uses shared packages from the monorepo:

- `@repo/ui`: shared React components
- `@repo/typescript-config`: TypeScript config
