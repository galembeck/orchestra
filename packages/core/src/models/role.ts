import type { PermissionKeyValue } from "src/constants/services/role/permissions.js";

export interface RoleDTO {
	companyId: string | null;
	description: string | null;
	id: string;
	isSystem: boolean;
	key: string;
	name: string;
}

export interface CreateRoleDTO {
	description?: string;
	name: string;
	permissions: PermissionKeyValue[];
}

export interface UpdateRoleDTO {
	description?: string;
	name?: string;
}

export interface SetRolePermissionsDTO {
	permissions: PermissionKeyValue[];
}
