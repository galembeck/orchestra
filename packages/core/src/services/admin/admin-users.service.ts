import { adminApi } from "../../api/connection/api-admin.js";
import type {
	AdminUserListItem,
	PermissionMatrix,
} from "../../types/admin-user.js";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export const adminUsersQueryOptions = {
	queryKey: ADMIN_USERS_QUERY_KEY,
	queryFn: () => adminApi.get<AdminUserListItem[]>("/admin-users"),
	staleTime: 30 * 1000,
} as const;

export const updateAdminUserRole = (id: string, roleId: string) =>
	adminApi.patch(`/admin-users/${id}/role`, { roleId });

export const updateAdminUserPermissions = (
	id: string,
	permissionOverrides: Partial<PermissionMatrix> | null
) => adminApi.patch(`/admin-users/${id}/permissions`, { permissionOverrides });

export const updateAdminUserRoleMutationOptions = {
	mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
		updateAdminUserRole(id, roleId),
} as const;

export const updateAdminUserPermissionsMutationOptions = {
	mutationFn: ({
		id,
		permissionOverrides,
	}: {
		id: string;
		permissionOverrides: Partial<PermissionMatrix> | null;
	}) => updateAdminUserPermissions(id, permissionOverrides),
} as const;
