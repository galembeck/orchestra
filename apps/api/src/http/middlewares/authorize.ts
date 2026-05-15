import { and, eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import { companyMembers, rolePermissions } from "@/db/schema/index.js";
import type { PermissionKeyValue } from "@/types/permissions.js";

export function requirePermission(permission: PermissionKeyValue) {
	return async (
		req: FastifyRequest<{ Params: { companyId?: string } }>,
		reply: FastifyReply
	): Promise<void> => {
		const userId = req.user.sub;
		const companyId = req.params.companyId;

		if (!companyId) {
			reply.status(400).send({ message: "companyId param required" });
			return;
		}

		const member = await req.server.db
			.select({
				roleId: companyMembers.roleId,
				isOwner: companyMembers.isOwner,
			})
			.from(companyMembers)
			.where(
				and(
					eq(companyMembers.userId, userId),
					eq(companyMembers.companyId, companyId)
				)
			)
			.limit(1);

		if (member.length === 0) {
			reply.status(403).send({ message: "Forbidden" });
			return;
		}

		// Owners bypass all permission checks
		if (member[0].isOwner) {
			return;
		}

		const roleId = member[0].roleId;
		if (!roleId) {
			reply.status(403).send({ message: "Forbidden" });
			return;
		}

		const perm = await req.server.db
			.select({ id: rolePermissions.id })
			.from(rolePermissions)
			.where(
				and(
					eq(rolePermissions.roleId, roleId),
					eq(rolePermissions.permissionKey, permission)
				)
			)
			.limit(1);

		if (perm.length === 0) {
			reply.status(403).send({ message: "Forbidden" });
		}
	};
}
