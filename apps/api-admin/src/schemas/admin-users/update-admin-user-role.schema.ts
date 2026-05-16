import { z } from "zod";

export const updateAdminUserRoleSchema = z.object({
	roleId: z.string().uuid(),
});

export type UpdateAdminUserRoleInput = z.infer<
	typeof updateAdminUserRoleSchema
>;
