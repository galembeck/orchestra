import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

export interface CreatePrismaClientOptions {
  connectionString: string;
  logQueries?: boolean;
}

export const createPrismaClient = ({
  connectionString,
  logQueries = false,
}: CreatePrismaClientOptions) =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: logQueries ? ["warn", "error"] : ["error"],
  });

export type DatabaseClient = ReturnType<typeof createPrismaClient>;
