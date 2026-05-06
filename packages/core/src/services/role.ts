import { API } from "../api/connection/api.js";
import type { PermissionKeyValue } from "../constants/services/role/permissions.js";
import type {
	CreateRoleDTO,
	RoleDTO,
	SetRolePermissionsDTO,
	UpdateRoleDTO,
} from "../models/role.js";

const base = (companyId: string) => `/company/${companyId}/role`;

export const roleService = {
	list: (companyId: string) => API.get<RoleDTO[]>(base(companyId)),

	getPermissions: (companyId: string, roleId: string) =>
		API.get<PermissionKeyValue[]>(`${base(companyId)}/${roleId}/permissions`),

	create: (companyId: string, data: CreateRoleDTO) =>
		API.post<RoleDTO>(base(companyId), data),

	update: (companyId: string, roleId: string, data: UpdateRoleDTO) =>
		API.put<RoleDTO>(`${base(companyId)}/${roleId}`, data),

	setPermissions: (
		companyId: string,
		roleId: string,
		data: SetRolePermissionsDTO
	) => API.put<void>(`${base(companyId)}/${roleId}/permissions`, data),

	delete: (companyId: string, roleId: string) =>
		API.delete<void>(`${base(companyId)}/${roleId}`),
};
