import { randomBytes } from "node:crypto";
import type { DatabaseClient } from "@orchestra/database/factory";
import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import type { AppConfig } from "../../config.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors/app-error.js";
import type { Mailer } from "../mail/mailer.js";
import { localizePath, resolveLocale } from "../mail/resolve-locale.js";
import { renderInviteEmail } from "../mail/templates/invite-emails.js";

const INVITE_TOKEN_BYTES = 24;
const DAYS_UNTIL_EXPIRY = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const generateInviteToken = () =>
  randomBytes(INVITE_TOKEN_BYTES).toString("base64url");

const createInviteExpiry = () =>
  new Date(Date.now() + DAYS_UNTIL_EXPIRY * MILLISECONDS_PER_DAY);

const slugParamsSchema = z.object({ slug: z.string().min(1) });
const inviteParamsSchema = z.object({
  inviteId: z.string().min(1),
  slug: z.string().min(1),
});
const tokenParamsSchema = z.object({ token: z.string().min(1) });
const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "BILLING", "MEMBER"]),
});

export interface InvitesRoutesOptions {
  config: AppConfig;
  database: DatabaseClient;
  mailer: Mailer;
}

export const invitesRoutes: FastifyPluginCallback<InvitesRoutesOptions> = (
  app,
  { config, database, mailer },
  done
) => {
  app.post("/companies/:slug/invites", async (request, reply) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const body = createInviteSchema.parse(request.body);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("manage", "Invite")) {
      throw new ForbiddenError(
        "You are not authorized to manage invites.",
        "FORBIDDEN"
      );
    }

    const existing = await database.invite.findUnique({
      where: {
        email_companyId: { companyId: company.id, email: body.email },
      },
    });

    if (
      existing &&
      existing.status === "PENDING" &&
      existing.expiresAt > new Date()
    ) {
      throw new ConflictError(
        "An invite for this email is already pending.",
        "INVITE_ALREADY_PENDING"
      );
    }

    const token = generateInviteToken();
    const expiresAt = createInviteExpiry();

    const invite = existing
      ? await database.invite.update({
          data: {
            authorId: caller.userId,
            expiresAt,
            role: body.role,
            status: "PENDING",
            token,
          },
          where: { id: existing.id },
        })
      : await database.invite.create({
          data: {
            authorId: caller.userId,
            companyId: company.id,
            email: body.email,
            expiresAt,
            role: body.role,
            token,
          },
        });

    const locale = resolveLocale({
      headers: fromNodeHeaders(request.headers),
    } as Request);
    const url = new URL(
      localizePath(locale, `/invites/${token}/accept`),
      config.webUrl
    ).toString();

    await mailer.send({
      to: body.email,
      ...renderInviteEmail({ companyName: company.name, locale, url }),
    });

    return reply.status(201).send({ id: invite.id });
  });

  app.get("/companies/:slug/invites", async (request) => {
    const { slug } = slugParamsSchema.parse(request.params);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("get", "Invite")) {
      throw new ForbiddenError(
        "You are not authorized to view invites.",
        "FORBIDDEN"
      );
    }

    const invites = await database.invite.findMany({
      where: {
        companyId: company.id,
        expiresAt: { gt: new Date() },
        status: "PENDING",
      },
    });

    return {
      invites: invites.map((invite) => ({
        email: invite.email,
        id: invite.id,
        role: invite.role,
      })),
    };
  });

  app.delete("/companies/:slug/invites/:inviteId", async (request, reply) => {
    const { slug, inviteId } = inviteParamsSchema.parse(request.params);
    const { company, member: caller } = await request.requireMembership(slug);

    const { cannot } = getUserPermissions(caller.userId, caller.role);
    if (cannot("manage", "Invite")) {
      throw new ForbiddenError(
        "You are not authorized to manage invites.",
        "FORBIDDEN"
      );
    }

    const invite = await database.invite.findFirst({
      where: { companyId: company.id, id: inviteId },
    });

    if (!invite) {
      throw new NotFoundError("Invite not found.", "INVITE_NOT_FOUND");
    }

    await database.invite.update({
      data: { status: "REVOKED" },
      where: { id: invite.id },
    });

    return reply.status(204).send();
  });

  app.post("/invites/:token/accept", async (request, reply) => {
    const { token } = tokenParamsSchema.parse(request.params);
    const user = await request.requireUser();

    const invite = await database.invite.findFirst({
      where: { status: "PENDING", token },
    });

    if (!invite) {
      throw new NotFoundError("Invite not found.", "INVITE_NOT_FOUND");
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestError("This invite has expired.", "INVITE_EXPIRED");
    }

    if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestError(
        "This invite was sent to a different email address.",
        "INVITE_EMAIL_MISMATCH"
      );
    }

    const existingMembership = await database.member.findUnique({
      where: { userId: user.id },
    });

    if (existingMembership) {
      throw new BadRequestError(
        "You already belong to a company.",
        "ALREADY_HAS_COMPANY"
      );
    }

    await database.$transaction([
      database.member.create({
        data: {
          companyId: invite.companyId,
          role: invite.role,
          userId: user.id,
        },
      }),
      database.invite.update({
        data: { status: "ACCEPTED" },
        where: { id: invite.id },
      }),
    ]);

    return reply.status(204).send();
  });

  done();
};
