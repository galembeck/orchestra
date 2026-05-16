export const COMPANY_APPROVAL_STATUS = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
} as const;

export type CompanyApprovalStatus =
	(typeof COMPANY_APPROVAL_STATUS)[keyof typeof COMPANY_APPROVAL_STATUS];
