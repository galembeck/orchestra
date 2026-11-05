import { env } from "@orchestra/env/server";
import {
  createPrismaClient,
  type DatabaseClient,
} from "./create-prisma-client.js";

const globalForPrisma = globalThis as unknown as {
  prisma?: DatabaseClient;
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient({
    connectionString: env.DATABASE_URL,
    logQueries: env.NODE_ENV === "development",
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
