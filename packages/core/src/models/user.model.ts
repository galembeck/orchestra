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
	receiveEmailOffers?: boolean;
	receiveWhatsappOffers?: boolean;
}

export interface PrivateUserDTO {
	cellphone: string;
	document: string;
	email: string;
	lastAccessAt?: string;
	name: string;
	password: string;
	profileType?: ProfileType;
	receiveEmailOffers?: boolean;
	receiveWhatsappOffers?: boolean;
}

export interface PublicUserDTO {
	accountType: AccountType;
	address: string;
	avatarUrl?: string;
	cellphone: string;
	city: string;
	complement?: string;
	createdAt?: string;
	document: string;
	email: string;
	id: string;
	lastAccessAt?: string;
	name: string;
	neighborhood: string;
	number: string;
	profileType?: ProfileType;
	receiveEmailOffers?: boolean;
	receiveWhatsappOffers?: boolean;
	state: string;
	updatedAt?: string;
	company?: CompanyContextDTO;
	worker?: WorkerContextDTO;
	zipcode: string;
}

export interface CompanyContextDTO {
	approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
	approvedAt?: string;
	city: string;
	cnpj: string;
	companyId: string;
	fantasyName: string;
	isOwner: boolean;
	socialReason: string;
	state: string;
}

export interface WorkerContextDTO {
	companyCnpj: string;
	companyFantasyName: string;
	companyId: string;
	companySocialReason: string;
	isOwner: boolean;
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
	receiveEmailOffers?: boolean;
	receiveWhatsappOffers?: boolean;
}

export interface UserAvailabilityResponse {
	documentAvailable: boolean;
	emailAvailable: boolean;
}
