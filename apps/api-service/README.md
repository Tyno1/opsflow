# api-service

Express API server for the opsflow helpdesk platform.

Implements the contract defined in [`packages/dtos/openapi.yaml`](../../packages/dtos/openapi.yaml).

## Development

From the repo root:

```sh
npm run dev -- --filter=api-service
```

Or from this directory:

```sh
npm run dev
```

Server starts at [http://localhost:4000](http://localhost:4000). All routes are prefixed with `/v1`.

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start with hot reload (`tsx watch`) |
| `build` | Compile TypeScript to `dist/` |
| `start` | Run compiled output |
| `check-types` | TypeScript check |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `DATABASE_URL` | — | Local PostgreSQL connection string (see `.env.example`) |

Copy `.env.example` to `.env` and set your local Postgres credentials. The app uses a local database (`optiops` by default), not Supabase.

## Database

Requires PostgreSQL running locally. Prisma reads `DATABASE_URL` from `.env` via `prisma.config.ts`.

```sh
# Create database (once)
createdb optiops

# Apply migrations
npx prisma migrate dev

# Regenerate client after schema changes
npx prisma generate

# Browse data
npx prisma studio
```

## Health check

```sh
curl http://localhost:4000/v1/health
# {"status":"ok"}
```
