import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

// The monorepo keeps a single .env at the root. Load it when present so
// `prisma migrate`/`studio` work without exporting DATABASE_URL by hand.
const rootEnvFile = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

export default defineConfig({
  datasource: {
    // Optional for `prisma generate`; required for migrate, push and studio.
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
});
