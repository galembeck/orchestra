import type { DatabaseClient } from "@orchestra/database/factory";
import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { BadRequestError, ForbiddenError } from "../errors/app-error.js";

const slugParamsSchema = z.object({ slug: z.string().min(1) });
const memberParamsSchema = z.object({
  memberId: z.string().min(1),
  slug: z.string().min(1),
});
const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "BILLING", "MEMBER"]),
});
const updateMemberJobRolesSchema = z.object({
  jobRoleIds: z.array(z.string().min(1)),
});

export interface MembersRoutesOptions {
  database: DatabaseClient;
}

export const membersRoutes: FastifyPluginCallback<MembersRoutesOptions> = (
  app,
  { database },
  done
) => {
  app.get("/companies/:slug/members", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const { company } = await request.requireMembership(slug);

    const members = await database.member.findMany({
      include: { jobRoles: { include: { jobRole: true } }, user: true },
      where: { companyId: company.id },
    });

    return {
      members: members.map((member) => ({
        email: member.user.email,
        id: member.id,
        jobRoles: member.jobRoles.map(({ jobRole }) => ({
          id: jobRole.id,
          key: jobRole.key,
          slug: jobRole.slug,
        })),
        name: member.user.name,
        role: member.role,
        userId: member.userId,
      })),
    };
  });

  app.patch("/companies/:slug/members/:memberId", async (request) => {
    const { slug, memberId } = memberParamsSchema.parse(request.params);
    const body = updateMemberRoleSchema.parse(request.body);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("manage", "Member")) {
      throw new ForbiddenError(
        "You are not authorized to manage members.",
        "FORBIDDEN"
      );
    }

    const target = await database.member.findFirst({
      where: { companyId: company.id, id: memberId },
    });

    if (!target) {
      throw new BadRequestError(
        "Member not found in this company.",
        "MEMBER_NOT_FOUND"
      );
    }

    if (target.userId === company.ownerId) {
      throw new BadRequestError(
        "The owner's role can only change via ownership transfer.",
        "CANNOT_MODIFY_OWNER"
      );
    }

    const updated = await database.member.update({
      data: { role: body.role },
      where: { id: target.id },
    });

    return { id: updated.id, role: updated.role };
  });

  app.put("/companies/:slug/members/:memberId/job-roles", async (request) => {
    const { slug, memberId } = memberParamsSchema.parse(request.params);
    const body = updateMemberJobRolesSchema.parse(request.body);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("manage", "Member")) {
      throw new ForbiddenError(
        "You are not authorized to manage members.",
        "FORBIDDEN"
      );
    }

    const target = await database.member.findFirst({
      where: { companyId: company.id, id: memberId },
    });

    if (!target) {
      throw new BadRequestError(
        "Member not found in this company.",
        "MEMBER_NOT_FOUND"
      );
    }

    const companySelection = await database.companyJobRole.findMany({
      where: { companyId: company.id },
    });
    const allowedJobRoleIds = new Set(
      companySelection.map((row) => row.jobRoleId)
    );
    const isSubset = body.jobRoleIds.every((jobRoleId) =>
      allowedJobRoleIds.has(jobRoleId)
    );

    if (!isSubset) {
      throw new BadRequestError(
        "One or more job roles are not offered by this company.",
        "JOB_ROLE_NOT_OFFERED"
      );
    }

    await database.$transaction([
      database.memberJobRole.deleteMany({
        where: { memberId: target.id },
      }),
      database.memberJobRole.createMany({
        data: body.jobRoleIds.map((jobRoleId) => ({
          jobRoleId,
          memberId: target.id,
        })),
      }),
    ]);

    return { jobRoleIds: body.jobRoleIds };
  });

  app.delete("/companies/:slug/members/:memberId", async (request, reply) => {
    const { slug, memberId } = memberParamsSchema.parse(request.params);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("manage", "Member")) {
      throw new ForbiddenError(
        "You are not authorized to manage members.",
        "FORBIDDEN"
      );
    }

    const target = await database.member.findFirst({
      where: { companyId: company.id, id: memberId },
    });

    if (!target) {
      throw new BadRequestError(
        "Member not found in this company.",
        "MEMBER_NOT_FOUND"
      );
    }

    if (target.userId === company.ownerId) {
      throw new BadRequestError(
        "The owner cannot be removed from the company.",
        "CANNOT_REMOVE_OWNER"
      );
    }

    await database.member.delete({ where: { id: target.id } });

    return reply.status(204).send();
  });

  done();
};
