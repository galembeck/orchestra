import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { users } from "@/db/schema/users.js";
import { hashPassword } from "@/lib/crypto.js";
import { clientRegistrationSchema } from "@/schemas/user/client-registration.schema.js";

export const registerClientRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/register/client",
		{
			schema: {
				summary: "Register a new client account",
				tags: ["Auth"],
				body: clientRegistrationSchema,
				response: {
					201: z.object({ id: z.string().uuid() }),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { name, email, document, cellphone, password, address } = req.body;

			const existing = await app.db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (existing.length > 0) {
				return reply.status(409).send({ message: "E-mail já cadastrado." });
			}

			const passwordHash = await hashPassword(password);

			const [user] = await app.db
				.insert(users)
				.values({
					name,
					email,
					document,
					phone: cellphone,
					passwordHash,
					accountType: "CLIENT",
					profileType: "CLIENT",
					zipCode: address.zipcode,
					street: address.address,
					number: address.number,
					complement: address.complement,
					neighborhood: address.neighborhood,
					city: address.city,
					state: address.state,
				})
				.returning({ id: users.id });

			return reply.status(201).send({ id: user.id });
		},
	);
};
