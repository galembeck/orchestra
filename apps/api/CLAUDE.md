# CLAUDE.md — apps/api

This file provides guidance to Claude Code when working inside `apps/api`.

## Commands

```bash
# Start dev server (watches for changes)
pnpm dev

# Database
pnpm db:generate   # Generate SQL migration files from schema changes
pnpm db:migrate    # Apply pending migrations to the database
pnpm db:push       # Push schema directly (dev shortcut — no migration files)
pnpm db:studio     # Open Drizzle Studio (visual DB browser) at http://localhost:4983
```

Run from monorepo root with filter:

```bash
pnpm --filter @orchestra/api dev
pnpm --filter @orchestra/api db:push
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

## Architecture

```
src/
├── server.ts                   # Entry point — registers all plugins and routes
├── lib/
│   ├── env.ts                  # Zod-parsed process.env (fails fast on startup)
│   └── errors.ts               # AppError class + helpers (unauthorized, notFound…)
├── db/
│   ├── index.ts                # Drizzle client singleton — export `db`
│   └── schema/
│       ├── users.ts            # users table + accountTypeEnum (CLIENT|WORKER|OWNER) + profileTypeEnum
│       ├── companies.ts        # companies table + companyApprovalStatusEnum
│       ├── roles.ts            # roles table (companyId nullable = system role)
│       ├── role-permissions.ts # roleId + permissionKey pivot
│       └── company-members.ts  # userId + companyId + roleId + isOwner pivot
├── plugins/
│   ├── swagger.ts              # OpenAPI at /openapi/json, Scalar UI at /docs
│   ├── auth.ts                 # @fastify/jwt + @fastify/cookie
│   └── db.ts                   # Decorates `db` onto fastify instance
├── http/
│   ├── middlewares/
│   │   ├── authenticate.ts     # preHandler: verifies JWT cookie, sets req.user
│   │   └── authorize.ts        # requirePermission(key) factory — checks DB
│   └── routes/
│       ├── index.ts            # Aggregates all route plugins
│       └── status/
│           └── get-status.ts   # GET /status — health check
└── types/
    ├── fastify.d.ts            # Augments FastifyInstance.db + FastifyRequest.user
    ├── jwt.ts                  # JwtPayload interface
    └── permissions.ts          # PermissionKey const (mirrors packages/core)
```

## Environment Variables

All vars are validated at startup via `src/lib/env.ts`. Missing or invalid values crash immediately with a clear error message.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) |
| `COOKIE_SECRET` | Cookie signing secret (min 32 chars) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | Server port (default: `5005`) |

## Adding a New Route

1. Create a file under `src/http/routes/<resource>/<verb>-<name>.ts`
2. Export a `FastifyPluginCallbackZod` or `FastifyPluginAsyncZod` named function
3. Always define `schema` with `summary`, `tags`, `body`/`params`/`querystring`, and `response`
4. Register it in `src/http/routes/index.ts`

```ts
// src/http/routes/users/get-me.ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getMeRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/user", {
    preHandler: [authenticate],
    schema: {
      summary: "Get authenticated user",
      tags: ["Users"],
      security: [{ cookieAuth: [] }],
      response: {
        200: z.object({ id: z.string(), name: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
  }, async (req) => {
    const userId = req.user.sub;
    // query db via app.db or req.server.db
  });
};
```

## Auth & RBAC

**Authentication** (`authenticate` preHandler):
- Reads `access_token` cookie, verifies JWT, attaches payload to `req.user`
- `req.user.sub` = userId, `req.user.profileType` = platform-level role

**Authorization** (`requirePermission` factory):
- For company-scoped operations only — requires `companyId` in route params
- Queries `company_members` → `roles` → `role_permissions` at request time (no stale JWT data)
- Owners (`isOwner = true`) bypass all permission checks

```ts
// Usage:
preHandler: [authenticate, requirePermission(PermissionKey.MemberInvite)]
```

**Platform-level guard** (inline, for admin-only routes):
```ts
if (req.user.profileType !== "ADMIN") {
  return reply.status(403).send({ message: "Forbidden" });
}
```

## RBAC Permission Keys

Defined in `src/types/permissions.ts` (mirrors `packages/core`):

| Key | Value |
|-----|-------|
| `CompanyRead` | `company:read` |
| `CompanyUpdate` | `company:update` |
| `MemberList` | `member:list` |
| `MemberInvite` | `member:invite` |
| `MemberUpdateRole` | `member:update-role` |
| `MemberDelete` | `member:delete` |
| `RoleRead` | `role:read` |
| `RoleCreate` | `role:create` |
| `RoleUpdate` | `role:update` |
| `RoleDelete` | `role:delete` |
| `BillingRead` | `billing:read` |
| `BillingExport` | `billing:export` |
| *(+ 10 more)* | see `permissions.ts` |

## Database Conventions

- All primary keys are `uuid` generated with `defaultRandom()`
- All tables have `createdAt` (and `updatedAt` where applicable) as `timestamp().defaultNow()`
- Foreign key `onDelete` behavior:
  - `cascade` — child rows deleted with parent (e.g. company_members → companies)
  - `set null` — nullable FK set to null (e.g. company_members.roleId)
  - `restrict` — prevent deletion if children exist (e.g. companies.ownerId → users)
- Enums are defined as PostgreSQL native enums (`pgEnum`) next to the table that owns them
- Always import other schema files with `.js` extension: `import { users } from "./users.js"`

### Schema files

**No barrel file** (`index.ts`) — import schemas directly from their source file:

```ts
// correct
import { users } from "@/db/schema/users.js";

// wrong — no index.ts exists
import { users } from "@/db/schema/index.js";
```

Each schema file lives at `src/db/schema/<domain>.ts`, one table (plus its enums) per file.

## Import Paths

Use the `@/` alias for all internal imports (maps to `./src/`):

```ts
import { env } from "@/lib/env.js";
import { db } from "@/db/index.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
```

Note: always include the `.js` extension — required for `moduleResolution: "node16"`.

## API URLs (local)

| URL | Description |
|-----|-------------|
| `http://localhost:5005/status` | Health check |
| `http://localhost:5005/openapi/json` | OpenAPI spec (used by Kubb) |
| `http://localhost:5005/docs` | Scalar interactive API docs |
