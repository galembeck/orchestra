import type { CompanyApprovalStatus } from "src/types/enums/company-approval-status.js";
import type { CompanyDocumentType } from "src/types/enums/company-document-type.js";
import type { CompanySchedule } from "src/types/enums/company-schedule.js";
import type { Segment } from "src/types/enums/segment.js";
import type { ServiceType } from "src/types/enums/service-type.js";
import type { TeamSize } from "src/types/enums/team-size.js";
import type { AddressDTO } from "./commom/address.model.js";

export interface CompanyMemberDTO {
	avatarUrl?: string | null;
	companyId: string;
	createdAt: string;
	email: string;
	id: string;
	isOwner: boolean;
	lastAccessAt?: string | null;
	name: string;
	roleId: string;
	roleKey?: string | null;
	roleName?: string | null;
	userId: string;
}

export interface CompanyInvitationDTO {
	acceptedAt?: string | null;
	companyId: string;
	email: string;
	expiresAt: string;
	id: string;
	roleKey: string;
	token: string;
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
	slug: string;
	socialReason: string;

	// Onboarding configuration
	openingHour?: string;
	closingHour?: string;
	teamSize?: TeamSize;
	serviceRadius?: number;
	serviceTypes?: ServiceType[];
	schedule?: CompanySchedule;
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
	ownerCellphone: string;
	ownerDocument: string;
	ownerEmail: string;
	ownerIdentity: File;
	ownerName: string;
	ownerPassword: string;
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

export interface UpdateCompanyConfigurationDTO {
	openingHour?: string;
	closingHour?: string;
	teamSize?: TeamSize;
	serviceRadius?: number;
	serviceTypes?: ServiceType[];
	schedule?: CompanySchedule;
}

export interface CompanyDocumentDTO {
	createdAt: string;
	fileName: string;
	fileUrl: string;
	id: string;
	type: CompanyDocumentType;
}
