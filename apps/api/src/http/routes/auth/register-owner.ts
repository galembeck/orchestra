import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { companies } from "@/db/schema/companies.js";
import { companyDocuments } from "@/db/schema/company-documents.js";
import { companyMembers } from "@/db/schema/company-members.js";
import { users } from "@/db/schema/users.js";
import { hashPassword } from "@/lib/crypto.js";
import { UPLOAD_DIR } from "@/lib/paths.js";
import { ownerRegistrationSchema } from "@/schemas/user/owner-registration.schema.js";

const FIELD_TO_DOC_TYPE = {
	cnpjDocument: "CNPJ_DOCUMENT",
	addressProof: "ADDRESS_PROOF",
	ownerIdentity: "OWNER_IDENTITY",
	operatingLicense: "OPERATING_LICENSE",
} as const;

type DocumentFieldName = keyof typeof FIELD_TO_DOC_TYPE;

interface UploadedFile {
	buffer: Buffer;
	filename: string;
	mimetype: string;
}

export const registerOwnerRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/register/owner",
		{
			schema: {
				summary: "Register a new company owner account",
				tags: ["Auth"],
				consumes: ["multipart/form-data"],
				response: {
					201: z.object({
						userId: z.string().uuid(),
						companyId: z.string().uuid(),
						companySlug: z.string(),
					}),
					400: z.object({ message: z.string() }),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			let bodyData: unknown;
			const uploadedFiles: Record<string, UploadedFile> = {};

			for await (const part of req.parts({
				limits: { fileSize: 10 * 1024 * 1024 },
			})) {
				if (part.type === "file") {
					const buffer = await part.toBuffer();
					uploadedFiles[part.fieldname] = {
						buffer,
						filename: part.filename,
						mimetype: part.mimetype,
					};
				} else if (part.fieldname === "data") {
					try {
						bodyData = JSON.parse(part.value as string);
					} catch {
						return reply.status(400).send({ message: "Payload inválido." });
					}
				}
			}

			const parsed = ownerRegistrationSchema.safeParse(bodyData);
			if (!parsed.success) {
				return reply.status(400).send({ message: "Dados inválidos." });
			}

			const { name, email, document, cellphone, password, company } =
				parsed.data;

			const companySlug = company.fantasyName
				.toLowerCase()
				.normalize("NFD")
				.replace(/[̀-ͯ]/g, "")
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

			const [existingUser] = await app.db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (existingUser) {
				return reply.status(409).send({ message: "E-mail já cadastrado." });
			}

			const [existingCompany] = await app.db
				.select({ id: companies.id })
				.from(companies)
				.where(eq(companies.cnpj, company.cnpj))
				.limit(1);

			if (existingCompany) {
				return reply.status(409).send({ message: "CNPJ já cadastrado." });
			}

			const passwordHash = await hashPassword(password);

			const result = await app.db.transaction(async (tx) => {
				const [user] = await tx
					.insert(users)
					.values({
						name,
						email,
						document,
						phone: cellphone,
						passwordHash,
						accountType: "OWNER",
						profileType: "CLIENT",
					})
					.returning({ id: users.id });

				const [createdCompany] = await tx
					.insert(companies)
					.values({
						fantasyName: company.fantasyName,
						socialReason: company.socialReason,
						slug: companySlug,
						cnpj: company.cnpj,
						ownerId: user.id,
						approvalStatus: "PENDING",
						zipCode: company.zipcode,
						street: company.address,
						number: company.number,
						complement: company.complement,
						neighborhood: company.neighborhood,
						city: company.city,
						state: company.state,
					})
					.returning({ id: companies.id, slug: companies.slug });

				await tx.insert(companyMembers).values({
					userId: user.id,
					companyId: createdCompany.id,
					isOwner: true,
				});

				return {
					userId: user.id,
					companyId: createdCompany.id,
					companySlug: createdCompany.slug,
				};
			});

			const companyUploadDir = path.join(
				UPLOAD_DIR,
				"companies",
				result.companyId,
			);
			await mkdir(companyUploadDir, { recursive: true });

			for (const [fieldname, file] of Object.entries(uploadedFiles)) {
				const docType =
					FIELD_TO_DOC_TYPE[fieldname as DocumentFieldName] ?? null;
				if (!docType) continue;

				const ext = path.extname(file.filename) || ".bin";
				const storedName = `${docType.toLowerCase()}${ext}`;
				const absolutePath = path.join(companyUploadDir, storedName);
				const publicPath = `/uploads/companies/${result.companyId}/${storedName}`;

				await writeFile(absolutePath, file.buffer);

				await app.db.insert(companyDocuments).values({
					companyId: result.companyId,
					type: docType,
					fileName: file.filename,
					filePath: publicPath,
					mimeType: file.mimetype,
				});
			}

			return reply.status(201).send(result);
		},
	);
};
