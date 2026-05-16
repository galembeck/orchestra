import type { AccountType } from "@core/types/enums/account-type.js";
import type { ProfileType } from "src/types/enums/profile-type.js";
import type { AddressDTO } from "./commom/address.model.js";

export interface CreateUserDTO extends AddressDTO {
	acceptTerms: boolean;
	cellphone: string;
	document: string;
	email: string;
	name: string;
	password: string;
}

export interface PrivateUserDTO {
	cellphone: string;
	document: string;
	email: string;
	lastAccessAt?: string;
	name: string;
	password: string;
	profileType?: ProfileType;
}

export interface PublicUserDTO {
	accountType: AccountType;
	avatarUrl?: string;
	cellphone: string;
	city: string;
	company?: CompanyContextDTO;
	complement?: string;
	createdAt?: string;
	deletedAt?: string;
	document: string;
	email: string;
	id: string;
	name: string;
	neighborhood: string;
	number: string;
	profileType?: ProfileType;
	state: string;
	street: string;
	updatedAt?: string;
	worker?: WorkerContextDTO;
	zipCode: string;
}

export interface CompanyContextDTO {
	approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
	approvedAt?: string;
	city: string;
	cnpj: string;
	companyId: string;
	fantasyName: string;
	isOwner: boolean;
	slug: string;
	socialReason: string;
	state: string;
}

export interface WorkerContextDTO {
	companyCnpj: string;
	companyFantasyName: string;
	companyId: string;
	companySocialReason: string;
	memberSince: string;
	roleId: string;
	roleKey: string;
	roleName: string;
}

export interface UpdateProfileDTO {
	avatar?: File;
	cellphone?: string;
	document?: string;
	email?: string;
	name?: string;
	password?: string;
	passwordConfirmation?: string;
}

export interface UserAvailabilityResponse {
	documentAvailable: boolean;
	emailAvailable: boolean;
}
