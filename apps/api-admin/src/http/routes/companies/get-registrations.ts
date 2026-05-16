import { companies } from "@repo/db/schema/companies.js";
import { users } from "@repo/db/schema/users.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getCompanyRegistrationsRoute: FastifyPluginAsyncZod = async (
	app,
) => {
	app.get(
		"/companies/registrations",
		{
			preHandler: [authenticate],
			schema: {
				summary: "List all company registrations",
				tags: ["Companies"],
				security: [{ cookieAuth: [] }],
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							fantasyName: z.string(),
							socialReason: z.string(),
							cnpj: z.string(),
							ownerName: z.string(),
							ownerEmail: z.string(),
							ownerPhone: z.string().nullable(),
							city: z.string().nullable(),
							state: z.string().nullable(),
							createdAt: z.string(),
							approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
						}),
					),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (_req, reply) => {
			const rows = await app.db
				.select({
					id: companies.id,
					fantasyName: companies.fantasyName,
					socialReason: companies.socialReason,
					cnpj: companies.cnpj,
					approvalStatus: companies.approvalStatus,
					city: companies.city,
					state: companies.state,
					createdAt: companies.createdAt,
					ownerName: users.name,
					ownerEmail: users.email,
					ownerPhone: users.phone,
				})
				.from(companies)
				.innerJoin(users, eq(companies.ownerId, users.id))
				.orderBy(companies.createdAt);

			return reply.status(200).send(
				rows.map((row) => ({
					...row,
					createdAt: row.createdAt.toISOString(),
				})),
			);
		},
	);
};
