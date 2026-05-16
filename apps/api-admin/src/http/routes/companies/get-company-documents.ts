import { companies } from "@repo/db/schema/companies.js";
import { companyDocuments } from "@repo/db/schema/company-documents.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { env } from "@/lib/env.js";
import { AppError } from "@/lib/errors.js";

export const getCompanyDocumentsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/companies/:id/documents",
		{
			preHandler: [authenticate],
			schema: {
				summary: "List documents for a company registration",
				tags: ["Companies"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string().uuid() }),
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							type: z.enum([
								"CNPJ_DOCUMENT",
								"ADDRESS_PROOF",
								"OWNER_IDENTITY",
								"OPERATING_LICENSE",
							]),
							fileName: z.string(),
							filePath: z.string(),
							mimeType: z.string(),
							downloadUrl: z.string().url(),
							createdAt: z.string(),
						}),
					),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const [company] = await app.db
				.select({ id: companies.id })
				.from(companies)
				.where(eq(companies.id, req.params.id));

			if (!company) {
				throw new AppError(404, "Empresa não encontrada.");
			}

			const docs = await app.db
				.select({
					id: companyDocuments.id,
					type: companyDocuments.type,
					fileName: companyDocuments.fileName,
					filePath: companyDocuments.filePath,
					mimeType: companyDocuments.mimeType,
					createdAt: companyDocuments.createdAt,
				})
				.from(companyDocuments)
				.where(eq(companyDocuments.companyId, req.params.id))
				.orderBy(companyDocuments.createdAt);

			return reply.status(200).send(
				docs.map((doc) => ({
					...doc,
					downloadUrl: `${env.FILES_BASE_URL}${doc.filePath}`,
					createdAt: doc.createdAt.toISOString(),
				})),
			);
		},
	);
};
