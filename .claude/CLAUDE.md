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

## Code Standards (Ultracite)

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

```bash
pnpm dlx ultracite fix    # Format and auto-fix issues
pnpm dlx ultracite check  # Check for issues
pnpm dlx ultracite doctor # Diagnose setup
```

Biome is the underlying engine. Most issues are automatically fixable. Run `pnpm dlx ultracite fix` before committing.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers — extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions
- Use `async/await` over promise chains
- Handle errors with try-catch in async code; don't use async functions as Promise executors

### React & JSX

- Function components only, no class components
- Hooks at the top level only, never conditionally; specify all dependencies in arrays
- Use unique IDs (not indices) as `key` props in iterables
- Don't define components inside other components
- Semantic HTML and ARIA attributes: alt text, heading hierarchy, input labels, keyboard handlers alongside mouse events

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` from production code
- Throw `Error` objects with descriptive messages, not strings
- Prefer early returns over nested conditionals

### Code Organization

- Keep functions focused; extract complex conditions into well-named boolean variables
- Prefer simple conditionals over nested ternary operators

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Avoid barrel files (index files that re-export everything)
- Use Next.js `<Image>` over `<img>` tags; use Server Components for async data fetching

### Testing

- Write assertions inside `it()` or `test()` blocks
- Use async/await, not done callbacks
- Don't commit `.only` or `.skip`

### Responsive Design

- Every component must work correctly on both mobile and desktop viewports
- Use Tailwind's responsive prefixes with a **mobile-first** approach (`lg:`, `md:`, `sm:`)
- Navigation components must provide a mobile-friendly alternative (e.g., hamburger menu with `lg:hidden` / `hidden lg:flex`)
- Avoid fixed pixel widths; prefer `w-full`, `max-w-*`, or flexible layouts
- Test at minimum: mobile (< 640 px), tablet (640–1024 px), desktop (> 1024 px)

## Component Development Standards

### Atomic Design

Components in `packages/ui` follow Atomic Design hierarchy:

```
src/components/
  atoms/       → Smallest building blocks (Button, Input, Badge…)
  molecules/   → Composed of atoms (Logo, FormField, Card…)
  organisms/   → Complex sections composed of molecules (Navbar, Footer, Hero…)
```

Every new component must:
1. Live in its own directory matching the hierarchy: `src/components/<level>/<name>/<name>.tsx`
2. Export a named function component and its props interface
3. Accept a `className` prop via `ComponentProps<"element">` so callers can extend styles
4. Use design-token utility classes (`bg-surface`, `text-foreground-primary`, etc.) — never raw color values
5. Be responsive by default using the mobile-first Tailwind approach
6. Come with a co-located story file: `<name>.stories.tsx`

### Storybook

Run Storybook for the UI package:

```bash
cd packages/ui
pnpm storybook        # dev server on port 6006
pnpm build-storybook  # static build
```

Every component **must** have a story file next to its source file. Story requirements:

- Use CSF3 format with `satisfies Meta<typeof Component>`
- Add `tags: ["autodocs"]` to auto-generate documentation from props
- Set `layout: "centered"` for atoms/molecules, `layout: "fullscreen"` for organisms
- Define `argTypes` with `control`, `description`, and `table.defaultValue` for every public prop
- Export a named story for each meaningful visual state (e.g. `Primary`, `Secondary`, `Disabled`, `AllVariants`)
- Components that depend on a router (TanStack Router `Link`) must use the `withRouter` decorator pattern — see `navbar.stories.tsx`

### Theme toggle

Storybook includes a **Theme** toolbar button (paintbrush icon) that switches between `light` and `dark` by toggling the `.dark` class on `<html>`. Dark-mode color overrides are defined in `src/styles.css` and follow the same token names as the light palette.

To verify dark mode during development, click the Theme button in the Storybook toolbar.
