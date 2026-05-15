import { eq, or } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { companies, companyMembers, users } from "@/db/schema/index.js";
import { hashPassword } from "@/lib/crypto.js";
import { ownerRegistrationSchema } from "@/schemas/user/owner-registration.schema.js";

function toSlug(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export const registerOwnerRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/register/owner",
		{
			schema: {
				summary: "Register a new company owner account",
				tags: ["Auth"],
				body: ownerRegistrationSchema,
				response: {
					201: z.object({
						userId: z.string().uuid(),
						companyId: z.string().uuid(),
					}),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { name, email, document, cellphone, password, company } = req.body;

			const existingUser = await app.db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (existingUser.length > 0) {
				return reply.status(409).send({ message: "E-mail já cadastrado." });
			}

			const existingCompany = await app.db
				.select({ id: companies.id })
				.from(companies)
				.where(
					or(
						eq(companies.document, company.document),
						eq(companies.email, company.email),
					),
				)
				.limit(1);

			if (existingCompany.length > 0) {
				return reply
					.status(409)
					.send({ message: "CNPJ ou e-mail da empresa já cadastrado." });
			}

			const passwordHash = await hashPassword(password);

			const baseSlug = toSlug(company.name);

			const result = await app.db.transaction(async (tx) => {
				const [user] = await tx
					.insert(users)
					.values({
						name,
						email,
						document,
						phone: cellphone,
						passwordHash,
						accountType: "COMPANY",
						profileType: "CLIENT",
					})
					.returning({ id: users.id });

				const [createdCompany] = await tx
					.insert(companies)
					.values({
						name: company.name,
						slug: `${baseSlug}-${user.id.slice(0, 8)}`,
						email: company.email,
						phone: company.phone,
						document: company.document,
						segment: company.segment,
						ownerId: user.id,
						approvalStatus: "PENDING",
					})
					.returning({ id: companies.id });

				await tx.insert(companyMembers).values({
					userId: user.id,
					companyId: createdCompany.id,
					isOwner: true,
				});

				return { userId: user.id, companyId: createdCompany.id };
			});

			return reply.status(201).send(result);
		},
	);
};
