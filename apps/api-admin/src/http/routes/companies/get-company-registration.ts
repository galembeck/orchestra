import { companies } from "@repo/db/schema/companies.js";
import { users } from "@repo/db/schema/users.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";

export const getCompanyRegistrationRoute: FastifyPluginAsyncZod = async (
	app,
) => {
	app.get(
		"/companies/:id/registration",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Get full company registration details",
				tags: ["Companies"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string().uuid() }),
				response: {
					200: z.object({
						id: z.string().uuid(),
						fantasyName: z.string(),
						socialReason: z.string(),
						cnpj: z.string(),
						slug: z.string(),
						approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
						approvedAt: z.string().nullable(),
						zipCode: z.string().nullable(),
						street: z.string().nullable(),
						number: z.string().nullable(),
						complement: z.string().nullable(),
						neighborhood: z.string().nullable(),
						city: z.string().nullable(),
						state: z.string().nullable(),
						createdAt: z.string(),
						updatedAt: z.string(),
						ownerName: z.string(),
						ownerEmail: z.string(),
						ownerPhone: z.string().nullable(),
					}),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const [row] = await app.db
				.select({
					id: companies.id,
					fantasyName: companies.fantasyName,
					socialReason: companies.socialReason,
					cnpj: companies.cnpj,
					slug: companies.slug,
					approvalStatus: companies.approvalStatus,
					approvedAt: companies.approvedAt,
					zipCode: companies.zipCode,
					street: companies.street,
					number: companies.number,
					complement: companies.complement,
					neighborhood: companies.neighborhood,
					city: companies.city,
					state: companies.state,
					createdAt: companies.createdAt,
					updatedAt: companies.updatedAt,
					ownerName: users.name,
					ownerEmail: users.email,
					ownerPhone: users.phone,
				})
				.from(companies)
				.innerJoin(users, eq(companies.ownerId, users.id))
				.where(eq(companies.id, req.params.id));

			if (!row) {
				throw new AppError(404, "Empresa não encontrada.");
			}

			return reply.status(200).send({
				...row,
				approvedAt: row.approvedAt?.toISOString() ?? null,
				createdAt: row.createdAt.toISOString(),
				updatedAt: row.updatedAt.toISOString(),
			});
		},
	);
};
