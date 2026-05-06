import type { CompanyApprovalStatus } from "src/types/enums/company-approval-status.js";
import type { CompanyDocumentType } from "src/types/enums/company-document-type.js";
import type { Segment } from "src/types/enums/segment.js";
import type { AddressDTO } from "./commom/address.js";

export interface CompanyMemberDTO {
	companyId: string;
	createdAt?: string;
	id: string;
	isOwner: boolean;
	roleId: string;
	updatedAt?: string;
	userId: string;
}

export interface InviteMemberDTO {
	roleId: string;
	userEmail: string;
}

export interface AssignRoleDTO {
	roleId: string;
}

export interface RejectCompanyDTO {
	reason: string;
}

export interface PublicCompanyDTO extends AddressDTO {
	approvalStatus: CompanyApprovalStatus;
	approvedAt?: string;
	approvedBy?: string;
	cnpj: string;
	createdAt: string;
	fantasyName: string;
	id: string;
	ownerUserId: string;
	rejectionReason?: string;
	segment: Segment;
	socialReason: string;
}

export interface RegisterCompanyDTO {
	acceptTerms: boolean;
	address: string;
	addressProof: File;
	city: string;
	cnpj: string;
	cnpjDocument: File;
	complement?: string;
	fantasyName: string;
	neighborhood: string;
	number: string;
	operatingLicense?: File;
	ownerAddress: string;
	ownerCellphone: string;
	ownerCity: string;
	ownerComplement?: string;
	ownerDocument: string;
	ownerEmail: string;
	ownerIdentity: File;
	ownerName: string;
	ownerNeighborhood: string;
	ownerNumber: string;
	ownerPassword: string;
	ownerState: string;
	ownerZipcode: string;
	segment: Segment;
	socialReason: string;
	state: string;
	zipcode: string;
}

export interface UpdateCompanyDTO {
	address?: string;
	city?: string;
	complement?: string;
	fantasyName?: string;
	neighborhood?: string;
	number?: string;
	socialReason?: string;
	state?: string;
	zipcode?: string;
}

export interface CompanyDocumentDTO {
	createdAt: string;
	fileName: string;
	fileUrl: string;
	id: string;
	type: CompanyDocumentType;
}
