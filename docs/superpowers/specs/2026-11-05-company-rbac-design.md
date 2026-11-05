# Company RBAC — Design

## Intent

Orchestra's navbar already has a "Cadastrar empresa" (register business) link, but it goes
nowhere — there's no company model, no membership, no permissions. This project builds that
foundation: companies, the people who belong to them, what each of those people is allowed to
do, and the first screens to use it.

The permission model is adapted from `galembeck/saas-rbac` (a CASL-based RBAC reference the
project owner built previously): a small per-role ability package that every API route consults
before mutating anything, rather than ad hoc `if (user.role === ...)` checks scattered through
handlers.

## Goals

- A user can create exactly one company and becomes its owner.
- A company has members, each with one system role: `ADMIN`, `BILLING`, or `MEMBER`.
- An admin can invite people by email; invitees who accept become members.
- An admin can assign each member one or more **job roles** (e.g. Plumber, Electrician) drawn
  from a shared, platform-wide catalog of all 32 trade categories the landing page already
  claims to have (today only 8 exist in code) — see "Job-role catalog" below.
- An admin can pick which job roles from that catalog apply to their company (what trades they
  offer) before assigning them to members.
- Every mutating API route checks permission via the RBAC package before touching the database,
  returning 403 on failure.
- A minimal dashboard exists to exercise all of this: create company, view/manage members,
  send/revoke invites, pick company job roles, assign member job roles.

## Job-role catalog (full 32)

`packages/shared/src/constants/categories.ts` currently defines only the 8 `FEATURED_CATEGORIES`
shown on the homepage, against a claimed `TOTAL_CATEGORY_COUNT = 32`. This project authors the
remaining 24 so the `JobRole` table seeds from a real, complete catalog. `FEATURED_CATEGORIES`
stays as-is (still the 8 shown on the homepage tiles); a new `ALL_CATEGORIES` constant (32
entries, superset including the 8 featured ones) becomes the source `CategoryKey` derives from
and what `JobRole` is seeded from. `CATEGORY_ICONS` (`apps/web/components/categories/category-icons.ts`)
gets the 24 new icon mappings. No public `/categories` listing page is built — that stays out of
scope per the non-goals below; only the data needs to exist for the dashboard's job-role picker.

New categories (`key` / `slug` / suggested `lucide-react` icon / en / pt-BR):

| key | slug | icon | en | pt-BR |
|---|---|---|---|---|
| locksmith | locksmith | KeyRoundIcon | Locksmith | Chaveiro |
| cleaning | cleaning | SparklesIcon | House cleaning | Faxina |
| applianceRepair | appliance-repair | WrenchIcon | Appliance repair | Conserto de eletrodomésticos |
| masonry | masonry | HardHatIcon | Masonry | Pedreiro |
| roofing | roofing | HomeIcon | Roofing | Telhados |
| glazier | glazier | FrameIcon | Glazier | Vidraceiro |
| upholstery | upholstery | SofaIcon | Upholstery | Estofados |
| itSupport | it-support | LaptopIcon | IT support | Suporte de informática |
| photography | photography | CameraIcon | Photography | Fotografia |
| personalTrainer | personal-trainer | DumbbellIcon | Personal training | Personal trainer |
| tutoring | tutoring | GraduationCapIcon | Tutoring | Aulas particulares |
| eventDecoration | event-decoration | PartyPopperIcon | Event decoration | Decoração de eventos |
| catering | catering | ChefHatIcon | Catering | Buffet |
| petGrooming | pet-grooming | DogIcon | Pet grooming | Banho e tosa |
| interiorDesign | interior-design | PaletteIcon | Interior design | Design de interiores |
| handyman | handyman | Settings2Icon | Handyman | Faz-tudo |
| flooring | flooring | LayersIcon | Flooring | Pisos e revestimentos |
| poolMaintenance | pool-maintenance | WavesIcon | Pool maintenance | Manutenção de piscinas |
| securitySystems | security-systems | ShieldIcon | Security systems | Sistemas de segurança |
| solarPanels | solar-panels | SunIcon | Solar panels | Energia solar |
| autoMechanic | auto-mechanic | CarIcon | Auto mechanic | Mecânica automotiva |
| waterproofing | waterproofing | DropletsIcon | Waterproofing | Impermeabilização |
| furnitureAssembly | furniture-assembly | PackageIcon | Furniture assembly | Montagem de móveis |
| fencing | fencing | FenceIcon | Fencing | Cercas e muros |

(`businessCount` for each new entry: builder's call, a placeholder number consistent with the
existing fake marketing counts.)

## Non-goals (this round)

- Multi-company membership. One user ↔ at most one company (as owner or member), enforced with
  a unique constraint. Revisit if the business ever needs it.
- Billing/payments functionality. The `BILLING` role and a `Billing` CASL subject exist so the
  shape is extensible, but no payment processing, invoices, or billing UI are built.
- Admin-created job roles. The catalog is shared and platform-managed; company admins select
  from it, they don't add to it.
- A "Project"-style owned sub-resource (present in the reference repo). Orchestra has no
  equivalent concept to build yet; skip it.
- Full company-facing marketing pages (public company profile, search placement, etc.) — out of
  scope, this is the internal dashboard + permission core only.

## Anti-goals

- Permission checks reimplemented per-route instead of going through the shared ability
  package — defeats the purpose of porting the pattern over.
- Treating job roles as a permission concept (they must never gate what actions a member can
  take — only what trade they're tagged with).

## Constraints

- Auth is better-auth with session cookies, not JWT like the reference repo. There is currently
  no server-side session helper in `apps/api` at all — only the catch-all `/api/auth/*` proxy
  route. This project adds the first one: a Fastify `preHandler` that calls
  `auth.api.getSession({ headers })` and decorates the request.
- `apps/api` has no app-wide error-handling convention yet (no `setErrorHandler`, no error
  classes). This project adds a minimal one (a small `AppError` hierarchy +
  `app.setErrorHandler`), scoped to what RBAC/company routes need — not a full rewrite of
  existing routes.
- Prisma convention (from the existing `User`/`Session`/etc. models): PascalCase model names,
  camelCase fields, `@map("snake_case")` per field, `@@map("snake_case_plural")` per table. New
  models follow this exactly.
- `apps/api` doesn't use a Fastify zod type provider; request validation is manual (see
  `modules/auth/auth-validation.ts`). New routes validate the same way.
- Frontend: a new `apps/web/app/[locale]/(dashboard)/` route group, parallel to the existing
  `(auth)` group, holding all company-dashboard pages. Localized the same way (`localizeHref`,
  `next-intl`), with both `en` and `pt-BR` strings for every new screen.
- Everything ships lint-clean under Ultracite/Biome and type-checks under each package's
  `check-types` script, matching how the navbar/auth work earlier in this project was verified.

## Data model (`packages/database/prisma/schema.prisma`)

```prisma
enum CompanyRole {
  ADMIN
  BILLING
  MEMBER
}

enum InviteStatus {
  PENDING
  ACCEPTED
  REVOKED
}

model Company {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  ownerId String @map("owner_id")
  owner   User   @relation(fields: [ownerId], references: [id])

  members    Member[]
  invites    Invite[]
  jobRoles   CompanyJobRole[]

  @@map("companies")
}

model Member {
  id        String      @id @default(uuid())
  role      CompanyRole @default(MEMBER)
  createdAt DateTime    @default(now()) @map("created_at")

  userId String @unique @map("user_id")   // unique => one company per user
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyId String  @map("company_id")
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  jobRoles MemberJobRole[]

  @@map("members")
}

model Invite {
  id        String       @id @default(uuid())
  email     String
  role      CompanyRole  @default(MEMBER)
  token     String       @unique
  status    InviteStatus @default(PENDING)
  expiresAt DateTime     @map("expires_at")
  createdAt DateTime     @default(now()) @map("created_at")

  companyId String  @map("company_id")
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  authorId String? @map("author_id")
  author   User?   @relation(fields: [authorId], references: [id], onDelete: SetNull)

  @@unique([email, companyId])
  @@index([email])
  @@map("invites")
}

model JobRole {
  id   String @id @default(uuid())
  key  String @unique   // matches existing CategoryKey, e.g. "plumber"
  slug String @unique   // matches existing category slug, e.g. "plumber"

  companies CompanyJobRole[]
  members   MemberJobRole[]

  @@map("job_roles")
}

model CompanyJobRole {
  companyId String  @map("company_id")
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  jobRoleId String  @map("job_role_id")
  jobRole   JobRole @relation(fields: [jobRoleId], references: [id], onDelete: Cascade)

  @@id([companyId, jobRoleId])
  @@map("company_job_roles")
}

model MemberJobRole {
  memberId  String  @map("member_id")
  member    Member  @relation(fields: [memberId], references: [id], onDelete: Cascade)
  jobRoleId String  @map("job_role_id")
  jobRole   JobRole @relation(fields: [jobRoleId], references: [id], onDelete: Cascade)

  @@id([memberId, jobRoleId])
  @@map("member_job_roles")
}
```

`JobRole` is seeded (migration seed script) from the existing
`packages/shared/src/constants/categories.ts` `FEATURED_CATEGORIES` keys/slugs — that file
remains the source of icons/labels for the UI; the database table is the referential/assignable
side of the same taxonomy. `User` gains the inverse relations (`company` via `owns_companies`,
`member` via the `Member` relation, `invites` authored).

A member's job-role assignment is restricted at the API layer to job roles the member's company
has selected (`CompanyJobRole`) — not enforced in the schema itself.

## Permission package (`packages/rbac`, new)

Ports the reference repo's CASL structure directly:

- `src/types/role.ts` — `CompanyRole` zod schema (`ADMIN` | `BILLING` | `MEMBER`).
- `src/models/{company,member,invite}.model.ts` — zod schemas with `__typename` discriminators,
  mirroring `organization.model.ts` / `project.model.ts` in the reference.
- `src/subjects/{company,member,invite,billing}.subject.ts` — the action/subject tuples per
  resource.
- `src/permissions.ts` — one function per role:
  - `ADMIN`: `can("manage", "all")`, except `cannot(["transfer_ownership", "update"], "Company")`
    relaxed back with `can([...], "Company", { ownerId: { $eq: user.id } })` — only the owner
    (who is always an ADMIN) can transfer ownership or rename the company. Regular admins (not
    the owner) can still manage members, invites, and job-role assignment.
  - `BILLING`: `can("manage", "Billing")` plus `can("get", "Company")` (read-only access to the
    overview page; the members/job-roles dashboard pages stay out of their nav and 403 if hit
    directly — there's no billing UI to route them to instead).
  - `MEMBER`: `can("get", ["Company", "Member"])` (read-only), can manage their own job-role
    *view* but not assignment.
- `src/index.ts` — `defineAbilityFor(user)`, `getUserPermissions(userId, role)`, exactly as in
  the reference.

This package has no dependency on better-auth or Fastify — it's pure domain logic, reusable from
both `apps/api` and (for client-side UI gating, e.g. hiding the "Invite" button) `apps/web`.

## Session enrichment

The navbar's `ProfileDropdown` (outside the dashboard route group, rendered on every page) needs
to know whether the signed-in user has a company, without a dedicated fetch on every page load.
Better-auth already supports attaching extra fields to the session (used for `adultConfirmedAt`/
`termsAcceptedAt` on the user); this project adds a session-enrichment hook that attaches
`company: { slug: string; role: CompanyRole } | null` to `session.user`, computed server-side
from the caller's `Member` row. `authClient.useSession()` then returns it for free, and
`ProfileDropdownUser` gains an optional `company` field driving a new "Dashboard" menu item.

## API (`apps/api`)

New `apps/api/src/modules/`:

- `session/` — the new `preHandler` plugin: resolves the better-auth session via
  `auth.api.getSession({ headers })`, decorates `request.user` (401 if absent), and
  `request.getCompanyMembership()` which loads the caller's `Member` row + `Company` (404/403 if
  none). This is the equivalent of the reference's `auth.ts` middleware, adapted for
  session-cookie auth and the one-company-per-user model (no slug parameter needed on the
  decorator itself, though routes still address companies by slug in the URL for consistency and
  future-proofing).
- `errors/` — `AppError` base class + `NotFoundError`, `ForbiddenError`, `BadRequestError`,
  `ConflictError`, and `app.setErrorHandler` wired in `app.ts`, mapping each to its HTTP status
  and a JSON `{ message, code }` body.
- `companies/` — routes:
  - `POST /companies` — create. A single transaction inserts both the `Company` row and the
    owner's `Member` row (`role: ADMIN`) — the owner's permissions are always resolved through
    that `Member` row, never through `Company.ownerId` directly. Fails if the caller already has
    a `Member` row anywhere (enforces one company per user).
  - `GET /companies/:slug` — fetch.
  - `PATCH /companies/:slug` — update name (ADMIN; renaming is gated to the owner via the
    ability check's `ownerId` condition).
  - `POST /companies/:slug/transfer-ownership` — owner-only. Body: `{ newOwnerMemberId }`. The
    target must already be a `Member` of the company; the transaction sets `Company.ownerId` to
    the new owner's `userId`, promotes their `Member.role` to `ADMIN` (if not already), and
    demotes the previous owner's `Member.role` to `ADMIN` (they keep admin rights, just lose the
    owner-only actions).
  - `GET /companies/:slug/job-roles` — company's selected job roles.
  - `PUT /companies/:slug/job-roles` — replace the selected set (ADMIN).
- `members/` — routes:
  - `GET /companies/:slug/members` — list, with each member's job roles.
  - `PATCH /companies/:slug/members/:memberId` — change role (ADMIN; can't demote/remove the
    owner).
  - `PUT /companies/:slug/members/:memberId/job-roles` — set a member's job roles, restricted to
    the company's selected set (ADMIN).
  - `DELETE /companies/:slug/members/:memberId` — remove (ADMIN; can't remove the owner).
- `invites/` — routes:
  - `POST /companies/:slug/invites` — create + email (ADMIN). If a `PENDING` invite already
    exists for that email+company but its `expiresAt` has passed, it's overwritten (new token,
    new `expiresAt`) instead of conflicting on the unique constraint; a still-live `PENDING`
    invite does conflict (409).
  - `GET /companies/:slug/invites` — list pending (ADMIN).
  - `DELETE /companies/:slug/invites/:inviteId` — revoke (ADMIN).
  - `POST /invites/:token/accept` — authenticated user redeems an invite, creating their
    `Member` row. Rejects (400) if the invite's `expiresAt` has passed (checked lazily — no
    background job transitions it), if the caller already belongs to a company, or if
    `session.user.email` doesn't case-insensitively match `Invite.email` (prevents a forwarded
    link being redeemed by someone else).
- `job-roles/` — `GET /job-roles` — the full shared catalog (public to authenticated users, for
  the "pick your company's job roles" screen).

Invite emails reuse the existing `createSmtpMailer` (`apps/api/src/modules/mail/mailer.ts`) and
are sent in the invitee's — or failing that, the company's — locale, the same convention as
verification emails per the README.

Every mutating handler follows the reference's shape: resolve membership → build ability via
`getUserPermissions` → `if (cannot(action, subject)) throw new ForbiddenError(...)` → do the
Prisma call.

## Frontend (`apps/web`)

- `app/[locale]/(dashboard)/layout.tsx` — new route group, requires a session (redirect to
  sign-in) and membership (redirect to `/company/register` if none).
- `app/[locale]/company/register/page.tsx` — the page `BUSINESS_SIGN_UP_LINK` already points to;
  a form (name → slug auto-generate) that calls `POST /companies`.
- `app/[locale]/(dashboard)/company/[slug]/page.tsx` — overview/settings (rename, ADMIN-only
  edit, ownership transfer UI gated to the owner).
- `app/[locale]/(dashboard)/company/[slug]/members/page.tsx` — member list, invite form, role
  change, job-role assignment per member, remove member — each control visibility/enablement
  driven by `defineAbilityFor` on the client (from `packages/rbac`) using the session's role, not
  just hidden-but-reachable.
- `app/[locale]/(dashboard)/company/[slug]/job-roles/page.tsx` — checklist against the shared
  catalog (`GET /job-roles` ∪ company's current selection).
- `ProfileDropdown` (`packages/ui`) gains a "Dashboard" item (shown only when the session's user
  has a company), completing the company-member variant deferred from the navbar work — kept
  intentionally minimal: one link into `(dashboard)`, not a separate menu shape yet.
- All new strings added to `apps/web/messages/{en,pt-BR}.json` under a new `dashboard` /
  `company` namespace, following the existing structure.

## What's left to the builder

- Exact Zod validation schemas per route body/params.
- Exact slug-collision handling on company creation (append suffix vs. reject).
- Invite token format/expiry length (suggest: random 32-byte url-safe token, 7-day expiry,
  matching no existing convention since none exists yet — builder's call, document it).
- Table/form component choices inside the dashboard pages (reuse existing `packages/ui`
  primitives: `Button`, `TextField`, `DropdownMenu`, etc.).
- Test coverage shape (the reference repo pairs every route with a `*.test.ts`; `apps/api`
  already runs Vitest against an embedded Postgres per the README — new routes should follow
  that pattern).
