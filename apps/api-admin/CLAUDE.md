# CLAUDE.md — apps/api-admin

This file provides guidance to Claude Code when working inside `apps/api-admin`.

## Commands

```bash
# Start dev server (watches for changes)
pnpm dev

# Database
pnpm db:generate   # Generate SQL migration files from schema changes
pnpm db:migrate    # Apply pending migrations to the database
pnpm db:push       # Push schema directly (dev shortcut — no migration files)
pnpm db:studio     # Open Drizzle Studio at http://localhost:4983
```

Run from monorepo root with filter:

```bash
pnpm --filter @orchestra/api-admin dev
pnpm --filter @orchestra/api-admin db:push
```

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Framework | Fastify 5 with `ZodTypeProvider` |
| Validation | Zod 4 via `fastify-type-provider-zod` |
| ORM | Drizzle ORM (postgres-js driver) |
| Database | PostgreSQL |
| Auth | @fastify/jwt (cookies) + @fastify/cookie |
| Docs | @fastify/swagger + @scalar/fastify-api-reference |
| Dev runner | tsx with `--env-file=.env` |

## Purpose

`api-admin` is the **internal backoffice API** for the Orchestra platform. It is completely separate from `apps/api` (the customer-facing API) and serves only the admin dashboard at `apps/admin`.

Key differences from `apps/api`:

| Concern | `apps/api` (customer) | `apps/api-admin` (backoffice) |
|---------|----------------------|-------------------------------|
| Port | 5005 | 5006 |
| Users table | `users` (clients, workers, owners) | `admin_users` (internal staff only) |
| Auth cookie | `access_token` | `admin_access_token` |
| Login identifier | e-mail or CPF | e-mail or registration number |
| Company context | Yes (RBAC) | No |

## Architecture

```
src/
├── server.ts                      # Entry point — registers plugins and routes
├── lib/
│   ├── env.ts                     # Zod-parsed process.env (fails fast on startup)
│   ├── errors.ts                  # AppError class + helpers (unauthorized, notFound…)
│   └── crypto.ts                  # hashPassword / verifyPassword (scrypt)
├── db/
│   ├── index.ts                   # Drizzle client singleton — exports `db`
│   └── schema/
│       └── admin-users.ts         # admin_users table
├── plugins/
│   ├── swagger.ts                 # OpenAPI at /openapi/json, Scalar UI at /docs
│   ├── auth.ts                    # @fastify/jwt + @fastify/cookie (admin_access_token)
│   └── db.ts                      # Decorates `db` onto fastify instance
├── http/
│   ├── middlewares/
│   │   └── authenticate.ts        # preHandler: verifies admin_access_token cookie
│   └── routes/
│       ├── index.ts               # Aggregates all route plugins
│       ├── status/
│       │   └── get-status.ts      # GET /status — health check
│       └── auth/
│           └── sign-in.ts         # POST /auth/sign-in
├── schemas/
│   └── auth/
│       └── sign-in.schema.ts      # signInSchema (identifier + password + rememberMe)
└── types/
    ├── fastify.d.ts               # Augments FastifyInstance.db + FastifyRequest.user
    └── jwt.ts                     # JwtPayload interface { sub, name, email }
```

## Environment Variables

All vars are validated at startup via `src/lib/env.ts`. Copy `.env.example` to `.env` and fill in values.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) |
| `COOKIE_SECRET` | Cookie signing secret (min 32 chars) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | Server port (default: `5006`) |

## Admin User Schema (`admin_users`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `name` | varchar(255) | Display name |
| `email` | varchar(255) | Unique, used as login identifier |
| `registration` | varchar(50) | Unique numeric sequence generated externally, used as alternative login identifier |
| `passwordHash` | varchar(255) | scrypt hash (salt:hash) |
| `avatarUrl` | text | Nullable |
| `isActive` | boolean | Default `true`; deactivated users receive 403 |
| `deletedAt` | timestamp | Soft-delete; non-null = user is deleted |
| `createdAt` | timestamp | Auto-set on insert |
| `updatedAt` | timestamp | Must be updated manually on each write |

## Authentication Flow

**POST `/auth/sign-in`**

Body: `{ identifier: string, password: string, rememberMe?: boolean }`

- `identifier` may be an **e-mail address** or a **registration number** (numeric string assigned externally).
- Lookup queries both `email` and `registration` columns with an `OR`.
- Inactive users (`isActive = false`) receive a `403` — distinct from wrong credentials (`401`).
- On success, sets an `admin_access_token` cookie:
  - `rememberMe = true` → `maxAge: 7 days`
  - `rememberMe = false` (default) → `maxAge: 15 minutes`

**Cookie name: `admin_access_token`** (intentionally different from the customer cookie `access_token` to avoid collisions if both APIs share a domain in production).

**JWT Payload:**

```ts
{ sub: string, name: string, email: string }
```

## Adding a New Route

1. Create `src/http/routes/<resource>/<verb>-<name>.ts`
2. Export a `FastifyPluginAsyncZod` named function
3. Define `schema` with `summary`, `tags`, and `response`
4. Register it in `src/http/routes/index.ts`

Protect routes that require a logged-in admin:

```ts
import { authenticate } from "@/http/middlewares/authenticate.js";

preHandler: [authenticate]
```

## Database Conventions

- All primary keys are `uuid` generated with `defaultRandom()`
- Timestamps: `createdAt` via `defaultNow()`; `updatedAt` must be set explicitly on each update
- Soft-delete pattern: set `deletedAt` timestamp instead of hard-deleting rows
- No barrel files — import schemas directly from their source file:

```ts
import { adminUsers } from "@/db/schema/admin-users.js";
```

## Import Paths

Use the `@/` alias for all internal imports (maps to `./src/`):

```ts
import { env } from "@/lib/env.js";
import { db } from "@/db/index.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
```

Always include the `.js` extension — required for `moduleResolution: "node16"`.

## API URLs (local)

| URL | Description |
|-----|-------------|
| `http://localhost:5006/status` | Health check |
| `http://localhost:5006/openapi/json` | OpenAPI spec |
| `http://localhost:5006/docs` | Scalar interactive API docs |
