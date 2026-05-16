# Orchestra

> A full-stack, multi-tenant SaaS platform built on a modern pnpm + Turborepo monorepo.

Orchestra lets businesses register on the platform, manage their team, define services, and control their operations — all from a polished, responsive web interface. An internal admin backoffice gives the platform operators full visibility and control over every tenant and user.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Apps](#apps)
- [Packages](#packages)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Project Structure](#project-structure)

---

## Architecture Overview

```
orchestra-frontend/
├── apps/
│   ├── web/          → Customer-facing SPA (React + Vite)
│   ├── admin/        → Internal backoffice SPA (React + Vite)
│   ├── api/          → Main platform API (Fastify + Drizzle ORM)
│   └── api-admin/    → Internal admin API (Fastify + Drizzle ORM)
└── packages/
    ├── ui/           → Shared component library (Atomic Design)
    ├── core/         → Shared utilities, hooks & API client (Kubb-generated)
    ├── tailwind-config/   → Shared Tailwind v4 theme & tokens
    ├── eslint-config/     → Shared ESLint presets
    └── typescript-config/ → Shared tsconfig presets
```

All packages and apps are orchestrated by **Turborepo** with `pnpm` workspaces. Tasks run in parallel and are cached by Turborepo's remote cache — builds are fast and incremental.

---

## Apps

### `web` — Customer Portal

The main user-facing application. Companies and individual clients interact with the platform here.

| Route group | Description |
|---|---|
| `/` | Public landing page with search |
| `/services` | Public services directory |
| `/help-center` | Public help & support pages |
| `/sign-in` / `/sign-up` | Multi-step authentication & registration flow |
| `/my-account` | Authenticated user account management |
| `/app/:companySlug/` | Company workspace — overview, team, services, configuration |
| `/app/~/settings` | Account-level settings when no company is selected |

**Stack:** React 19 · Vite 8 · TanStack Router (file-based) · TanStack Query · TanStack Form · TanStack Table · Zod · Sonner · Tailwind CSS v4

---

### `admin` — Internal Backoffice

A separate SPA for platform operators. Protected behind its own authentication, it provides a full management panel for overseeing tenants, users, and platform configuration.

| Route group | Description |
|---|---|
| `/sign-in` | Admin authentication |
| `/panel/overview` | Dashboard overview |

**Stack:** React 19 · Vite 8 · TanStack Router · TanStack Query · TanStack Form · Zod · Sonner · Tailwind CSS v4

---

### `api` — Main Platform API

Fastify-powered REST API serving the customer portal. Exposes a fully typed OpenAPI spec via `@scalar/fastify-api-reference` and drives automatic TypeScript client generation for the web app through **Kubb**.

**Key domains:**

| Domain | Description |
|---|---|
| `auth` | Sign-in, register client, register company owner |
| `users` | Authenticated user profile (`/me`) |
| `companies` | Multi-tenant company management |
| `company-members` | Team membership and roles |
| `role-permissions` | Fine-grained RBAC |

**Stack:** Fastify 5 · Drizzle ORM · PostgreSQL · Zod (request/response validation) · JWT + Cookies · OpenAPI / Scalar

---

### `api-admin` — Internal Admin API

A separate Fastify server exclusively for the backoffice, with its own JWT authentication, database connection, and OpenAPI docs.

**Stack:** Fastify 5 · Drizzle ORM · PostgreSQL · Zod · JWT · OpenAPI / Scalar

---

## Packages

### `@repo/ui` — Shared Component Library

A compiled React component library following **Atomic Design** principles. Components are consumed directly by both `web` and `admin` apps.

```
src/components/
  atoms/      → Button, Input, Badge, Checkbox, Label, Skeleton, ThemeToggle…
  molecules/  → Logo, Avatar, Card, Field, Accordion, Breadcrumb, Dialog, Tooltip…
  organisms/  → Navbar, Sidebar, Footer, DataTable, BentoGrid, ProfileDropdown…
```

- Tailwind CSS v4 with a `ui:` prefix to scope utility classes and prevent conflicts
- Each component lives in its own directory with a co-located Storybook story
- Supports light and dark themes via a `.dark` class toggle

Run Storybook:

```bash
cd packages/ui
pnpm storybook          # dev server on port 6006
pnpm build-storybook    # static export
```

---

### `@repo/core` — Shared Utilities & API Client

Central package consumed by both frontend apps. Contains:

- **Kubb-generated API client** — TypeScript types and TanStack Query hooks auto-generated from the API's OpenAPI spec
- Shared hooks and utility functions
- Redux Toolkit store setup (shared state)
- Date formatting helpers (`date-fns`)
- Input masking (`imask`)

Regenerate the API client after backend changes:

```bash
pnpm --filter @repo/core generate:api
```

---

### `@repo/tailwind-config` — Shared Theme

Defines shared CSS custom properties and design tokens consumed by every app:

- Custom color scale: `--color-blue-1000`, `--color-purple-1000`, `--color-red-1000`
- PostCSS configuration shared across the monorepo
- Each app's `globals.css` imports `@repo/tailwind-config` to inherit the token system

---

### `@repo/eslint-config` — Shared Linting

Three ESLint presets for consistent quality across all packages:

| Preset | Usage |
|---|---|
| `base` | JS + TypeScript + Prettier + Turbo |
| `next-js` | `base` + React, React Hooks, Next.js |
| `react-internal` | `base` + React, React Hooks (no Next.js) |

All configs run with `--max-warnings 0` — lint warnings are treated as errors.

---

### `@repo/typescript-config` — Shared TypeScript

Three tsconfig presets:

| Preset | Usage |
|---|---|
| `base.json` | Shared strict settings |
| `nextjs.json` | Apps (ESNext, Bundler resolution, JSX preserve) |
| `react-library.json` | UI package (React JSX transform) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | pnpm · Turborepo |
| **Frontend** | React 19 · Vite 8 · TanStack Router / Query / Form / Table |
| **Backend** | Fastify 5 · Drizzle ORM · PostgreSQL |
| **Validation** | Zod v4 (end-to-end, API + forms) |
| **Styling** | Tailwind CSS v4 · CSS-first config · design tokens |
| **Auth** | JWT · HTTP-only cookies |
| **API Docs** | OpenAPI · Scalar |
| **Code Gen** | Kubb (OpenAPI → TypeScript + React Query) |
| **Component Dev** | Storybook · Atomic Design |
| **Type Safety** | TypeScript 6 · strict mode |
| **Linting** | ESLint · Biome · Ultracite |
| **Formatting** | Biome · Prettier (markdown) |

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, pnpm 10

```bash
# Clone the repo
git clone <repo-url>
cd orchestra-frontend

# Install all dependencies
pnpm install

# Start all apps and packages in watch mode
pnpm dev
```

Individual apps:

```bash
pnpm turbo run dev --filter=@orchestra/web       # customer portal
pnpm turbo run dev --filter=@orchestra/admin     # internal backoffice
pnpm turbo run dev --filter=@orchestra/api       # main API
pnpm turbo run dev --filter=@orchestra/api-admin # admin API
```

---

## Development Workflow

```bash
# Build everything
pnpm build

# Type-check all packages
pnpm check-types

# Lint all packages
pnpm lint

# Format all files (Prettier for .ts/.tsx/.md)
pnpm format

# Biome — check and auto-fix (run from the specific app/package dir)
pnpm dlx @biomejs/biome check --write <file>

# Rebuild the shared UI package (two steps)
cd packages/ui
pnpm build:styles       # Tailwind CSS → dist/index.css
pnpm build:components   # TypeScript → dist/*.js
```

### Database (per API app)

```bash
cd apps/api          # or apps/api-admin

pnpm db:generate     # generate Drizzle migration files
pnpm db:migrate      # run pending migrations
pnpm db:push         # push schema directly (dev)
pnpm db:studio       # open Drizzle Studio
```

---

## Code Standards

This project enforces strict code quality through **Ultracite** (Biome under the hood).

Key rules:

- **No `any`** — use `unknown` and narrow types explicitly
- **Arrow functions** for callbacks; `const` by default
- **`for...of`** over `.forEach()` or indexed loops
- **`async/await`** over promise chains; always handle errors with try-catch
- **Function components only** — no class components
- **No barrel files** — import directly from the source file
- **Semantic HTML + ARIA** — accessible by default
- **Mobile-first responsive design** with Tailwind responsive prefixes
- **No `console.log`** or `debugger` in production code
- **`rel="noopener"`** on all `target="_blank"` links

Run the full check before committing:

```bash
pnpm dlx ultracite check
pnpm dlx ultracite fix    # auto-fix most issues
```

---

## Project Structure

```
orchestra-frontend/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── pages/          # File-based routes (TanStack Router)
│   │       │   ├── _public/    # Unauthenticated landing & marketing
│   │       │   ├── _auth/      # Sign-in / Sign-up flows
│   │       │   ├── _error/     # 404 and error pages
│   │       │   └── app/        # Authenticated company workspace
│   │       ├── components/     # App-specific components
│   │       ├── hooks/          # App-specific hooks
│   │       └── utils/          # App-specific utilities
│   │
│   ├── admin/
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── _auth/      # Admin sign-in
│   │       │   └── _app/panel/ # Backoffice panel & overview
│   │       └── components/
│   │
│   ├── api/
│   │   └── src/
│   │       ├── db/             # Drizzle schema & migrations
│   │       │   └── schema/     # companies, users, roles, members…
│   │       ├── http/
│   │       │   ├── routes/     # auth, users, companies, members, roles
│   │       │   └── middlewares/
│   │       ├── schemas/        # Zod request/response schemas (by domain)
│   │       ├── plugins/        # Fastify plugins
│   │       └── types/
│   │
│   └── api-admin/
│       └── src/                # Same structure as api/
│
└── packages/
    ├── ui/
    │   └── src/
    │       ├── components/
    │       │   ├── atoms/      # Button, Input, Badge, Label…
    │       │   ├── molecules/  # Card, Logo, Field, Tooltip…
    │       │   └── organisms/  # Navbar, Sidebar, DataTable, Footer…
    │       └── styles.css      # Tailwind entry point
    │
    ├── core/
    │   └── src/
    │       ├── generated/      # Kubb-generated API types & hooks
    │       ├── hooks/
    │       └── utils/
    │
    ├── tailwind-config/        # Shared tokens & PostCSS
    ├── eslint-config/          # base / next-js / react-internal presets
    └── typescript-config/      # base / nextjs / react-library tsconfigs
```
