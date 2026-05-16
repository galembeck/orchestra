# Administrators Platform Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Plataforma" page under a collapsible "Administradores" sidebar section that lists all internal admin users and allows editing each user's role and per-user permission overrides via a slide-over sheet.

**Architecture:** A `admin_roles` table stores 9 predefined roles each with a default `PermissionMatrix` JSON blob; `admin_users` gains a `roleId` FK and a `permissionOverrides` JSON column for per-user deviations. Four new api-admin routes expose the data. The admin frontend consumes them through new core-package service files, rendering a table and a slide-over sheet.

**Tech Stack:** Drizzle ORM + PostgreSQL (api-admin), Fastify 5 + Zod 4, TanStack Query v5, TanStack Router v1 (file-based), Tailwind CSS v4, `@repo/ui` component library.

---

## File Map

### `apps/api-admin`
| Action | Path |
|---|---|
| Create | `src/db/schema/admin-roles.ts` |
| Modify | `src/db/schema/admin-users.ts` |
| Create | `src/db/seed/admin-roles.seed.ts` |
| Create | `src/schemas/admin-users/update-admin-user-role.schema.ts` |
| Create | `src/schemas/admin-users/update-admin-user-permissions.schema.ts` |
| Create | `src/http/routes/admin-users/get-admin-users.ts` |
| Create | `src/http/routes/admin-users/update-admin-user-role.ts` |
| Create | `src/http/routes/admin-users/update-admin-user-permissions.ts` |
| Create | `src/http/routes/admin-roles/get-admin-roles.ts` |
| Modify | `src/http/routes/index.ts` |

### `packages/core`
| Action | Path |
|---|---|
| Create | `src/types/admin-user.ts` |
| Create | `src/services/admin/admin-roles.service.ts` |
| Create | `src/services/admin/admin-users.service.ts` |

### `apps/admin`
| Action | Path |
|---|---|
| Modify | `src/constants/_app/panel/panel-sidebar.ts` |
| Modify | `src/constants/_app/panel/panel-navigation.ts` |
| Create | `src/pages/_app/panel/administrators/platform/index.tsx` |
| Create | `src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx` |
| Create | `src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx` |
| Create | `src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx` |

---

## Task 1: Add `admin_roles` Drizzle schema

**Files:**
- Create: `apps/api-admin/src/db/schema/admin-roles.ts`

- [ ] **Step 1: Create the schema file**

```typescript
// apps/api-admin/src/db/schema/admin-roles.ts
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const adminRoles = pgTable("admin_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AdminRole = typeof adminRoles.$inferSelect;
export type NewAdminRole = typeof adminRoles.$inferInsert;
```

- [ ] **Step 2: Commit**

```bash
git add apps/api-admin/src/db/schema/admin-roles.ts
git commit -m "feat(api-admin): add admin_roles drizzle schema"
```

---

## Task 2: Update `admin_users` schema — add `roleId` and `permissionOverrides`

**Files:**
- Modify: `apps/api-admin/src/db/schema/admin-users.ts`

- [ ] **Step 1: Add the two new columns**

Replace the full file content with:

```typescript
// apps/api-admin/src/db/schema/admin-users.ts
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { adminRoles } from "./admin-roles.js";

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // Numeric sequence generated externally — used as an alternative login credential
  registration: varchar("registration", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  roleId: uuid("role_id").references(() => adminRoles.id),
  permissionOverrides: jsonb("permission_overrides"),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
```

- [ ] **Step 2: Commit**

```bash
git add apps/api-admin/src/db/schema/admin-users.ts
git commit -m "feat(api-admin): add roleId and permissionOverrides to admin_users"
```

---

## Task 3: Generate and apply the database migration

**Files:**
- Auto-generated migration SQL in `apps/api-admin/src/db/migrations/`

- [ ] **Step 1: Generate the migration**

```bash
cd apps/api-admin
pnpm db:generate
```

Expected: a new `.sql` file is created inside `src/db/migrations/` containing `CREATE TABLE admin_roles` and `ALTER TABLE admin_users ADD COLUMN role_id` / `ADD COLUMN permission_overrides`.

- [ ] **Step 2: Apply the migration**

```bash
pnpm db:migrate
```

Expected: output shows the migration applied without errors.

- [ ] **Step 3: Commit the generated migration**

```bash
cd ../..
git add apps/api-admin/src/db/migrations/
git commit -m "feat(api-admin): add admin_roles table and update admin_users migration"
```

---

## Task 4: Seed the 9 predefined roles

**Files:**
- Create: `apps/api-admin/src/db/seed/admin-roles.seed.ts`

- [ ] **Step 1: Create the seed file**

```typescript
// apps/api-admin/src/db/seed/admin-roles.seed.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminRoles } from "../schema/admin-roles.js";

const ALL_TRUE = {
  companies: { view: true, approve: true, reject: true },
  adminUsers: {
    view: true,
    create: true,
    updateRole: true,
    updatePermissions: true,
    deactivate: true,
  },
  settings: { view: true, edit: true },
};

const READ_ONLY = {
  companies: { view: true, approve: false, reject: false },
  adminUsers: {
    view: true,
    create: false,
    updateRole: false,
    updatePermissions: false,
    deactivate: false,
  },
  settings: { view: true, edit: false },
};

const ROLES = [
  {
    key: "owner",
    name: "Owner",
    description: "Acesso total à plataforma.",
    permissions: ALL_TRUE,
  },
  {
    key: "super_admin",
    name: "Super Admin",
    description: "Acesso total à plataforma.",
    permissions: ALL_TRUE,
  },
  {
    key: "developer",
    name: "Developer",
    description: "Acesso técnico: leitura de dados e configurações.",
    permissions: {
      companies: { view: true, approve: false, reject: false },
      adminUsers: {
        view: true,
        create: false,
        updateRole: false,
        updatePermissions: false,
        deactivate: false,
      },
      settings: { view: true, edit: true },
    },
  },
  {
    key: "manager",
    name: "Manager",
    description: "Gerenciamento de cadastros e criação de administradores.",
    permissions: {
      companies: { view: true, approve: true, reject: true },
      adminUsers: {
        view: true,
        create: true,
        updateRole: false,
        updatePermissions: false,
        deactivate: false,
      },
      settings: { view: true, edit: false },
    },
  },
  {
    key: "moderator",
    name: "Moderator",
    description: "Aprovação e recusa de cadastros de empresas.",
    permissions: {
      companies: { view: true, approve: true, reject: true },
      adminUsers: {
        view: true,
        create: false,
        updateRole: false,
        updatePermissions: false,
        deactivate: false,
      },
      settings: { view: true, edit: false },
    },
  },
  {
    key: "analyst",
    name: "Analyst",
    description: "Visualização de dados para análise.",
    permissions: READ_ONLY,
  },
  {
    key: "billing",
    name: "Billing",
    description: "Acesso a dados financeiros e configurações de cobrança.",
    permissions: {
      companies: { view: true, approve: false, reject: false },
      adminUsers: {
        view: true,
        create: false,
        updateRole: false,
        updatePermissions: false,
        deactivate: false,
      },
      settings: { view: true, edit: true },
    },
  },
  {
    key: "people",
    name: "People",
    description: "Gestão de usuários administradores.",
    permissions: {
      companies: { view: true, approve: false, reject: false },
      adminUsers: {
        view: true,
        create: true,
        updateRole: true,
        updatePermissions: true,
        deactivate: true,
      },
      settings: { view: true, edit: false },
    },
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Acesso somente leitura.",
    permissions: READ_ONLY,
  },
];

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const client = postgres(connectionString);
  const db = drizzle(client);

  await db
    .insert(adminRoles)
    .values(ROLES)
    .onConflictDoUpdate({
      target: adminRoles.key,
      set: {
        name: (values) => values.name,
        description: (values) => values.description,
        permissions: (values) => values.permissions,
        updatedAt: new Date(),
      },
    });

  console.log("✓ Admin roles seeded");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add seed script to `apps/api-admin/package.json`**

Open `apps/api-admin/package.json` and add to the `"scripts"` object:

```json
"db:seed:roles": "tsx --env-file=.env src/db/seed/admin-roles.seed.ts"
```

- [ ] **Step 3: Run the seed**

```bash
cd apps/api-admin
pnpm db:seed:roles
```

Expected output:
```
✓ Admin roles seeded
```

- [ ] **Step 4: Commit**

```bash
cd ../..
git add apps/api-admin/src/db/seed/admin-roles.seed.ts apps/api-admin/package.json
git commit -m "feat(api-admin): add admin roles seed script with 9 predefined roles"
```

---

## Task 5: Create `GET /admin-roles` route

**Files:**
- Create: `apps/api-admin/src/http/routes/admin-roles/get-admin-roles.ts`

- [ ] **Step 1: Create the route file**

```typescript
// apps/api-admin/src/http/routes/admin-roles/get-admin-roles.ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getAdminRolesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/admin-roles",
    {
      preHandler: [authenticate],
      schema: {
        summary: "List all admin roles",
        tags: ["Admin Roles"],
        security: [{ cookieAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              key: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              permissions: z.record(z.unknown()),
            })
          ),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (_req, reply) => {
      const roles = await app.db
        .select({
          id: adminRoles.id,
          key: adminRoles.key,
          name: adminRoles.name,
          description: adminRoles.description,
          permissions: adminRoles.permissions,
        })
        .from(adminRoles)
        .orderBy(adminRoles.name);

      return reply.status(200).send(
        roles.map((r) => ({
          ...r,
          permissions: r.permissions as Record<string, unknown>,
        }))
      );
    }
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/api-admin/src/http/routes/admin-roles/get-admin-roles.ts
git commit -m "feat(api-admin): add GET /admin-roles route"
```

---

## Task 6: Create `GET /admin-users` route

**Files:**
- Create: `apps/api-admin/src/http/routes/admin-users/get-admin-users.ts`

- [ ] **Step 1: Create the route file**

```typescript
// apps/api-admin/src/http/routes/admin-users/get-admin-users.ts
import { eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getAdminUsersRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/admin-users",
    {
      preHandler: [authenticate],
      schema: {
        summary: "List all admin users",
        tags: ["Admin Users"],
        security: [{ cookieAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string(),
              registration: z.string(),
              avatarUrl: z.string().nullable(),
              isActive: z.boolean(),
              createdAt: z.string(),
              role: z
                .object({
                  id: z.string().uuid(),
                  key: z.string(),
                  name: z.string(),
                })
                .nullable(),
              permissionOverrides: z.record(z.unknown()).nullable(),
            })
          ),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (_req, reply) => {
      const rows = await app.db
        .select({
          id: adminUsers.id,
          name: adminUsers.name,
          email: adminUsers.email,
          registration: adminUsers.registration,
          avatarUrl: adminUsers.avatarUrl,
          isActive: adminUsers.isActive,
          createdAt: adminUsers.createdAt,
          roleId: adminUsers.roleId,
          permissionOverrides: adminUsers.permissionOverrides,
          roleKey: adminRoles.key,
          roleName: adminRoles.name,
        })
        .from(adminUsers)
        .leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
        .where(isNull(adminUsers.deletedAt))
        .orderBy(adminUsers.name);

      return reply.status(200).send(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          registration: row.registration,
          avatarUrl: row.avatarUrl,
          isActive: row.isActive,
          createdAt: row.createdAt.toISOString(),
          role:
            row.roleId && row.roleKey && row.roleName
              ? { id: row.roleId, key: row.roleKey, name: row.roleName }
              : null,
          permissionOverrides:
            (row.permissionOverrides as Record<string, unknown> | null) ?? null,
        }))
      );
    }
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/api-admin/src/http/routes/admin-users/get-admin-users.ts
git commit -m "feat(api-admin): add GET /admin-users route"
```

---

## Task 7: Create `PATCH /admin-users/:id/role` route

**Files:**
- Create: `apps/api-admin/src/schemas/admin-users/update-admin-user-role.schema.ts`
- Create: `apps/api-admin/src/http/routes/admin-users/update-admin-user-role.ts`

- [ ] **Step 1: Create the Zod schema**

```typescript
// apps/api-admin/src/schemas/admin-users/update-admin-user-role.schema.ts
import { z } from "zod";

export const updateAdminUserRoleSchema = z.object({
  roleId: z.string().uuid(),
});

export type UpdateAdminUserRoleInput = z.infer<typeof updateAdminUserRoleSchema>;
```

- [ ] **Step 2: Create the route**

```typescript
// apps/api-admin/src/http/routes/admin-users/update-admin-user-role.ts
import { and, eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";
import { updateAdminUserRoleSchema } from "@/schemas/admin-users/update-admin-user-role.schema.js";

export const updateAdminUserRoleRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    "/admin-users/:id/role",
    {
      preHandler: [authenticate],
      schema: {
        summary: "Assign a role to an admin user",
        tags: ["Admin Users"],
        security: [{ cookieAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: updateAdminUserRoleSchema,
        response: {
          204: z.void(),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (req, reply) => {
      const [role] = await app.db
        .select({ id: adminRoles.id })
        .from(adminRoles)
        .where(eq(adminRoles.id, req.body.roleId))
        .limit(1);

      if (!role) {
        throw new AppError(404, "Cargo não encontrado.");
      }

      const [updated] = await app.db
        .update(adminUsers)
        .set({ roleId: req.body.roleId, updatedAt: new Date() })
        .where(
          and(eq(adminUsers.id, req.params.id), isNull(adminUsers.deletedAt))
        )
        .returning({ id: adminUsers.id });

      if (!updated) {
        throw new AppError(404, "Administrador não encontrado.");
      }

      return reply.status(204).send();
    }
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/api-admin/src/schemas/admin-users/update-admin-user-role.schema.ts \
        apps/api-admin/src/http/routes/admin-users/update-admin-user-role.ts
git commit -m "feat(api-admin): add PATCH /admin-users/:id/role route"
```

---

## Task 8: Create `PATCH /admin-users/:id/permissions` route

**Files:**
- Create: `apps/api-admin/src/schemas/admin-users/update-admin-user-permissions.schema.ts`
- Create: `apps/api-admin/src/http/routes/admin-users/update-admin-user-permissions.ts`

- [ ] **Step 1: Create the Zod schema**

```typescript
// apps/api-admin/src/schemas/admin-users/update-admin-user-permissions.schema.ts
import { z } from "zod";

export const permissionOverridesSchema = z
  .object({
    companies: z
      .object({
        view: z.boolean().optional(),
        approve: z.boolean().optional(),
        reject: z.boolean().optional(),
      })
      .optional(),
    adminUsers: z
      .object({
        view: z.boolean().optional(),
        create: z.boolean().optional(),
        updateRole: z.boolean().optional(),
        updatePermissions: z.boolean().optional(),
        deactivate: z.boolean().optional(),
      })
      .optional(),
    settings: z
      .object({
        view: z.boolean().optional(),
        edit: z.boolean().optional(),
      })
      .optional(),
  })
  .nullable();

export const updateAdminUserPermissionsSchema = z.object({
  permissionOverrides: permissionOverridesSchema,
});

export type UpdateAdminUserPermissionsInput = z.infer<
  typeof updateAdminUserPermissionsSchema
>;
```

- [ ] **Step 2: Create the route**

```typescript
// apps/api-admin/src/http/routes/admin-users/update-admin-user-permissions.ts
import { and, eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";
import { updateAdminUserPermissionsSchema } from "@/schemas/admin-users/update-admin-user-permissions.schema.js";

export const updateAdminUserPermissionsRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.patch(
    "/admin-users/:id/permissions",
    {
      preHandler: [authenticate],
      schema: {
        summary: "Update per-user permission overrides",
        tags: ["Admin Users"],
        security: [{ cookieAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: updateAdminUserPermissionsSchema,
        response: {
          204: z.void(),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (req, reply) => {
      const [updated] = await app.db
        .update(adminUsers)
        .set({
          permissionOverrides: req.body.permissionOverrides,
          updatedAt: new Date(),
        })
        .where(
          and(eq(adminUsers.id, req.params.id), isNull(adminUsers.deletedAt))
        )
        .returning({ id: adminUsers.id });

      if (!updated) {
        throw new AppError(404, "Administrador não encontrado.");
      }

      return reply.status(204).send();
    }
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/api-admin/src/schemas/admin-users/update-admin-user-permissions.schema.ts \
        apps/api-admin/src/http/routes/admin-users/update-admin-user-permissions.ts
git commit -m "feat(api-admin): add PATCH /admin-users/:id/permissions route"
```

---

## Task 9: Register all new routes in `index.ts`

**Files:**
- Modify: `apps/api-admin/src/http/routes/index.ts`

- [ ] **Step 1: Update the routes index**

Replace the file with:

```typescript
// apps/api-admin/src/http/routes/index.ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getAdminRolesRoute } from "./admin-roles/get-admin-roles.js";
import { createAdminUserRoute } from "./admin-users/create-admin-user.js";
import { getAdminUsersRoute } from "./admin-users/get-admin-users.js";
import { updateAdminUserPermissionsRoute } from "./admin-users/update-admin-user-permissions.js";
import { updateAdminUserRoleRoute } from "./admin-users/update-admin-user-role.js";
import { signInRoute } from "./auth/sign-in.js";
import { approveCompanyRoute } from "./companies/approve-company.js";
import { getCompanyDocumentsRoute } from "./companies/get-company-documents.js";
import { getCompanyRegistrationRoute } from "./companies/get-company-registration.js";
import { getCompanyRegistrationsRoute } from "./companies/get-registrations.js";
import { rejectCompanyRoute } from "./companies/reject-company.js";
import { getStatusRoute } from "./status/get-status.js";
import { getMeRoute } from "./users/get-me.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
  await app.register(getStatusRoute);
  await app.register(signInRoute);
  await app.register(getMeRoute);
  await app.register(createAdminUserRoute);
  await app.register(getAdminUsersRoute);
  await app.register(updateAdminUserRoleRoute);
  await app.register(updateAdminUserPermissionsRoute);
  await app.register(getAdminRolesRoute);
  await app.register(getCompanyRegistrationsRoute);
  await app.register(getCompanyRegistrationRoute);
  await app.register(getCompanyDocumentsRoute);
  await app.register(approveCompanyRoute);
  await app.register(rejectCompanyRoute);
};
```

- [ ] **Step 2: Start the api-admin dev server and verify the new routes appear in Scalar docs**

```bash
cd apps/api-admin
pnpm dev
```

Open `http://localhost:5006/docs` and confirm these endpoints appear:
- `GET /admin-roles`
- `GET /admin-users`
- `PATCH /admin-users/{id}/role`
- `PATCH /admin-users/{id}/permissions`

Stop the server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd ../..
git add apps/api-admin/src/http/routes/index.ts
git commit -m "feat(api-admin): register new admin-users and admin-roles routes"
```

---

## Task 10: Add shared types to `packages/core`

**Files:**
- Create: `packages/core/src/types/admin-user.ts`

- [ ] **Step 1: Create the types file**

```typescript
// packages/core/src/types/admin-user.ts
export type PermissionMatrix = {
  companies: { view: boolean; approve: boolean; reject: boolean };
  adminUsers: {
    view: boolean;
    create: boolean;
    updateRole: boolean;
    updatePermissions: boolean;
    deactivate: boolean;
  };
  settings: { view: boolean; edit: boolean };
};

export type AdminRole = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  permissions: PermissionMatrix;
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  registration: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  role: { id: string; key: string; name: string } | null;
  permissionOverrides: Partial<PermissionMatrix> | null;
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/types/admin-user.ts
git commit -m "feat(core): add AdminRole, AdminUserListItem and PermissionMatrix types"
```

---

## Task 11: Add `admin-roles.service.ts` to core

**Files:**
- Create: `packages/core/src/services/admin/admin-roles.service.ts`

- [ ] **Step 1: Create the service file**

```typescript
// packages/core/src/services/admin/admin-roles.service.ts
import { adminApi } from "../../api/connection/api-admin.js";
import type { AdminRole } from "../../types/admin-user.js";

export const ADMIN_ROLES_QUERY_KEY = ["admin", "roles"] as const;

export const adminRolesQueryOptions = {
  queryKey: ADMIN_ROLES_QUERY_KEY,
  queryFn: () => adminApi.get<AdminRole[]>("/admin-roles"),
  staleTime: 5 * 60 * 1000,
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/services/admin/admin-roles.service.ts
git commit -m "feat(core): add adminRolesQueryOptions service"
```

---

## Task 12: Add `admin-users.service.ts` to core

**Files:**
- Create: `packages/core/src/services/admin/admin-users.service.ts`

- [ ] **Step 1: Create the service file**

```typescript
// packages/core/src/services/admin/admin-users.service.ts
import { adminApi } from "../../api/connection/api-admin.js";
import type { AdminUserListItem, PermissionMatrix } from "../../types/admin-user.js";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export const adminUsersQueryOptions = {
  queryKey: ADMIN_USERS_QUERY_KEY,
  queryFn: () => adminApi.get<AdminUserListItem[]>("/admin-users"),
  staleTime: 30 * 1000,
} as const;

export const updateAdminUserRole = (id: string, roleId: string) =>
  adminApi.patch(`/admin-users/${id}/role`, { roleId });

export const updateAdminUserPermissions = (
  id: string,
  permissionOverrides: Partial<PermissionMatrix> | null
) => adminApi.patch(`/admin-users/${id}/permissions`, { permissionOverrides });

export const updateAdminUserRoleMutationOptions = {
  mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
    updateAdminUserRole(id, roleId),
} as const;

export const updateAdminUserPermissionsMutationOptions = {
  mutationFn: ({
    id,
    permissionOverrides,
  }: {
    id: string;
    permissionOverrides: Partial<PermissionMatrix> | null;
  }) => updateAdminUserPermissions(id, permissionOverrides),
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/services/admin/admin-users.service.ts
git commit -m "feat(core): add admin users query options and mutation functions"
```

---

## Task 13: Update sidebar and navigation constants

**Files:**
- Modify: `apps/admin/src/constants/_app/panel/panel-sidebar.ts`
- Modify: `apps/admin/src/constants/_app/panel/panel-navigation.ts`

- [ ] **Step 1: Update `panel-sidebar.ts`** — make "Administradores" collapsible with a "Plataforma" sub-item

```typescript
// apps/admin/src/constants/_app/panel/panel-sidebar.ts
import { CheckCircle, LayoutDashboard, ShieldUser } from "lucide-react";

export const dashboardData = {
  primary: [
    {
      title: "Visão geral",
      url: "/panel/overview",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Administradores",
      icon: ShieldUser,
      items: [
        { title: "Plataforma", url: "/panel/administrators/platform" },
      ],
    },
    {
      title: "Validação de cadastro",
      url: "/panel/validation",
      icon: CheckCircle,
    },
  ],
};
```

- [ ] **Step 2: Update `panel-navigation.ts`** — change the administrators URL

In `apps/admin/src/constants/_app/panel/panel-navigation.ts`, change the `administrators` entry URL from `"/panel/administrators"` to `"/panel/administrators/platform"`:

```typescript
{
  id: "administrators",
  title: "Administradores",
  url: "/panel/administrators/platform",
  description: "Lista de administradores com suas informações e permissões.",
  group: "Operação",
  icon: dashboardData.primary.find((item) => item.title === "Administradores")
    ?.icon,
  keywords: [
    "administradores",
    "admin",
    "administrators",
    "overview",
    "dashboard",
  ],
},
```

- [ ] **Step 3: Run Biome on both files**

```bash
cd apps/admin
pnpm dlx @biomejs/biome check --write \
  src/constants/_app/panel/panel-sidebar.ts \
  src/constants/_app/panel/panel-navigation.ts
```

Fix any reported errors before proceeding.

- [ ] **Step 4: Commit**

```bash
cd ../..
git add apps/admin/src/constants/_app/panel/panel-sidebar.ts \
        apps/admin/src/constants/_app/panel/panel-navigation.ts
git commit -m "feat(admin): make Administradores sidebar item collapsible with Plataforma sub-item"
```

---

## Task 14: Create the administrators platform page (`index.tsx`)

**Files:**
- Create: `apps/admin/src/pages/_app/panel/administrators/platform/index.tsx`

- [ ] **Step 1: Create the directory and page file**

```tsx
// apps/admin/src/pages/_app/panel/administrators/platform/index.tsx
import {
  adminRolesQueryOptions,
} from "@repo/core/services/admin/admin-roles.service";
import {
  ADMIN_USERS_QUERY_KEY,
  adminUsersQueryOptions,
  updateAdminUserPermissionsMutationOptions,
  updateAdminUserRoleMutationOptions,
} from "@repo/core/services/admin/admin-users.service";
import type { AdminRole, AdminUserListItem, PermissionMatrix } from "@repo/core/types/admin-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdministratorsTable } from "./~components/-administrators-table";
import { EditPermissionsSheet } from "./~components/-edit-permissions-sheet";

export const Route = createFileRoute("/_app/panel/administrators/platform/")({
  component: PlatformAdministratorsPage,
  head: () => ({
    meta: [{ title: "Administradores — Plataforma | Painel - orchestra.admin" }],
  }),
});

function PlatformAdministratorsPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  const { data: users = [] } = useQuery(adminUsersQueryOptions);
  const { data: roles = [] } = useQuery(adminRolesQueryOptions);

  const { mutate: handleUpdateRole } = useMutation({
    ...updateAdminUserRoleMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("Cargo atualizado com sucesso.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar o cargo.");
    },
  });

  const { mutate: handleUpdatePermissions } = useMutation({
    ...updateAdminUserPermissionsMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("Permissões atualizadas com sucesso.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar as permissões.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
          Administradores
        </span>

        <h1 className="font-instrument-serif font-medium text-3xl text-foreground-primary">
          Plataforma
        </h1>

        <p className="font-inter text-[13px] text-foreground-tertiary">
          Gerencie os administradores internos da plataforma, seus cargos e permissões.
        </p>
      </div>

      <AdministratorsTable
        users={users}
        onEditPermissions={setSelectedUser}
      />

      <EditPermissionsSheet
        user={selectedUser}
        roles={roles}
        onClose={() => setSelectedUser(null)}
        onSaveRole={(userId, roleId) => {
          handleUpdateRole({ id: userId, roleId });
          setSelectedUser(null);
        }}
        onSavePermissions={(userId, permissionOverrides) => {
          handleUpdatePermissions({ id: userId, permissionOverrides });
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit (before Biome — Biome runs after all frontend files are created)**

```bash
git add apps/admin/src/pages/_app/panel/administrators/platform/index.tsx
git commit -m "feat(admin): add administrators platform page route"
```

---

## Task 15: Create `-administrators-table.tsx`

**Files:**
- Create: `apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx`

- [ ] **Step 1: Create the component**

```tsx
// apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx
import type { AdminUserListItem } from "@repo/core/types/admin-user";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/molecules/card/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/molecules/table/table";
import { AdministratorRowMenu } from "./-administrator-row-menu";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

interface AdministratorsTableProps {
  users: AdminUserListItem[];
  onEditPermissions: (user: AdminUserListItem) => void;
}

export function AdministratorsTable({
  users,
  onEditPermissions,
}: AdministratorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administradores da plataforma</CardTitle>
        <CardDescription className="mt-1">
          Lista de todos os administradores internos cadastrados na plataforma.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-inter text-foreground-secondary text-sm">
              Nenhum administrador encontrado.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground-primary">
                    {user.name}
                  </TableCell>

                  <TableCell className="text-foreground-secondary">
                    {user.email}
                  </TableCell>

                  <TableCell className="font-jetbrains-mono text-xs text-foreground-secondary">
                    {user.registration}
                  </TableCell>

                  <TableCell>
                    {user.role ? (
                      <Badge variant="secondary">{user.role.name}</Badge>
                    ) : (
                      <span className="text-foreground-tertiary text-xs">
                        Sem cargo
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-foreground-secondary">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell>
                    <AdministratorRowMenu
                      user={user}
                      onEditPermissions={onEditPermissions}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx"
git commit -m "feat(admin): add administrators table component"
```

---

## Task 16: Create `-administrator-row-menu.tsx`

**Files:**
- Create: `apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx`

- [ ] **Step 1: Create the component**

```tsx
// apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx
import type { AdminUserListItem } from "@repo/core/types/admin-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import { MoreHorizontal, ShieldCheck } from "lucide-react";

interface AdministratorRowMenuProps {
  user: AdminUserListItem;
  onEditPermissions: (user: AdminUserListItem) => void;
}

export function AdministratorRowMenu({
  user,
  onEditPermissions,
}: AdministratorRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Mais ações"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-surface hover:text-foreground-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEditPermissions(user)}>
          <ShieldCheck />
          Editar permissões
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx"
git commit -m "feat(admin): add administrator row menu component"
```

---

## Task 17: Create `-edit-permissions-sheet.tsx`

**Files:**
- Create: `apps/admin/src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx`

- [ ] **Step 1: Create the component**

```tsx
// apps/admin/src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx
import type { AdminRole, AdminUserListItem, PermissionMatrix } from "@repo/core/types/admin-user";
import { Button } from "@repo/ui/components/atoms/button/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/molecules/sheet/sheet";
import { useEffect, useState } from "react";

const DOMAIN_LABELS: Record<string, string> = {
  companies: "Empresas",
  adminUsers: "Administradores",
  settings: "Configurações",
};

const ACTION_LABELS: Record<string, string> = {
  view: "Visualizar",
  approve: "Aprovar",
  reject: "Recusar",
  create: "Criar",
  updateRole: "Alterar cargo",
  updatePermissions: "Alterar permissões",
  deactivate: "Desativar",
  edit: "Editar",
};

function deepMerge(
  base: PermissionMatrix,
  overrides: Partial<PermissionMatrix> | null
): PermissionMatrix {
  if (!overrides) return base;

  return {
    companies: { ...base.companies, ...(overrides.companies ?? {}) },
    adminUsers: { ...base.adminUsers, ...(overrides.adminUsers ?? {}) },
    settings: { ...base.settings, ...(overrides.settings ?? {}) },
  };
}

interface EditPermissionsSheetProps {
  user: AdminUserListItem | null;
  roles: AdminRole[];
  onClose: () => void;
  onSaveRole: (userId: string, roleId: string) => void;
  onSavePermissions: (
    userId: string,
    permissionOverrides: Partial<PermissionMatrix> | null
  ) => void;
}

export function EditPermissionsSheet({
  user,
  roles,
  onClose,
  onSaveRole,
  onSavePermissions,
}: EditPermissionsSheetProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [overrides, setOverrides] = useState<Partial<PermissionMatrix> | null>(null);

  // Re-initialise local state whenever the target user changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on user change
  useEffect(() => {
    if (user) {
      setSelectedRoleId(user.role?.id ?? "");
      setOverrides(user.permissionOverrides ?? null);
    }
  }, [user?.id]);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const resolvedPermissions: PermissionMatrix | null = selectedRole
    ? deepMerge(selectedRole.permissions, overrides)
    : null;

  const roleDefaultPermissions: PermissionMatrix | null =
    selectedRole?.permissions ?? null;

  function handleOpenChange(open: boolean) {
    if (!open) onClose();
  }

  function togglePermission(
    domain: keyof PermissionMatrix,
    action: string,
    value: boolean
  ) {
    setOverrides((prev) => ({
      ...prev,
      [domain]: {
        ...(prev?.[domain] ?? {}),
        [action]: value,
      },
    }));
  }

  function handleSave() {
    if (!user) return;
    const roleChanged = selectedRoleId !== (user.role?.id ?? "");
    if (roleChanged && selectedRoleId) {
      onSaveRole(user.id, selectedRoleId);
    }
    onSavePermissions(user.id, overrides);
  }

  function handleClearOverrides() {
    if (!user) return;
    setOverrides(null);
    onSavePermissions(user.id, null);
  }

  return (
    <Sheet open={!!user} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Editar permissões</SheetTitle>
          <SheetDescription>
            {user?.name} — {user?.email}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <label
              className="font-inter text-xs font-medium text-foreground-secondary uppercase tracking-wide"
              htmlFor="role-select"
            >
              Cargo
            </label>
            <select
              id="role-select"
              className="rounded-md border border-border bg-surface px-3 py-2 font-inter text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setOverrides(null);
              }}
            >
              <option value="">Sem cargo</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permission matrix */}
          {resolvedPermissions && roleDefaultPermissions && (
            <div className="flex flex-col gap-4">
              <span className="font-inter text-xs font-medium text-foreground-secondary uppercase tracking-wide">
                Permissões
              </span>

              {(
                Object.entries(resolvedPermissions) as [
                  keyof PermissionMatrix,
                  Record<string, boolean>
                ][]
              ).map(([domain, actions]) => (
                <div key={domain} className="flex flex-col gap-2">
                  <span className="font-inter text-sm font-medium text-foreground-primary">
                    {DOMAIN_LABELS[domain] ?? domain}
                  </span>

                  {Object.entries(actions).map(([action, value]) => {
                    const roleDefault =
                      (roleDefaultPermissions[domain] as Record<string, boolean>)[
                        action
                      ];
                    const isOverride = value !== roleDefault;

                    return (
                      <label
                        key={action}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-surface-secondary"
                      >
                        <span
                          className={`font-inter text-sm ${isOverride ? "italic text-foreground-primary" : "text-foreground-secondary"}`}
                        >
                          {ACTION_LABELS[action] ?? action}
                          {isOverride && (
                            <span
                              aria-label="Substituição ativa"
                              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"
                            />
                          )}
                        </span>

                        <input
                          type="checkbox"
                          checked={value}
                          className="h-4 w-4 cursor-pointer accent-foreground-primary"
                          onChange={(e) =>
                            togglePermission(domain, action, e.target.checked)
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter>
          {overrides && (
            <button
              type="button"
              className="font-inter text-xs text-foreground-tertiary underline underline-offset-2 hover:text-foreground-secondary"
              onClick={handleClearOverrides}
            >
              Limpar substituições
            </button>
          )}

          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "apps/admin/src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx"
git commit -m "feat(admin): add edit permissions slide-over sheet"
```

---

## Task 18: Run Biome and type-check

**Files:** All newly created/modified files in `apps/admin` and `packages/core`.

- [ ] **Step 1: Run Biome on admin app files**

```bash
cd apps/admin
pnpm dlx @biomejs/biome check --write \
  src/pages/_app/panel/administrators/platform/index.tsx \
  "src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx" \
  "src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx" \
  "src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx"
```

Fix any reported errors before continuing.

- [ ] **Step 2: Run Biome on core package files**

```bash
cd ../..
cd packages/core
pnpm dlx @biomejs/biome check --write \
  src/types/admin-user.ts \
  src/services/admin/admin-roles.service.ts \
  src/services/admin/admin-users.service.ts
```

Fix any reported errors.

- [ ] **Step 3: Run Biome on api-admin files**

```bash
cd ../..
cd apps/api-admin
pnpm dlx @biomejs/biome check --write \
  src/db/schema/admin-roles.ts \
  src/db/schema/admin-users.ts \
  src/db/seed/admin-roles.seed.ts \
  src/schemas/admin-users/update-admin-user-role.schema.ts \
  src/schemas/admin-users/update-admin-user-permissions.schema.ts \
  src/http/routes/admin-roles/get-admin-roles.ts \
  src/http/routes/admin-users/get-admin-users.ts \
  src/http/routes/admin-users/update-admin-user-role.ts \
  src/http/routes/admin-users/update-admin-user-permissions.ts \
  src/http/routes/index.ts
```

Fix any reported errors.

- [ ] **Step 4: Type-check the admin app**

```bash
cd ../..
pnpm turbo run check-types --filter=@orchestra/admin
```

Expected: no TypeScript errors. Fix any errors before proceeding.

- [ ] **Step 5: Type-check the api-admin**

```bash
pnpm turbo run check-types --filter=@orchestra/api-admin
```

Expected: no TypeScript errors.

- [ ] **Step 6: Commit all Biome/type fixes**

```bash
git add -A
git commit -m "chore: apply biome fixes and resolve type errors across administrators feature"
```

---

## Task 19: Manual smoke test

- [ ] **Step 1: Start both servers**

In one terminal:
```bash
cd apps/api-admin && pnpm dev
```

In another terminal:
```bash
cd apps/admin && pnpm dev
```

- [ ] **Step 2: Verify the sidebar**

Open `http://localhost:5173` and sign in. Confirm:
- "Administradores" appears in the sidebar as a collapsible item (no direct URL, has chevron).
- Clicking it expands to show "Plataforma" sub-item.
- Clicking "Plataforma" navigates to `/panel/administrators/platform`.

- [ ] **Step 3: Verify the table**

On the Plataforma page, confirm the table renders with columns: Nome, E-mail, Matrícula, Cargo, Status, Criado em.

- [ ] **Step 4: Verify the edit sheet**

Click the kebab menu on any row → "Editar permissões". Confirm:
- The sheet slides in from the right.
- The role dropdown is populated with the 9 seeded roles.
- Selecting a different role updates the permission matrix toggles.
- Toggling a permission marks it with the blue dot (override indicator).
- Clicking "Salvar" calls the mutations and closes the sheet.
- Clicking "Limpar substituições" clears overrides and closes the sheet.

- [ ] **Step 5: Final commit if any last-minute fixes were made**

```bash
git add -A
git commit -m "fix: smoke test corrections for administrators platform page"
```
