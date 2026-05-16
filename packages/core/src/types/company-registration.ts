import type { CompanyApprovalStatus } from "./enums/company-approval-status.js";

export interface CompanyRegistrationItem {
	approvalStatus: CompanyApprovalStatus;
	city: string;
	cnpj: string;
	createdAt: string;
	fantasyName: string;
	id: string;
	ownerEmail: string;
	ownerName: string;
	ownerPhone: string | null;
	socialReason: string;
	state: string;
}
