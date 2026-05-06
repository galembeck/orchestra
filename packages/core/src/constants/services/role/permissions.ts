export const PermissionKey = {
	CompanyRead: "company:read",
	CompanyUpdate: "company:update",
	CompanyDelete: "company:delete",
	CompanyTransferOwnership: "company:transfer-ownership",
	CompanyApprove: "company:approve",
	CompanyReject: "company:reject",

	MemberList: "member:list",
	MemberInvite: "member:invite",
	MemberRevokeInvite: "member:revoke-invite",
	MemberUpdateRole: "member:update-role",
	MemberDelete: "member:delete",

	ProjectList: "project:list",
	ProjectCreate: "project:create",
	ProjectUpdate: "project:update",
	ProjectDelete: "project:delete",

	BillingRead: "billing:read",
	BillingExport: "billing:export",

	RoleRead: "role:read",
	RoleCreate: "role:create",
	RoleUpdate: "role:update",
	RoleDelete: "role:delete",
} as const;

export type PermissionKeyValue =
	(typeof PermissionKey)[keyof typeof PermissionKey];
