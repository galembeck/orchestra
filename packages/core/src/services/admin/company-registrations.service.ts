import { adminApi } from "../../api/connection/api-admin.js";
import type { CompanyRegistrationItem } from "../../types/company-registration.js";

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
