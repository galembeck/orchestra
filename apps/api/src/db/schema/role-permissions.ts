import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
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
	(table) => [
		uniqueIndex("role_permission_unique").on(
			table.roleId,
			table.permissionKey,
		),
	],
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
