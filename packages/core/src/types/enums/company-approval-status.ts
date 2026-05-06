export const COMPANY_APPROVAL_STATUS = {
	PENDING: 1,
	APPROVED: 2,
	REJECTED: 3,
} as const;

export type CompanyApprovalStatus =
	(typeof COMPANY_APPROVAL_STATUS)[keyof typeof COMPANY_APPROVAL_STATUS];
