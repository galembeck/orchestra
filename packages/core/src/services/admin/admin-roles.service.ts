import { adminApi } from "../../api/connection/api-admin.js";
import type { AdminRole } from "../../types/admin-user.js";

export const ADMIN_ROLES_QUERY_KEY = ["admin", "roles"] as const;

export const adminRolesQueryOptions = {
	queryKey: ADMIN_ROLES_QUERY_KEY,
	queryFn: () => adminApi.get<AdminRole[]>("/admin-roles"),
	staleTime: 5 * 60 * 1000,
} as const;
