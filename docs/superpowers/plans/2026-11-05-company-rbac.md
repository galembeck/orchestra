# Company RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Orchestra companies, per-company membership roles (ADMIN/BILLING/MEMBER), CASL-based permission checks on every mutating API route, email invites, a shared 32-trade job-role catalog, and the minimal dashboard UI to drive all of it.

**Architecture:** A new framework-agnostic `packages/rbac` package (ported from `galembeck/saas-rbac`) defines CASL abilities per role. `apps/api` gains a session-resolution plugin (better-auth has none today), a small error-handling convention, and one Fastify module per resource (companies, members, invites, job-roles), each checking `cannot(action, subject)` before mutating. `apps/web` gains a `(dashboard)` route group and extends `ProfileDropdown` to surface it.

**Tech Stack:** Fastify, Prisma (`packages/database`), `@casl/ability`, Zod, better-auth, Next.js App Router, next-intl, Vitest + `@electric-sql/pglite` (embedded Postgres for API integration tests).

**Spec:** `docs/superpowers/specs/2026-11-05-company-rbac-design.md`

## Global Constraints

- One user has at most one company membership, ever (`Member.userId` is `@unique`).
- Prisma convention: PascalCase models, camelCase fields, `@map("snake_case")` per field, `@@map("snake_case_plural")` per table (match existing `User`/`Session` models).
- No Fastify zod type provider in `apps/api`; validate request bodies manually with `zod.safeParse`, matching `modules/auth/auth-validation.ts`.
- Every new file must pass `pnpm exec ultracite check` (Biome/Ultracite) with zero errors, and each touched package's `check-types` script must pass.
- `packages/rbac` has no dependency on better-auth or Fastify — pure domain logic, importable from both `apps/api` and `apps/web`.
- Job-role catalog is shared/platform-wide; companies select from it, never create new entries (enforced by only ever reading `JobRole`, never writing to it, from company-facing routes).
- Invite accept requires `session.user.email` to case-insensitively equal `Invite.email`.
- Expired (`expiresAt < now`), still-`PENDING` invites are rejected at accept time and silently overwritten (new token/`expiresAt`) at re-invite time instead of conflicting.
- **Do not run `git commit` for any step in this plan while implementing — the user asked for no commits during development.** Every "Commit" step below is replaced by "stage the changes locally and move on" per that instruction; leave everything uncommitted until the user asks otherwise.
- No new frontend test files — this repo has no component-test convention in `apps/web`/`packages/ui` (confirmed: no `.test.tsx` anywhere, no `test` script in either package.json). Frontend tasks verify via `check-types`, `ultracite check`, and a manual dev-server pass instead.

## Review Focus

- **A company admin removes the member who holds a job-role nobody else has** — no safeguard is specced; removing a member must cascade-delete their `MemberJobRole` rows without erroring (covered in Task 11's delete test).
- **Two invites racing for the same email+company** (e.g. double-submit) — the `@@unique([email, companyId])` constraint must surface as a clean 409, not an unhandled Prisma error (covered in Task 13).
- **A non-member (no `Member` row at all) hits any slug-scoped company route** — must 403/404 via the session plugin before reaching the handler, not leak a different company's data (covered in Task 8).
- **An admin tries to assign a member a job role the company hasn't selected via `CompanyJobRole`** — must 400, not silently succeed (covered in Task 11).
- **The owner is the target of `DELETE /companies/:slug/members/:memberId` or a role-downgrade** — must be rejected; the owner can only stop owning via `transfer-ownership` (covered in Task 11 and Task 9).

---

## File Structure

```
packages/shared/src/constants/categories.ts         (modify — ALL_CATEGORIES, 32 entries)
packages/shared/src/constants/categories.test.ts     (new)
apps/web/components/categories/category-icons.ts     (modify — 24 new icon mappings)
apps/web/messages/{en,pt-BR}.json                     (modify — new categories + dashboard strings)

packages/rbac/package.json, tsconfig.json             (new)
packages/rbac/src/types/role.ts                       (new)
packages/rbac/src/models/{company,member,invite}.model.ts (new)
packages/rbac/src/subjects/{company,member,invite,billing}.subject.ts (new)
packages/rbac/src/permissions.ts                      (new)
packages/rbac/src/index.ts                            (new)
packages/rbac/src/utils/get-user-permissions.ts       (new)
packages/rbac/src/permissions.test.ts                 (new)

packages/database/prisma/schema.prisma                (modify — new enums/models)
packages/database/prisma/seed.ts                      (new — seeds JobRole from ALL_CATEGORIES)
packages/database/package.json                        (modify — db:seed script)

apps/api/src/modules/errors/app-error.ts               (new)
apps/api/src/app.ts                                    (modify — error handler, new route registrations)
apps/api/src/modules/session/session-plugin.ts         (new)
apps/api/src/modules/session/session-plugin.test.ts    (new)
apps/api/src/modules/auth/auth.ts                      (modify — customSession plugin)
apps/api/test/helpers/test-app.ts                      (modify — new tables, fixture helpers)
apps/api/test/auth.test.ts                             (modify — assert session.user.company shape)

apps/api/src/modules/companies/companies-routes.ts     (new)
apps/api/test/companies.test.ts                        (new)
apps/api/src/modules/members/members-routes.ts         (new)
apps/api/test/members.test.ts                          (new)
apps/api/src/modules/invites/invites-routes.ts         (new)
apps/api/test/invites.test.ts                          (new)
apps/api/src/modules/job-roles/job-roles-routes.ts     (new)
apps/api/test/job-roles.test.ts                        (new)

apps/web/lib/auth-client.ts                            (modify — company-aware session type re-export if needed)
packages/ui/src/components/profile-dropdown/profile-dropdown.tsx (modify — Dashboard item)
apps/web/components/site-header/site-header.tsx        (modify — pass company/dashboard href)

apps/web/components/company-register-form/company-register-form.tsx (new)
apps/web/app/[locale]/company/register/page.tsx        (new)

apps/web/app/[locale]/(dashboard)/layout.tsx            (new)
apps/web/app/[locale]/(dashboard)/company/[slug]/page.tsx (new — overview/settings)
apps/web/components/company-settings-form/company-settings-form.tsx (new)
apps/web/components/transfer-ownership-dialog/transfer-ownership-dialog.tsx (new)

apps/web/app/[locale]/(dashboard)/company/[slug]/members/page.tsx (new)
apps/web/components/member-list/member-list.tsx         (new)
apps/web/components/invite-member-form/invite-member-form.tsx (new)
apps/web/components/member-job-roles-picker/member-job-roles-picker.tsx (new)

apps/web/app/[locale]/(dashboard)/company/[slug]/job-roles/page.tsx (new)
apps/web/components/company-job-roles-form/company-job-roles-form.tsx (new)
```

---

## Task 1: Job-role catalog data (32 categories)

**Files:**
- Modify: `packages/shared/src/constants/categories.ts`
- Modify: `apps/web/components/categories/category-icons.ts`
- Create: `packages/shared/src/constants/categories.test.ts`

**Interfaces:**
- Produces: `ALL_CATEGORIES: readonly { key: string; slug: string; businessCount: number }[]` (32 entries — the existing 8 plus the 24 from the spec's table), `CategoryKey` now `(typeof ALL_CATEGORIES)[number]["key"]`. `FEATURED_CATEGORIES` keeps its current 8 entries, now typed as a subset of `ALL_CATEGORIES`.

- [ ] **Step 1: Write the failing test**

```ts
// packages/shared/src/constants/categories.test.ts
import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, FEATURED_CATEGORIES } from "./categories";

describe("ALL_CATEGORIES", () => {
  it("has exactly 32 unique categories", () => {
    expect(ALL_CATEGORIES).toHaveLength(32);
    expect(new Set(ALL_CATEGORIES.map((c) => c.key)).size).toBe(32);
    expect(new Set(ALL_CATEGORIES.map((c) => c.slug)).size).toBe(32);
  });

  it("includes every featured category", () => {
    const allKeys = new Set(ALL_CATEGORIES.map((c) => c.key));
    for (const featured of FEATURED_CATEGORIES) {
      expect(allKeys.has(featured.key)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @orchestra/shared test`
Expected: FAIL — `ALL_CATEGORIES` is not exported.

- [ ] **Step 3: Add `ALL_CATEGORIES` to `categories.ts`**

Keep `FEATURED_CATEGORIES` exactly as-is. Add `ALL_CATEGORIES` as a new `as const satisfies` array containing the same 8 entries plus the 24 from the spec's table (key/slug exactly as listed there; `businessCount` any placeholder int consistent with the existing ones, e.g. 60–220). Change `export type CategoryKey = (typeof ALL_CATEGORIES)[number]["key"]`.

- [ ] **Step 4: Add the 24 new icon mappings to `category-icons.ts`**

Add each new `key` → icon from the spec's table to `CATEGORY_ICONS` (e.g. `locksmith: KeyRoundIcon`). Import the new icons from `lucide-react`. `CATEGORY_ICONS` is typed `Record<CategoryKey, LucideIcon>`, so a missing key is a type error — use that to confirm completeness instead of a runtime test.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @orchestra/shared test`
Expected: PASS

- [ ] **Step 6: Type-check and lint**

Run: `pnpm --filter @orchestra/shared check-types && pnpm --filter web check-types && pnpm exec ultracite check packages/shared/src/constants/categories.ts packages/shared/src/constants/categories.test.ts apps/web/components/categories/category-icons.ts`
Expected: no errors.

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 2: Prisma schema — companies, members, invites, job roles

**Files:**
- Modify: `packages/database/prisma/schema.prisma`
- Create: `packages/database/prisma/seed.ts`
- Modify: `packages/database/package.json`

**Interfaces:**
- Consumes: `ALL_CATEGORIES` from Task 1 (`@orchestra/shared/constants/categories`).
- Produces: Prisma models `Company`, `Member`, `Invite`, `JobRole`, `CompanyJobRole`, `MemberJobRole`, enums `CompanyRole` (`ADMIN` | `BILLING` | `MEMBER`) and `InviteStatus` (`PENDING` | `ACCEPTED` | `REVOKED`), exactly as specced in the design doc's "Data model" section (copy that Prisma block verbatim, adding `owns_companies Company[]`, `member Member?`, and `authoredInvites Invite[]` to the existing `User` model's relations).

- [ ] **Step 1: Add the schema from the spec**

Copy the `CompanyRole`, `InviteStatus`, `Company`, `Member`, `Invite`, `JobRole`, `CompanyJobRole`, `MemberJobRole` block from the design doc's "Data model" section into `packages/database/prisma/schema.prisma`, and add the inverse relations to `model User`.

- [ ] **Step 2: Generate the migration**

Run: `pnpm --filter @orchestra/database db:migrate -- --name company_rbac`
Expected: a new directory under `packages/database/prisma/migrations/` with a `migration.sql` creating the new tables/enums; `pnpm --filter @orchestra/database db:generate` regenerates the Prisma client with no errors.

- [ ] **Step 3: Write the seed script**

```ts
// packages/database/prisma/seed.ts
import { ALL_CATEGORIES } from "@orchestra/shared/constants/categories";
import { prisma } from "../src/index.js";

async function main() {
  for (const category of ALL_CATEGORIES) {
    await prisma.jobRole.upsert({
      create: { key: category.key, slug: category.slug },
      update: {},
      where: { key: category.key },
    });
  }
}

main().finally(() => prisma.$disconnect());
```

- [ ] **Step 4: Wire the seed script**

Add `"db:seed": "tsx prisma/seed.ts"` to `packages/database/package.json` scripts (add `tsx` as a devDependency if not already present at the workspace root — check first with `grep tsx pnpm-lock.yaml`; it's already a devDependency of `apps/api`, so add it to `packages/database` too).

- [ ] **Step 5: Run the seed against the dev database and verify**

Run: `pnpm db:up && pnpm --filter @orchestra/database db:migrate && pnpm --filter @orchestra/database db:seed`
Then: `pnpm --filter @orchestra/database exec prisma studio` (or a one-off `node -e` script using `prisma.jobRole.count()`) to confirm 32 rows exist.
Expected: 32 `JobRole` rows, keys matching `ALL_CATEGORIES`.

- [ ] **Step 6: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 3: `packages/rbac` package

**Files:**
- Create: `packages/rbac/package.json`, `packages/rbac/tsconfig.json`
- Create: `packages/rbac/src/types/role.ts`
- Create: `packages/rbac/src/models/company.model.ts`, `member.model.ts`, `invite.model.ts`
- Create: `packages/rbac/src/subjects/company.subject.ts`, `member.subject.ts`, `invite.subject.ts`, `billing.subject.ts`
- Create: `packages/rbac/src/permissions.ts`
- Create: `packages/rbac/src/index.ts`
- Create: `packages/rbac/src/utils/get-user-permissions.ts`
- Test: `packages/rbac/src/permissions.test.ts`

**Interfaces:**
- Produces:
  - `type CompanyRole = "ADMIN" | "BILLING" | "MEMBER"` (`roleSchema` zod union).
  - `type User = { id: string; role: CompanyRole }` (`userSchema`).
  - `type Company = { __typename: "Company"; id: string; ownerId: string }`.
  - `type AppAbility = MongoAbility<AppAbilities>`.
  - `defineAbilityFor(user: User): AppAbility`.
  - `getUserPermissions(userId: string, role: CompanyRole): AppAbility`.
  - Subject actions: Company — `manage | create | update | delete | transfer_ownership | get`; Member — `manage | get | update | delete`; Invite — `manage | get | create | delete`; Billing — `manage | get | export` (literal subject `"Billing"`, no model).

- [ ] **Step 1: Scaffold the package**

`package.json` (name `@orchestra/rbac`, `exports`: `"."` → `./src/index.ts` style matching `packages/shared`'s pattern, dependency on `@casl/ability` and `zod`, devDependency on `@orchestra/typescript-config` + `vitest`). `tsconfig.json` extends `@orchestra/typescript-config` like `packages/shared/tsconfig.json`. Add `"test": "vitest run"` and `"check-types": "tsc --noEmit"` scripts.

- [ ] **Step 2: Port `types/role.ts` and the three models**

Copy the reference repo's `role.ts`, `organization.model.ts`→`company.model.ts`, `user.model.ts` structure exactly (shown in the design doc), renaming `Organization`→`Company` and its `ownerId` field stays `ownerId`. `member.model.ts` and `invite.model.ts` are new (no reference equivalent): `memberSchema = z.object({ __typename: z.literal("Member").default("Member"), id: z.string(), companyId: z.string() })`; `inviteSchema` mirrors it with `companyId`.

- [ ] **Step 3: Port the four subjects**

Copy `organization.subject.ts` → `company.subject.ts` (same actions, `Company`/`companySchema`), `billing.subject.ts` verbatim, and author `member.subject.ts`/`invite.subject.ts` following the exact same tuple-of-zod-unions shape, using the actions listed in Interfaces above.

- [ ] **Step 4: Write the failing permission tests**

```ts
// packages/rbac/src/permissions.test.ts
import { describe, expect, it } from "vitest";
import { getUserPermissions } from "./utils/get-user-permissions";

describe("ADMIN", () => {
  it("can manage everything by default", () => {
    const { can } = getUserPermissions("user-1", "ADMIN");
    expect(can("manage", "Member")).toBe(true);
  });

  it("cannot update or transfer a company it doesn't own", () => {
    const { cannot } = getUserPermissions("user-1", "ADMIN");
    const company = { __typename: "Company" as const, id: "c1", ownerId: "owner-2" };
    expect(cannot("update", company)).toBe(true);
    expect(cannot("transfer_ownership", company)).toBe(true);
  });

  it("can update and transfer a company it owns", () => {
    const { can } = getUserPermissions("user-1", "ADMIN");
    const company = { __typename: "Company" as const, id: "c1", ownerId: "user-1" };
    expect(can("update", company)).toBe(true);
    expect(can("transfer_ownership", company)).toBe(true);
  });
});

describe("BILLING", () => {
  it("can manage Billing and read Company, nothing else", () => {
    const { can, cannot } = getUserPermissions("user-1", "BILLING");
    expect(can("manage", "Billing")).toBe(true);
    expect(can("get", "Company")).toBe(true);
    expect(cannot("get", "Member")).toBe(true);
    expect(cannot("manage", "Member")).toBe(true);
  });
});

describe("MEMBER", () => {
  it("can only read Company and Member", () => {
    const { can, cannot } = getUserPermissions("user-1", "MEMBER");
    expect(can("get", "Company")).toBe(true);
    expect(can("get", "Member")).toBe(true);
    expect(cannot("update", "Member")).toBe(true);
    expect(cannot("manage", "Billing")).toBe(true);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `pnpm --filter @orchestra/rbac test`
Expected: FAIL — `permissions.ts`/`index.ts`/`get-user-permissions.ts` don't exist yet.

- [ ] **Step 6: Implement `permissions.ts` and `index.ts`**

Port the reference's `index.ts` (`defineAbilityFor`, `createAppAbility`) verbatim, swapping `Organization`→`Company`. In `permissions.ts`, implement the three role functions per the design doc's "Permission package" section (ADMIN: `can("manage","all")` + the owner-scoped `update`/`transfer_ownership` carve-out; BILLING: `can("manage","Billing")` + `can("get","Company")`; MEMBER: `can("get", ["Company","Member"])`).

- [ ] **Step 7: Implement `utils/get-user-permissions.ts`**

Port verbatim from the reference (shown in the design doc), importing `roleSchema`/`userSchema` from this package's own `types`/`models`.

- [ ] **Step 8: Run test to verify it passes**

Run: `pnpm --filter @orchestra/rbac test`
Expected: PASS

- [ ] **Step 9: Type-check and lint**

Run: `pnpm --filter @orchestra/rbac check-types && pnpm exec ultracite check packages/rbac/src`
Expected: no errors.

- [ ] **Step 10: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 4: API error-handling convention

**Files:**
- Create: `apps/api/src/modules/errors/app-error.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces: `class AppError extends Error { status: number; code: string }`, `class NotFoundError extends AppError` (404), `class ForbiddenError extends AppError` (403), `class BadRequestError extends AppError` (400), `class ConflictError extends AppError` (409). Each constructor: `(message: string, code: string)`.
- Produces: `app.setErrorHandler((error, _request, reply) => ...)` registered in `buildApp`, mapping an `AppError` to `{ status: error.status }` + JSON body `{ message: error.message, code: error.code }`, and any other thrown error to a generic 500 `{ message: "Internal server error", code: "INTERNAL_ERROR" }` (logged via `app.log.error`).

- [ ] **Step 1: Implement `app-error.ts`**

```ts
export class AppError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string, code: string) { super(message, code, 404); }
}
export class ForbiddenError extends AppError {
  constructor(message: string, code: string) { super(message, code, 403); }
}
export class BadRequestError extends AppError {
  constructor(message: string, code: string) { super(message, code, 400); }
}
export class ConflictError extends AppError {
  constructor(message: string, code: string) { super(message, code, 409); }
}
```

- [ ] **Step 2: Wire `setErrorHandler` in `app.ts`**

In `buildApp`, after creating `app`, add:

```ts
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.status).send({ code: error.code, message: error.message });
  }
  app.log.error({ err: error }, "unhandled error");
  return reply.status(500).send({ code: "INTERNAL_ERROR", message: "Internal server error" });
});
```

- [ ] **Step 3: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/errors/app-error.ts apps/api/src/app.ts`
Expected: no errors. (No dedicated test file — this is exercised end-to-end by every route test in Tasks 8–12, which assert specific status codes and `code` bodies.)

- [ ] **Step 4: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 5: Test fixture helpers for companies/members

**Files:**
- Modify: `apps/api/test/helpers/test-app.ts`

**Interfaces:**
- Produces: `createMemberFixture(testApp: TestApp, options: { role: CompanyRole; companySlug?: string; companyName?: string }): Promise<{ userId: string; cookie: string; companyId: string; companySlug: string }>` — signs a fresh test user up and verifies them (reusing `signUp`/`verifyLatestEmail` patterns already in `auth.test.ts`, so extract those two into this file if not already exported — check first; if they're private to `auth.test.ts`, duplicate the minimal sign-up+verify+sign-in flow here rather than restructuring `auth.test.ts`), then directly inserts a `Company` + `Member(role)` row via `testApp.database` (bypassing the API, since this is a test fixture, not a code path under test), and returns the session cookie header string plus the created IDs.

- [ ] **Step 1: Implement `createMemberFixture`**

No test-for-the-test-helper step — this is infrastructure consumed by Tasks 6, 9–12's own tests, which are the verification. Write it following the existing `postAuth`/`createTestApp` style in the same file (plain exported `async` function, no class).

- [ ] **Step 2: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/test/helpers/test-app.ts`

- [ ] **Step 3: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 6: Session-resolution plugin

**Files:**
- Create: `apps/api/src/modules/session/session-plugin.ts`
- Test: `apps/api/src/modules/session/session-plugin.test.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Consumes: `AppError` subclasses from Task 4; `Auth` type from `modules/auth/auth.ts`; `DatabaseClient` from `@orchestra/database/factory`; `createMemberFixture` from Task 5.
- Produces: a Fastify plugin `sessionPlugin(app, { auth, database })` that decorates every request with:
  - `request.requireUser(): Promise<{ id: string; email: string }>` — calls `auth.api.getSession({ headers: fromNodeHeaders(request.headers) })`; throws `new UnauthorizedError("Authentication required.", "UNAUTHENTICATED")` (a dedicated 401 class — add it to Task 4's file: `export class UnauthorizedError extends AppError { constructor(message: string, code: string) { super(message, code, 401); } }`).
  - `request.requireMembership(slug: string): Promise<{ member: Member; company: Company }>` — calls `requireUser()`, then `database.member.findFirst({ where: { userId, company: { slug } }, include: { company: true } })`; throws `NotFoundError("Company not found.", "COMPANY_NOT_FOUND")` if no match.

- [ ] **Step 1: Write the failing test**

```ts
// apps/api/src/modules/session/session-plugin.test.ts
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { createTestApp, resetDatabase, createMemberFixture } from "../../../test/helpers/test-app.js";

describe("requireMembership", () => {
  beforeEach(resetDatabase);

  it("401s when there is no session", async () => {
    const testApp = await createTestApp();
    const response = await testApp.app.inject({ method: "GET", url: "/companies/acme" });
    expect(response.statusCode).toBe(401);
    await testApp.app.close();
  });

  it("404s when the user has no membership in the given company", async () => {
    const testApp = await createTestApp();
    const { cookie } = await createMemberFixture(testApp, { role: "ADMIN", companySlug: "other-co" });
    const response = await testApp.app.inject({
      method: "GET",
      url: "/companies/acme",
      headers: { cookie },
    });
    expect(response.statusCode).toBe(404);
    await testApp.app.close();
  });
});
```

This test exercises `requireMembership` indirectly through the `GET /companies/:slug` route built in Task 8 — write it now, expect it to fail for the right reason (route doesn't exist), and leave it; Task 8 makes it pass. Add a throwaway inline route registration here instead if you'd rather not depend on Task 8 — your call, but keep the assertions above.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter api test session-plugin`
Expected: FAIL (404 route not found, or import error) — confirms nothing is wired yet.

- [ ] **Step 3: Implement `session-plugin.ts`**

Use `fastify-plugin` (already a dependency, see `modules/auth/auth-routes.ts` pattern) and `fromNodeHeaders` from `better-auth/node` (already used in `auth-routes.ts`) to build the web `Headers` for `auth.api.getSession`. Decorate via `app.decorateRequest("requireUser", ...)` is not viable for closures needing `auth`/`database` per-request — instead follow the existing `auth.ts` middleware pattern from the reference (an `addHook("preHandler", ...)` that assigns `request.requireUser = async () => {...}` and `request.requireMembership = async (slug) => {...}` as closures capturing `auth`/`database`). Declare the two methods via TypeScript module augmentation (`declare module "fastify" { interface FastifyRequest { requireUser(): ...; requireMembership(slug: string): ...; } }`) in the same file.

- [ ] **Step 4: Register the plugin in `app.ts`**

`await app.register(sessionPlugin, { auth, database });` after the `auth` instance is created and before any route registrations that need it.

- [ ] **Step 5: Run test to verify it passes (after Task 8 lands) or confirms the right failure now**

Run: `pnpm --filter api test session-plugin`
Expected: once Task 8's `GET /companies/:slug` route exists, PASS. (It's fine for this task's own run to still show a 404-route failure — note it and move on; Task 8 closes the loop. If you'd rather not leave a red test between tasks, add the minimal inline test route now and swap to the real one in Task 8.)

- [ ] **Step 6: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/session/session-plugin.ts apps/api/src/app.ts`

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 7: Session enrichment (`session.user.company`)

**Files:**
- Modify: `apps/api/src/modules/auth/auth.ts`
- Modify: `apps/api/test/auth.test.ts`
- Modify: `apps/api/test/helpers/test-app.ts` (add the new tables to `TEST_TABLES`)

**Interfaces:**
- Produces: every `GET /api/auth/get-session` response's `user` object gains `company: { slug: string; role: CompanyRole } | null`.
- Modifies `TEST_TABLES` to include `"companies", "members", "invites", "job_roles", "company_job_roles", "member_job_roles"` (order matters for `TRUNCATE ... CASCADE` only insofar as CASCADE handles it — keep the existing list's ordering convention, append the new ones).

- [ ] **Step 1: Write the failing test**

Add to the existing "verifies the email, signs the user in and keeps the session" test in `apps/api/test/auth.test.ts` (or a new adjacent `it`):

```ts
it("includes a null company on the session for a user with no membership", async () => {
  await verifyLatestEmail(testApp);
  const signInResponse = await signIn(testApp);
  const sessionCookies = readCookies(signInResponse.headers["set-cookie"]);
  const session = await testApp.app.inject({
    headers: { cookie: toCookieHeader(sessionCookies) },
    method: "GET",
    url: "/api/auth/get-session",
  });
  expect(session.json()).toMatchObject({ user: { company: null } });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter api test auth.test`
Expected: FAIL — `company` is `undefined`, not `null`.

- [ ] **Step 3: Add the `customSession` plugin to `createAuth`**

Import `customSession` from `better-auth/plugins`. Add a top-level `plugins: [customSession(async ({ user, session }) => { const member = await database.member.findUnique({ where: { userId: user.id }, include: { company: true } }); return { session, user: { ...user, company: member ? { slug: member.company.slug, role: member.role } : null } }; })]` to the `betterAuth({...})` config object in `auth.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter api test auth.test`
Expected: PASS

- [ ] **Step 5: Update `TEST_TABLES`**

Append the six new table names to the `TEST_TABLES` array in `apps/api/test/helpers/test-app.ts`.

- [ ] **Step 6: Run the full API test suite**

Run: `pnpm --filter api test`
Expected: all existing tests still PASS (confirms the new `customSession` plugin didn't break the existing session shape assertions).

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 8: Companies routes

**Files:**
- Create: `apps/api/src/modules/companies/companies-routes.ts`
- Test: `apps/api/test/companies.test.ts`
- Modify: `apps/api/src/app.ts` (register the module)

**Interfaces:**
- Consumes: `sessionPlugin`'s `request.requireUser()`/`request.requireMembership(slug)` (Task 6); `getUserPermissions` from `@orchestra/rbac` (Task 3); `AppError` family (Task 4); `createMemberFixture` (Task 5).
- Produces a Fastify plugin `companiesRoutes(app, { database })` registering:
  - `POST /companies` — body `{ name: string }`. 400 if caller already has a `Member` row. Transaction: create `Company` (slug slugified from `name`, suffixed with a short random string on collision) + `Member(role: "ADMIN", userId)`. Returns 201 `{ slug, name }`.
  - `GET /companies/:slug` — requires membership; returns `{ slug, name, ownerId }`.
  - `PATCH /companies/:slug` — body `{ name: string }`. Requires membership; 403 via `cannot("update", companySubject)` unless caller is the owner.
  - `POST /companies/:slug/transfer-ownership` — body `{ newOwnerMemberId: string }`. 403 unless caller is the owner (`cannot("transfer_ownership", ...)`). 400 if the target `Member` doesn't belong to this company. Transaction: set `Company.ownerId` to the target's `userId`, set target's `Member.role` to `"ADMIN"`, demote the caller's `Member.role` to `"ADMIN"` (no-op if already).

- [ ] **Step 1: Write the failing tests**

```ts
// apps/api/test/companies.test.ts
describe("POST /companies", () => {
  it("creates a company and makes the caller its ADMIN owner", async () => { /* assert 201, Member row created with role ADMIN */ });
  it("409s if the caller already belongs to a company", async () => { /* assert 409 */ });
});

describe("GET /companies/:slug", () => {
  it("404s for a non-member", async () => { /* via createMemberFixture for a DIFFERENT company */ });
  it("200s with the company for a member", async () => {});
});

describe("PATCH /companies/:slug", () => {
  it("403s when a non-owner ADMIN tries to rename", async () => { /* two fixtures: owner + second ADMIN member in same company, not owner */ });
  it("200s when the owner renames", async () => {});
});

describe("POST /companies/:slug/transfer-ownership", () => {
  it("403s for a non-owner", async () => {});
  it("transfers ownership and swaps roles", async () => { /* assert new owner is ADMIN, old owner is still ADMIN, Company.ownerId changed */ });
});
```

(Fill in bodies using `createMemberFixture` + `testApp.app.inject`, following `auth.test.ts`'s style.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter api test companies`
Expected: FAIL — routes don't exist (connection refused / 404).

- [ ] **Step 3: Implement `companies-routes.ts`**

One Fastify plugin function exporting all four routes, each: `await request.requireUser()` (or `requireMembership` where applicable) → validate body with a local Zod schema → build ability via `getUserPermissions(userId, member.role)` → `if (cannot(...)) throw new UnauthorizedError(...)` → Prisma call → reply.

- [ ] **Step 4: Register in `app.ts`**

`await app.register(companiesRoutes, { database });`

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter api test companies`
Expected: PASS

- [ ] **Step 6: Run Task 6's session-plugin test**

Run: `pnpm --filter api test session-plugin`
Expected: now PASS (it depends on `GET /companies/:slug` existing).

- [ ] **Step 7: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/companies apps/api/test/companies.test.ts apps/api/src/app.ts`

- [ ] **Step 8: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 9: Company job-roles routes

**Files:**
- Modify: `apps/api/src/modules/companies/companies-routes.ts` (add two routes to the same plugin)
- Modify: `apps/api/test/companies.test.ts`

**Interfaces:**
- Produces:
  - `GET /companies/:slug/job-roles` — requires membership; returns `{ jobRoles: { id, key, slug }[] }` (the company's selected set, via `CompanyJobRole`).
  - `PUT /companies/:slug/job-roles` — body `{ jobRoleIds: string[] }`. ADMIN only (`can("manage", "Company")` check, or a dedicated check — reuse the same `cannot("update", companySubject)` gate as `PATCH /companies/:slug` for simplicity, since job-role selection is a company-settings action). Replaces the `CompanyJobRole` set in a transaction (delete all for the company, create the new set) — 400 if any `jobRoleId` doesn't exist in `JobRole`.

- [ ] **Step 1: Write the failing tests**

```ts
describe("PUT /companies/:slug/job-roles", () => {
  it("403s for a non-owner ADMIN", async () => {});
  it("replaces the company's selected job roles", async () => { /* seed 2 JobRole rows via testApp.database.jobRole.create, PUT with both ids, GET back and assert both present */ });
  it("400s for an unknown jobRoleId", async () => {});
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter api test companies`

- [ ] **Step 3: Implement both routes in `companies-routes.ts`**

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter api test companies`

- [ ] **Step 5: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/companies apps/api/test/companies.test.ts`

- [ ] **Step 6: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 10: Job-roles catalog route

**Files:**
- Create: `apps/api/src/modules/job-roles/job-roles-routes.ts`
- Test: `apps/api/test/job-roles.test.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces: `GET /job-roles` — requires only `request.requireUser()` (any authenticated user, no membership needed); returns `{ jobRoles: { id, key, slug }[] }` — the full catalog (`database.jobRole.findMany()`).

- [ ] **Step 1: Write the failing test**

```ts
it("401s without a session", async () => {});
it("returns the full seeded catalog", async () => { /* seed N JobRole rows directly, assert they all come back */ });
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter api test job-roles`

- [ ] **Step 3: Implement `job-roles-routes.ts`**

- [ ] **Step 4: Register in `app.ts`**

- [ ] **Step 5: Run to verify pass**

Run: `pnpm --filter api test job-roles`

- [ ] **Step 6: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/job-roles apps/api/test/job-roles.test.ts apps/api/src/app.ts`

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 11: Members routes

**Files:**
- Create: `apps/api/src/modules/members/members-routes.ts`
- Test: `apps/api/test/members.test.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces:
  - `GET /companies/:slug/members` — requires membership; returns `{ members: { id, userId, name, email, role, jobRoles: {id,key,slug}[] }[] }`.
  - `PATCH /companies/:slug/members/:memberId` — body `{ role: CompanyRole }`. ADMIN only. 400 if `memberId` is the owner's membership (owner's role only changes via transfer-ownership).
  - `PUT /companies/:slug/members/:memberId/job-roles` — body `{ jobRoleIds: string[] }`. ADMIN only. 400 if any `jobRoleId` isn't in the company's `CompanyJobRole` selection (query it first; reject if the requested set isn't a subset).
  - `DELETE /companies/:slug/members/:memberId` — ADMIN only. 400 if target is the owner. Cascades to `MemberJobRole` via the schema's `onDelete: Cascade`.

- [ ] **Step 1: Write the failing tests**

```ts
describe("GET .../members", () => { it("lists members with their job roles", async () => {}); });
describe("PATCH .../members/:id", () => {
  it("403s for a non-admin", async () => {});
  it("changes a member's role", async () => {});
  it("400s when targeting the owner", async () => {});
});
describe("PUT .../members/:id/job-roles", () => {
  it("400s for a jobRoleId outside the company's selection", async () => {});
  it("assigns job roles that are in the company's selection", async () => {});
});
describe("DELETE .../members/:id", () => {
  it("400s when targeting the owner", async () => {});
  it("removes a non-owner member and their job-role assignments", async () => {});
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter api test members`

- [ ] **Step 3: Implement `members-routes.ts`**

- [ ] **Step 4: Register in `app.ts`**

- [ ] **Step 5: Run to verify pass**

Run: `pnpm --filter api test members`

- [ ] **Step 6: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/members apps/api/test/members.test.ts apps/api/src/app.ts`

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 12: Invites routes

**Files:**
- Create: `apps/api/src/modules/invites/invites-routes.ts`
- Test: `apps/api/test/invites.test.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Consumes: `Mailer` from `modules/mail/mailer.ts`; `resolveLocale`/`localizePath` from `modules/mail/resolve-locale.ts` (same pattern as `auth.ts`'s verification email).
- Produces:
  - `POST /companies/:slug/invites` — body `{ email: string; role: CompanyRole }`. ADMIN only. Token: `randomBytes(24).toString("base64url")` (`node:crypto`). `expiresAt`: now + 7 days. If an existing `PENDING` invite for `email`+`companyId` has `expiresAt < now`, update it in place (new token/expiresAt/role); if it's still live, 409; otherwise create. Sends an email via `mailer.send` with an accept link `${webUrl}/invites/:token/accept` (reuse `config.webUrl`, passed into this module like `auth.ts` receives `config`). 201 `{ id }`.
  - `GET /companies/:slug/invites` — ADMIN only; lists `PENDING` invites (lazily excluding expired ones: `where: { status: "PENDING", expiresAt: { gt: new Date() } }`).
  - `DELETE /companies/:slug/invites/:inviteId` — ADMIN only; sets `status: "REVOKED"`.
  - `POST /invites/:token/accept` — `request.requireUser()` only (no membership). 404 if token doesn't match a `PENDING` invite. 400 if `expiresAt < now`, if caller's email doesn't case-insensitively match `Invite.email`, or if caller already has a `Member` row. Transaction: create `Member(role: invite.role)`, set invite `status: "ACCEPTED"`.

- [ ] **Step 1: Write the failing tests**

```ts
describe("POST .../invites", () => {
  it("403s for a non-admin", async () => {});
  it("creates an invite and sends an email", async () => { /* assert testApp.mailer.sent has the accept link */ });
  it("409s for a still-pending duplicate", async () => {});
  it("overwrites an expired pending invite instead of conflicting", async () => { /* insert an expired PENDING row directly via testApp.database, re-POST, assert 201 and new token */ });
});
describe("POST /invites/:token/accept", () => {
  it("400s if the invite is expired", async () => {});
  it("400s if the signed-in email doesn't match the invite's email", async () => {});
  it("400s if the caller already belongs to a company", async () => {});
  it("creates a Member with the invited role and marks the invite ACCEPTED", async () => {});
});
describe("DELETE .../invites/:id", () => { it("revokes an invite", async () => {}); });
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter api test invites`

- [ ] **Step 3: Implement `invites-routes.ts`**

- [ ] **Step 4: Register in `app.ts`** (pass `mailer` and `config` into the plugin options)

- [ ] **Step 5: Run to verify pass**

Run: `pnpm --filter api test invites`

- [ ] **Step 6: Type-check and lint**

Run: `pnpm --filter api check-types && pnpm exec ultracite check apps/api/src/modules/invites apps/api/test/invites.test.ts apps/api/src/app.ts`

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 13: `ProfileDropdown` — Dashboard link

**Files:**
- Modify: `packages/ui/src/components/profile-dropdown/profile-dropdown.tsx`
- Modify: `apps/web/components/site-header/site-header.tsx`
- Modify: `apps/web/messages/en.json`, `apps/web/messages/pt-BR.json`

**Interfaces:**
- Consumes: `session.user.company: { slug: string; role: CompanyRole } | null` from Task 6, available via `authClient.useSession()`.
- Produces: `ProfileDropdownProps` gains `dashboardHref?: string` (omit the prop entirely when there's no company — `SiteHeader` only passes it when `session.user.company` is present). When present, renders a new menu item above the existing Profile/Settings/separator/Log out, using the existing `DropdownMenuItem` pattern and a `LayoutDashboardIcon` from `lucide-react`.

- [ ] **Step 1: Add `dashboardHref` + label to `ProfileDropdown`**

Extend `ProfileDropdownLabels` with `dashboard: string`. Render `{dashboardHref ? <DropdownMenuItem asChild><a href={dashboardHref}>...</a></DropdownMenuItem> : null}` before the `profileHref` item.

- [ ] **Step 2: Wire it in `SiteHeader`**

Read `session.user.company` from the existing `authClient.useSession()` call; pass `dashboardHref={company ? localizeHref(\`/company/${company.slug}\`, locale) : undefined}` and the new label.

- [ ] **Step 3: Add translation keys**

`navigation.profileMenu.dashboard`: `"Dashboard"` (en) / `"Painel"` (pt-BR).

- [ ] **Step 4: Type-check and lint**

Run: `pnpm --filter web check-types && pnpm --filter @orchestra/ui check-types && pnpm exec ultracite check packages/ui/src/components/profile-dropdown/profile-dropdown.tsx apps/web/components/site-header/site-header.tsx`

- [ ] **Step 5: Manual verification**

Start the dev server (or reuse the one already running), sign in as a user with a company fixture (create one via a quick script or the UI once Task 14 exists), confirm the Dashboard item appears and links correctly; confirm it's absent for a user without a company.

- [ ] **Step 6: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 14: Company registration page

**Files:**
- Create: `apps/web/components/company-register-form/company-register-form.tsx`
- Create: `apps/web/app/[locale]/company/register/page.tsx`
- Modify: `apps/web/messages/en.json`, `apps/web/messages/pt-BR.json`

**Interfaces:**
- Produces: a form (`TextField` for `name`, `SubmitButton`) that `POST`s to the API's `POST /companies` (via a `fetch` to `/api/companies` proxied the same way `/api/auth/*` is — confirm in Task 15/16 whether a generic API proxy exists; if not, this task adds the minimal one: check `apps/web/next.config.ts` for the existing `/api/auth/*` rewrite and extend it to `/api/:path*` → the API's base URL, since every subsequent dashboard page needs this too). On success, redirects to `/company/:slug` (the new dashboard).

- [ ] **Step 1: Confirm/extend the API proxy**

Read `apps/web/next.config.ts`. If it only rewrites `/api/auth/*`, broaden the rewrite to `/api/:path*` pointing at the same API origin, keeping the existing auth-specific behavior if any extra headers/config are attached to it.

- [ ] **Step 2: Implement `CompanyRegisterForm`**

Follow `SignInForm`'s shape (`useSchemaForm` or a plain controlled form, `useState` for pending/error, `fetch("/api/companies", { method: "POST", body: JSON.stringify({ name }) })`, `useRouter` from `@/i18n/navigation` to redirect on success).

- [ ] **Step 3: Implement the page**

`apps/web/app/[locale]/company/register/page.tsx` renders `<CompanyRegisterForm />` inside whatever shell matches existing auth pages (check `(auth)/layout.tsx` for a reusable shell, e.g. `AuthShell` — reuse it if generic enough, or render plain).

- [ ] **Step 4: Add translation keys**

A `companyRegister` namespace: `title`, `nameLabel`, `submit`, `pending`, error messages for a duplicate/validation failure.

- [ ] **Step 5: Type-check, lint, manual verification**

Run: `pnpm --filter web check-types && pnpm exec ultracite check apps/web/components/company-register-form apps/web/app/[locale]/company/register`
Then manually sign in, visit `/company/register`, submit a name, confirm redirect to `/company/:slug`.

- [ ] **Step 6: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 15: Dashboard layout + route guard

**Files:**
- Create: `apps/web/app/[locale]/(dashboard)/layout.tsx`

**Interfaces:**
- Produces: a layout that reads the session server-side (via better-auth's server API — check how `(auth)/layout.tsx` or any existing server component reads session, or call `authClient`'s server equivalent; if no server-side pattern exists yet, do the check client-side in a small wrapper component that redirects via `useRouter` in a `useEffect`, matching the simplest viable pattern given nothing else in the repo reads sessions server-side yet). Redirects to `/sign-in` if unauthenticated, to `/company/register` if authenticated but `company` is `null`.

- [ ] **Step 1: Implement the layout**

- [ ] **Step 2: Type-check, lint, manual verification**

Run: `pnpm --filter web check-types && pnpm exec ultracite check "apps/web/app/[locale]/(dashboard)/layout.tsx"`
Manually confirm: signed-out → redirected to sign-in; signed-in without a company → redirected to `/company/register`; signed-in with a company → dashboard renders.

- [ ] **Step 3: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 16: Company overview/settings page

**Files:**
- Create: `apps/web/app/[locale]/(dashboard)/company/[slug]/page.tsx`
- Create: `apps/web/components/company-settings-form/company-settings-form.tsx`
- Create: `apps/web/components/transfer-ownership-dialog/transfer-ownership-dialog.tsx`
- Modify: `apps/web/messages/en.json`, `apps/web/messages/pt-BR.json`

**Interfaces:**
- Consumes: `GET /companies/:slug`, `PATCH /companies/:slug`, `POST /companies/:slug/transfer-ownership`, `GET /companies/:slug/members` (for the transfer-ownership target picker), `defineAbilityFor`/`getUserPermissions` from `@orchestra/rbac` (client-side gating: only render the rename form and the transfer-ownership control when `can("update"/"transfer_ownership", company)`).

- [ ] **Step 1: Implement the page + forms**

Fetch the company client-side (or server-side if the layout already has it — pass down via props/context to avoid a duplicate fetch). Render `CompanySettingsForm` (rename, visible to ADMINs, submits `PATCH`) and `TransferOwnershipDialog` (member picker + confirm, visible only to the owner, submits `POST .../transfer-ownership`). `MEMBER`/`BILLING` roles see a read-only view (name only, no forms).

- [ ] **Step 2: Add translation keys**

- [ ] **Step 3: Type-check, lint, manual verification**

Run: `pnpm --filter web check-types && pnpm exec ultracite check apps/web/components/company-settings-form apps/web/components/transfer-ownership-dialog "apps/web/app/[locale]/(dashboard)/company/[slug]/page.tsx"`
Manually verify as owner (can rename, can transfer), as non-owner ADMIN (can rename, can't transfer), as MEMBER (read-only).

- [ ] **Step 4: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 17: Members page

**Files:**
- Create: `apps/web/app/[locale]/(dashboard)/company/[slug]/members/page.tsx`
- Create: `apps/web/components/member-list/member-list.tsx`
- Create: `apps/web/components/invite-member-form/invite-member-form.tsx`
- Create: `apps/web/components/member-job-roles-picker/member-job-roles-picker.tsx`
- Modify: `apps/web/messages/en.json`, `apps/web/messages/pt-BR.json`

**Interfaces:**
- Consumes: `GET/PATCH/DELETE .../members[/:id]`, `PUT .../members/:id/job-roles`, `POST/GET/DELETE .../invites`, `GET .../job-roles` (company's selection, for the picker's choices).

- [ ] **Step 1: Implement `MemberList`**

Table/list of members (name, email, role select for ADMINs, job-role tags, remove button for ADMINs — disabled/hidden for the owner's own row). Role change and removal call their respective API routes and refetch.

- [ ] **Step 2: Implement `InviteMemberForm`**

Email + role select, visible to ADMINs only, `POST`s to `.../invites`, shows pending invites list with revoke buttons.

- [ ] **Step 3: Implement `MemberJobRolesPicker`**

A multi-select (checkboxes via `DropdownMenu` or a simple checkbox list — builder's call) scoped to the company's selected job roles (fetched once per page), `PUT`s to `.../members/:id/job-roles`.

- [ ] **Step 4: Implement the page, wiring the three components together, gated by role** (non-ADMINs see a read-only member list, no invite form, no edit controls).

- [ ] **Step 5: Add translation keys**

- [ ] **Step 6: Type-check, lint, manual verification**

Run: `pnpm --filter web check-types && pnpm exec ultracite check apps/web/components/member-list apps/web/components/invite-member-form apps/web/components/member-job-roles-picker "apps/web/app/[locale]/(dashboard)/company/[slug]/members/page.tsx"`
Manually verify: invite a second test user's email (check Mailpit at `localhost:8025` for the email), accept it, confirm the new member shows up, assign a job role, remove a member.

- [ ] **Step 7: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.

---

## Task 18: Company job-roles picker page

**Files:**
- Create: `apps/web/app/[locale]/(dashboard)/company/[slug]/job-roles/page.tsx`
- Create: `apps/web/components/company-job-roles-form/company-job-roles-form.tsx`
- Modify: `apps/web/messages/en.json`, `apps/web/messages/pt-BR.json`

**Interfaces:**
- Consumes: `GET /job-roles` (full catalog), `GET/PUT /companies/:slug/job-roles` (current selection + save).

- [ ] **Step 1: Implement `CompanyJobRolesForm`**

A checklist of all 32 catalog entries (grouped or flat — builder's call), pre-checked per the company's current selection, `PUT`s the full set on save. ADMIN-gated; MEMBER/BILLING get a read-only list.

- [ ] **Step 2: Implement the page**

- [ ] **Step 3: Add translation keys**

- [ ] **Step 4: Type-check, lint, manual verification**

Run: `pnpm --filter web check-types && pnpm exec ultracite check apps/web/components/company-job-roles-form "apps/web/app/[locale]/(dashboard)/company/[slug]/job-roles/page.tsx"`
Manually verify: toggle a few categories, save, reload, confirm persistence; confirm a job role removed from the company's selection is no longer assignable on the Members page (Task 17).

- [ ] **Step 5: Run the full workspace check**

Run: `pnpm --filter api test && pnpm --filter @orchestra/shared test && pnpm --filter @orchestra/rbac test && pnpm check-types && pnpm exec ultracite check`
Expected: everything passes, confirming the whole feature is internally consistent end to end.

- [ ] **Step 6: Commit**

Per Global Constraints, do not commit. Leave the changes staged/uncommitted.
