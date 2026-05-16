import { companies } from "@repo/db/schema/companies.js";
import { companyMembers } from "@repo/db/schema/company-members.js";
import { roles } from "@repo/db/schema/roles.js";
import { users } from "@repo/db/schema/users.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { notFound } from "@/lib/errors.js";

const companyContextSchema = z.object({
	companyId: z.string().uuid(),
	fantasyName: z.string(),
	slug: z.string(),
	socialReason: z.string(),
	cnpj: z.string().nullable(),
	approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
	isOwner: z.boolean(),
	city: z.string().nullable(),
	state: z.string().nullable(),
});

const workerContextSchema = z.object({
	companyId: z.string().uuid(),
	companyFantasyName: z.string(),
	companySocialReason: z.string(),
	companyCnpj: z.string().nullable(),
	isOwner: z.boolean(),
	memberSince: z.string(),
	roleId: z.string().uuid().nullable(),
	roleKey: z.string().nullable(),
	roleName: z.string().nullable(),
});

const getMeResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string(),
	document: z.string().nullable(),
	cellphone: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	accountType: z.enum(["CLIENT", "WORKER", "OWNER"]),
	profileType: z.enum(["ADMIN", "CLIENT", "PLATFORM_DEVELOPER"]),
	zipcode: z.string().nullable(),
	address: z.string().nullable(),
	number: z.string().nullable(),
	complement: z.string().nullable(),
	neighborhood: z.string().nullable(),
	city: z.string().nullable(),
	state: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	company: companyContextSchema.optional(),
	worker: workerContextSchema.optional(),
});

export const getMeRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/user/me",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Get the authenticated user's profile",
				tags: ["Users"],
				security: [{ cookieAuth: [] }],
				response: {
					200: getMeResponseSchema,
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const userId = req.user.sub;

			const [user] = await app.db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					document: users.document,
					phone: users.phone,
					avatarUrl: users.avatarUrl,
					accountType: users.accountType,
					profileType: users.profileType,
					zipCode: users.zipCode,
					street: users.street,
					number: users.number,
					complement: users.complement,
					neighborhood: users.neighborhood,
					city: users.city,
					state: users.state,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				})
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			if (!user) {
				throw notFound("User");
			}

			const [membership] = await app.db
				.select({
					isOwner: companyMembers.isOwner,
					companyId: companyMembers.companyId,
					memberSince: companyMembers.createdAt,
					roleId: companyMembers.roleId,
					companyFantasyName: companies.fantasyName,
					companySlug: companies.slug,
					companySocialReason: companies.socialReason,
					companyDocument: companies.cnpj,
					approvalStatus: companies.approvalStatus,
					companyCity: companies.city,
					companyState: companies.state,
					roleKey: roles.key,
					roleName: roles.name,
				})
				.from(companyMembers)
				.innerJoin(companies, eq(companyMembers.companyId, companies.id))
				.leftJoin(roles, eq(companyMembers.roleId, roles.id))
				.where(eq(companyMembers.userId, userId))
				.limit(1);

			const base = {
				id: user.id,
				name: user.name,
				email: user.email,
				document: user.document ?? null,
				cellphone: user.phone ?? null,
				avatarUrl: user.avatarUrl ?? null,
				accountType: user.accountType,
				profileType: user.profileType,
				zipcode: user.zipCode ?? null,
				address: user.street ?? null,
				number: user.number ?? null,
				complement: user.complement ?? null,
				neighborhood: user.neighborhood ?? null,
				city: user.city ?? null,
				state: user.state ?? null,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			};

			if (!membership) {
				return reply.send(base);
			}

			if (membership.isOwner || user.accountType === "OWNER") {
				return reply.send({
					...base,
					company: {
						companyId: membership.companyId,
						fantasyName: membership.companyFantasyName,
						slug: membership.companySlug,
						socialReason: membership.companySocialReason,
						cnpj: membership.companyDocument ?? null,
						approvalStatus: membership.approvalStatus,
						isOwner: membership.isOwner,
						city: membership.companyCity ?? null,
						state: membership.companyState ?? null,
					},
				});
			}

			return reply.send({
				...base,
				worker: {
					companyId: membership.companyId,
					companyFantasyName: membership.companyFantasyName,
					companySocialReason: membership.companySocialReason,
					companyCnpj: membership.companyDocument ?? null,
					isOwner: membership.isOwner,
					memberSince: membership.memberSince.toISOString(),
					roleId: membership.roleId ?? null,
					roleKey: membership.roleKey ?? null,
					roleName: membership.roleName ?? null,
				},
			});
		},
	);
};
