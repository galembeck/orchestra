export interface PermissionMatrix {
	adminUsers: {
		view: boolean;
		create: boolean;
		updateRole: boolean;
		updatePermissions: boolean;
		deactivate: boolean;
	};
	companies: { view: boolean; approve: boolean; reject: boolean };
	settings: { view: boolean; edit: boolean };
}

export interface AdminRole {
	description: string | null;
	id: string;
	key: string;
	name: string;
	permissions: PermissionMatrix;
}

export interface AdminUserListItem {
	avatarUrl: string | null;
	createdAt: string;
	email: string;
	id: string;
	isActive: boolean;
	name: string;
	permissionOverrides: Partial<PermissionMatrix> | null;
	registration: string;
	role: { id: string; key: string; name: string } | null;
}
