import { randomBytes } from "node:crypto";
import type { DatabaseClient } from "@orchestra/database/factory";
import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../errors/app-error.js";

const SLUG_SUFFIX_BYTES = 3;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/(?:^-+|-+$)/gu, "");

const generateUniqueSlug = async (database: DatabaseClient, name: string) => {
  const base = slugify(name);
  const existing = await database.company.findUnique({ where: { slug: base } });

  if (!existing) {
    return base;
  }

  return `${base}-${randomBytes(SLUG_SUFFIX_BYTES).toString("hex")}`;
};

const createCompanySchema = z.object({ name: z.string().min(1) });
const updateCompanySchema = z.object({ name: z.string().min(1) });
const transferOwnershipSchema = z.object({
  newOwnerMemberId: z.string().min(1),
});
const updateJobRolesSchema = z.object({
  jobRoleIds: z.array(z.string().min(1)),
});
const slugParamsSchema = z.object({ slug: z.string().min(1) });

export interface CompaniesRoutesOptions {
  database: DatabaseClient;
}

export const companiesRoutes: FastifyPluginCallback<CompaniesRoutesOptions> = (
  app,
  { database },
  done
) => {
  app.post("/companies", async (request, reply) => {
    const user = await request.requireUser();
    const body = createCompanySchema.parse(request.body);

    const existingMembership = await database.member.findUnique({
      where: { userId: user.id },
    });

    if (existingMembership) {
      throw new ConflictError(
        "You already belong to a company.",
        "ALREADY_HAS_COMPANY"
      );
    }

    const slug = await generateUniqueSlug(database, body.name);

    const company = await database.$transaction(async (tx) => {
      const created = await tx.company.create({
        data: { name: body.name, ownerId: user.id, slug },
      });
      await tx.member.create({
        data: { companyId: created.id, role: "ADMIN", userId: user.id },
      });
      return created;
    });

    return reply.status(201).send({ name: company.name, slug: company.slug });
  });

  app.get("/companies/:slug", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const { company } = await request.requireMembership(slug);

    return { name: company.name, ownerId: company.ownerId, slug: company.slug };
  });

  app.patch("/companies/:slug", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const body = updateCompanySchema.parse(request.body);
    const { company, member } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(member.userId, member.role);
    const authCompany = {
      __typename: "Company" as const,
      id: company.id,
      ownerId: company.ownerId,
    };

    if (cannot("update", authCompany)) {
      throw new ForbiddenError(
        "You are not authorized to update this company.",
        "FORBIDDEN"
      );
    }

    const updated = await database.company.update({
      data: { name: body.name },
      where: { id: company.id },
    });

    return {
      name: updated.name,
      ownerId: updated.ownerId,
      slug: updated.slug,
    };
  });

  app.post("/companies/:slug/transfer-ownership", async (request, reply) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const body = transferOwnershipSchema.parse(request.body);
    const { company, member } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(member.userId, member.role);
    const authCompany = {
      __typename: "Company" as const,
      id: company.id,
      ownerId: company.ownerId,
    };

    if (cannot("transfer_ownership", authCompany)) {
      throw new ForbiddenError(
        "You are not authorized to transfer ownership of this company.",
        "FORBIDDEN"
      );
    }

    const targetMember = await database.member.findFirst({
      where: { companyId: company.id, id: body.newOwnerMemberId },
    });

    if (!targetMember) {
      throw new BadRequestError(
        "Member not found in this company.",
        "MEMBER_NOT_FOUND"
      );
    }

    await database.$transaction([
      database.company.update({
        data: { ownerId: targetMember.userId },
        where: { id: company.id },
      }),
      database.member.update({
        data: { role: "ADMIN" },
        where: { id: targetMember.id },
      }),
      database.member.update({
        data: { role: "ADMIN" },
        where: { id: member.id },
      }),
    ]);

    return reply.status(204).send();
  });

  app.get("/companies/:slug/job-roles", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const { company } = await request.requireMembership(slug);

    const companyJobRoles = await database.companyJobRole.findMany({
      include: { jobRole: true },
      where: { companyId: company.id },
    });

    return {
      jobRoles: companyJobRoles.map(({ jobRole }) => ({
        id: jobRole.id,
        key: jobRole.key,
        slug: jobRole.slug,
      })),
    };
  });

  app.put("/companies/:slug/job-roles", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const body = updateJobRolesSchema.parse(request.body);
    const { company, member } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(member.userId, member.role);
    const authCompany = {
      __typename: "Company" as const,
      id: company.id,
      ownerId: company.ownerId,
    };

    if (cannot("update", authCompany)) {
      throw new ForbiddenError(
        "You are not authorized to update this company.",
        "FORBIDDEN"
      );
    }

    const existingJobRoles = await database.jobRole.findMany({
      where: { id: { in: body.jobRoleIds } },
    });

    if (existingJobRoles.length !== body.jobRoleIds.length) {
      throw new BadRequestError(
        "One or more job roles do not exist.",
        "UNKNOWN_JOB_ROLE"
      );
    }

    await database.$transaction([
      database.companyJobRole.deleteMany({
        where: { companyId: company.id },
      }),
      database.companyJobRole.createMany({
        data: body.jobRoleIds.map((jobRoleId) => ({
          companyId: company.id,
          jobRoleId,
        })),
      }),
    ]);

    return { jobRoleIds: body.jobRoleIds };
  });

  done();
};
