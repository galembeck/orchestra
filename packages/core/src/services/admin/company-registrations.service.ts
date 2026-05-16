import { adminApi } from "../../api/connection/api-admin.js";
import type {
	CompanyRegistrationDetail,
	CompanyRegistrationDocument,
	CompanyRegistrationItem,
} from "../../types/company-registration.js";

export const COMPANY_REGISTRATIONS_QUERY_KEY = [
	"admin",
	"company-registrations",
] as const;

export const companyRegistrationsQueryOptions = {
	queryKey: COMPANY_REGISTRATIONS_QUERY_KEY,
	queryFn: () =>
		adminApi.get<CompanyRegistrationItem[]>("/companies/registrations"),
	staleTime: 30 * 1000,
} as const;

export const COMPANY_REGISTRATION_DETAIL_QUERY_KEY = (id: string) =>
	["admin", "company-registration", id] as const;

export const companyRegistrationDetailQueryOptions = (id: string) => ({
	queryKey: COMPANY_REGISTRATION_DETAIL_QUERY_KEY(id),
	queryFn: () =>
		adminApi.get<CompanyRegistrationDetail>(`/companies/${id}/registration`),
	staleTime: 30 * 1000,
});

export const COMPANY_DOCUMENTS_QUERY_KEY = (id: string) =>
	["admin", "company-documents", id] as const;

export const companyDocumentsQueryOptions = (id: string) => ({
	queryKey: COMPANY_DOCUMENTS_QUERY_KEY(id),
	queryFn: () =>
		adminApi.get<CompanyRegistrationDocument[]>(`/companies/${id}/documents`),
	staleTime: 30 * 1000,
});

export const approveCompany = (id: string) =>
	adminApi.patch(`/companies/${id}/approve`);

export const rejectCompany = (id: string) =>
	adminApi.patch(`/companies/${id}/reject`);

export const approveCompanyMutationOptions = {
	mutationFn: approveCompany,
} as const;

export const rejectCompanyMutationOptions = {
	mutationFn: rejectCompany,
} as const;
