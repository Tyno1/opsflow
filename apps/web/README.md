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
| `lint` | Run ESLint |
| `check-types` | TypeScript check |

## Dependencies

Uses shared packages from the monorepo:

- `@repo/ui`: shared React components
- `@repo/eslint-config`: lint rules
- `@repo/typescript-config`: TypeScript config
