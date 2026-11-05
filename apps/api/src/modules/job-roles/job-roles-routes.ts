import type { DatabaseClient } from "@orchestra/database/factory";
import type { FastifyPluginCallback } from "fastify";

export interface JobRolesRoutesOptions {
  database: DatabaseClient;
}

export const jobRolesRoutes: FastifyPluginCallback<JobRolesRoutesOptions> = (
  app,
  { database },
  done
) => {
  app.get("/job-roles", async (request) => {
    await request.requireUser();

    const jobRoles = await database.jobRole.findMany();

    return {
      jobRoles: jobRoles.map((jobRole) => ({
        id: jobRole.id,
        key: jobRole.key,
        slug: jobRole.slug,
      })),
    };
  });

  done();
};
