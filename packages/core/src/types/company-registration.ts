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

export type CompanyDocumentType =
	| "CNPJ_DOCUMENT"
	| "ADDRESS_PROOF"
	| "OWNER_IDENTITY"
	| "OPERATING_LICENSE";

export interface CompanyRegistrationDocument {
	createdAt: string;
	downloadUrl: string;
	fileName: string;
	filePath: string;
	id: string;
	mimeType: string;
	type: CompanyDocumentType;
}

export interface CompanyRegistrationDetail {
	approvalStatus: CompanyApprovalStatus;
	approvedAt: string | null;
	city: string | null;
	cnpj: string;
	complement: string | null;
	createdAt: string;
	fantasyName: string;
	id: string;
	neighborhood: string | null;
	number: string | null;
	ownerEmail: string;
	ownerName: string;
	ownerPhone: string | null;
	slug: string;
	socialReason: string;
	state: string | null;
	street: string | null;
	updatedAt: string;
	zipCode: string | null;
}
