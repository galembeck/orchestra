# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (all apps in parallel)
pnpm dev

# Build all packages and apps
pnpm build

# Lint all packages and apps
pnpm lint

# Type check all packages and apps
pnpm check-types

# Format code
pnpm format
```

Run tasks for a single package by filtering with Turbo:

```bash
pnpm turbo run dev --filter=web
pnpm turbo run build --filter=docs
pnpm turbo run lint --filter=@repo/ui
```

Build the UI package specifically (two steps):

```bash
cd packages/ui
pnpm build:styles   # Tailwind CSS compilation
pnpm build:components  # TypeScript compilation
```

## Architecture

This is a **pnpm + Turborepo monorepo** with two Next.js apps and four shared internal packages.

```
apps/
  docs/   → Next.js app on port 3000
  web/    → Next.js app on port 3001
packages/
  ui/             → Shared React component library
  tailwind-config/→ Shared Tailwind CSS theme and PostCSS config
  eslint-config/  → Shared ESLint configs (base, next-js, react-internal)
  typescript-config/ → Shared tsconfigs (base, nextjs, react-library)
```

### Shared UI Package (`@repo/ui`)

The UI package is compiled (not source-referenced). It has two separate build steps:
- TypeScript (`tsc`) compiles components to `dist/*.js`
- Tailwind CLI compiles `src/styles.css` to `dist/index.css`

Apps import components as `@repo/ui/<component>` and styles as `@repo/ui/styles.css`.

The UI package uses `prefix(ui)` in Tailwind to scope its utility classes and prevent conflicts with the consuming apps' own Tailwind styles. When writing components in `packages/ui`, use `ui:` prefixed classes (e.g., `ui:flex`, `ui:text-sm`).

### Styling

- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- Shared theme variables (custom colors `--color-blue-1000`, `--color-purple-1000`, `--color-red-1000`) are defined in `packages/tailwind-config/shared-styles.css`
- Each app's `globals.css` imports `@repo/tailwind-config` to pick up shared theme tokens

### TypeScript

All packages extend from `@repo/typescript-config`:
- Apps use `nextjs.json` (ESNext modules, Bundler resolution, JSX preserve)
- UI library uses `react-library.json` (React JSX transform)
- `strictNullChecks` is explicitly enabled in apps and UI despite the base config

### ESLint

Three config presets exported from `@repo/eslint-config`:
- `base` — JS + TypeScript ESLint + Prettier + Turbo rules
- `next-js` — extends base, adds React/React Hooks/Next.js plugins
- `react-internal` — extends base, adds React/React Hooks (no Next.js plugin)

Lint runs with `--max-warnings 0`; all lint issues are treated as errors in CI.
