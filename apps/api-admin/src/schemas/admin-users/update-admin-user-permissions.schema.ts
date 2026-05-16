import { z } from "zod";

export const permissionOverridesSchema = z
	.object({
		companies: z
			.object({
				view: z.boolean().optional(),
				approve: z.boolean().optional(),
				reject: z.boolean().optional(),
			})
			.optional(),
		adminUsers: z
			.object({
				view: z.boolean().optional(),
				create: z.boolean().optional(),
				updateRole: z.boolean().optional(),
				updatePermissions: z.boolean().optional(),
				deactivate: z.boolean().optional(),
			})
			.optional(),
		settings: z
			.object({
				view: z.boolean().optional(),
				edit: z.boolean().optional(),
			})
			.optional(),
	})
	.nullable();

export const updateAdminUserPermissionsSchema = z.object({
	permissionOverrides: permissionOverridesSchema,
});

export type UpdateAdminUserPermissionsInput = z.infer<
	typeof updateAdminUserPermissionsSchema
>;
