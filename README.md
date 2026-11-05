# Orchestra

Turborepo monorepo: Next.js web app (`apps/web`), Fastify API (`apps/api`), and shared packages (`packages/*`).

## Requirements

- Node.js 26.13+ and pnpm 12.16+
- Docker (for Postgres and Mailpit in development)

## Getting started

```sh
pnpm install
cp .env.example .env
openssl rand -base64 32   # paste into BETTER_AUTH_SECRET
pnpm db:up                # Postgres on :5432, Mailpit on :1025 (inbox at http://localhost:8025)
pnpm db:migrate
pnpm dev                  # web on :3000, API on :3333
```

## Authentication

Authentication uses [Better Auth](https://www.better-auth.com) inside the API at `/api/auth/*`. The web app proxies that path to the API (see `apps/web/next.config.ts`), so the browser only talks to its own origin and session cookies stay first-party.

- **Email and password**: users must verify their email before signing in. Verification emails are sent over SMTP (Mailpit in development) in the visitor's language.
- **Google**: set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. The authorized redirect URI is `${WEB_URL}/api/auth/callback/google`. Google only creates accounts from the sign-up page, after the terms and age confirmations.
- **Consent**: every user stores `terms_accepted_at`, `terms_version` and `adult_confirmed_at`. The API rejects any account creation without them.
- **Validation**: the zod schemas in `packages/shared/src/schemas/auth.ts` run in the browser and again in the API.
- **Rate limiting**: stored in Postgres, stricter on sign-in, sign-up and verification emails. Set `TRUSTED_PROXY_HOPS` to the number of proxies in front of the API (1 for the Next.js proxy) so client IPs can't be spoofed.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run every app in watch mode |
| `pnpm test` | Unit and integration tests (the API suite runs against an embedded Postgres, no Docker needed) |
| `pnpm check-types` | Type-check every package |
| `pnpm lint` / `pnpm format` | Ultracite (Biome) check / fix |
| `pnpm db:migrate` | Create and apply migrations in development |
| `pnpm db:deploy` | Apply pending migrations in production |
