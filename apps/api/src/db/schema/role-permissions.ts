import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { roles } from "./roles.js";

export const rolePermissions = pgTable(
	"role_permissions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionKey: varchar("permission_key", { length: 100 }).notNull(),
	},
	(t) => [unique("role_permissions_role_key_unique").on(t.roleId, t.permissionKey)],
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
