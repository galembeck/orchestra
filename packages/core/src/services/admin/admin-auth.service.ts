import { adminApi } from "../../api/connection/api-admin.js";
import type { PublicUserDTO } from "../../models/user.model.js";

export const ADMIN_AUTH_QUERY_KEY = ["admin-auth", "me"] as const;

export const adminAuthQueryOptions = {
	queryKey: ADMIN_AUTH_QUERY_KEY,
	queryFn: () => adminApi.get<PublicUserDTO>("/user/me"),
	staleTime: 5 * 60 * 1000,
} as const;
