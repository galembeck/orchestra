import type { Company, Member } from "@orchestra/database/client";
import type { DatabaseClient } from "@orchestra/database/factory";
import { fromNodeHeaders } from "better-auth/node";
import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import type { Auth } from "../auth/auth.js";
import { NotFoundError, UnauthorizedError } from "../errors/app-error.js";

export interface SessionPluginOptions {
  auth: Auth;
  database: DatabaseClient;
}

declare module "fastify" {
  interface FastifyRequest {
    requireMembership: (
      slug: string
    ) => Promise<{ company: Company; member: Member }>;
    requireUser: () => Promise<{ email: string; id: string }>;
  }
}

export const sessionPlugin = fastifyPlugin(
  (
    app: FastifyInstance,
    { auth, database }: SessionPluginOptions,
    done: (error?: Error) => void
  ) => {
    app.addHook("preHandler", (request, _reply, hookDone) => {
      request.requireUser = async () => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError(
            "Authentication required.",
            "UNAUTHENTICATED"
          );
        }

        return session.user;
      };

      request.requireMembership = async (slug: string) => {
        const { id: userId } = await request.requireUser();

        const member = await database.member.findFirst({
          include: { company: true },
          where: { company: { slug }, userId },
        });

        if (!member) {
          throw new NotFoundError("Company not found.", "COMPANY_NOT_FOUND");
        }

        const { company, ...rest } = member;

        return { company, member: rest };
      };

      hookDone();
    });

    done();
  }
);
