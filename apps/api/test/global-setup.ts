import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import type { TestProject } from "vitest/node";

const MIGRATIONS_DIRECTORY = fileURLToPath(
  new URL("../../../packages/database/prisma/migrations/", import.meta.url)
);
const MAX_TEST_CONNECTIONS = 10;
const LOOPBACK_HOST = "127.0.0.1";

declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}

const findFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, LOOPBACK_HOST, () => {
      const address = probe.address();
      probe.close(() => {
        if (address && typeof address === "object") {
          resolve(address.port);
          return;
        }
        reject(new Error("Could not allocate a port for the test database."));
      });
    });
  });

const applyMigrations = async (database: PGlite) => {
  const entries = await readdir(MIGRATIONS_DIRECTORY, { withFileTypes: true });
  const migrations = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const scripts = await Promise.all(
    migrations.map((migration) =>
      readFile(join(MIGRATIONS_DIRECTORY, migration, "migration.sql"), "utf8")
    )
  );

  await database.exec(scripts.join("\n"));
};

export default async function setup(project: TestProject) {
  const database = await PGlite.create();
  await applyMigrations(database);

  const port = await findFreePort();
  const server = new PGLiteSocketServer({
    db: database,
    host: LOOPBACK_HOST,
    maxConnections: MAX_TEST_CONNECTIONS,
    port,
  });
  await server.start();

  project.provide(
    "databaseUrl",
    `postgresql://postgres:postgres@${LOOPBACK_HOST}:${port}/postgres?sslmode=disable`
  );

  return async () => {
    await server.stop();
    await database.close();
  };
}
