import { companies } from "@repo/db/schema/companies.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";

export const rejectCompanyRoute: FastifyPluginAsyncZod = async (app) => {
	app.patch(
		"/companies/:id/reject",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Reject a company registration",
				tags: ["Companies"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string().uuid() }),
				response: {
					204: z.void(),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const [updated] = await app.db
				.update(companies)
				.set({
					approvalStatus: "REJECTED",
					updatedAt: new Date(),
				})
				.where(eq(companies.id, req.params.id))
				.returning({ id: companies.id });

			if (!updated) {
				throw new AppError(404, "Empresa não encontrada.");
			}

			return reply.status(204).send();
		},
	);
};
