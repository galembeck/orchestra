import { API } from "../api/connection/api.js";
import type {
	AssignRoleDTO,
	CompanyDocumentDTO,
	CompanyMemberDTO,
	InviteMemberDTO,
	PublicCompanyDTO,
	RegisterCompanyDTO,
	RejectCompanyDTO,
	UpdateCompanyDTO,
} from "../models/company.model.js";

const appendIfDefined = (fd: FormData, key: string, value: unknown) => {
	if (value === undefined || value === null) {
		return;
	}

	if (value instanceof File) {
		fd.append(key, value);
	} else {
		fd.append(key, String(value));
	}
};

export const companyService = {
	register: (data: RegisterCompanyDTO) => {
		const fd = new FormData();

		const entries = Object.entries(data) as [
			keyof RegisterCompanyDTO,
			unknown,
		][];

		for (const [key, value] of entries) {
			appendIfDefined(fd, key, value);
		}

		return API.postForm<PublicCompanyDTO>("/company/register", fd);
	},

	getMyCompanies: () => API.get<PublicCompanyDTO[]>("/company/me"),

	getByCompanies: () => API.get<PublicCompanyDTO[]>("/company/me"),

	getById: (companyId: string) =>
		API.get<PublicCompanyDTO>(`/company/${companyId}`),

	update: (companyId: string, data: UpdateCompanyDTO) =>
		API.put<PublicCompanyDTO>(`/company/${companyId}`, data),

	getDocuments: (companyId: string) =>
		API.get<CompanyDocumentDTO[]>(`/company/${companyId}/documents`),

	getPending: () => API.get<PublicCompanyDTO[]>("/company/admin/pending"),

	approve: (companyId: string) =>
		API.post<PublicCompanyDTO>(`/company/admin/${companyId}/approve`),

	reject: (companyId: string, data: RejectCompanyDTO) =>
		API.post<PublicCompanyDTO>(`/company/admin/${companyId}/reject`, data),

	getMembers: (companyId: string) =>
		API.get<CompanyMemberDTO[]>(`/company/${companyId}/members`),

	inviteMember: (companyId: string, data: InviteMemberDTO) =>
		API.post<CompanyMemberDTO>(`/company/${companyId}/members`, data),

	removeMember: (companyId: string, userId: string) =>
		API.delete<void>(`/company/${companyId}/members/${userId}`),

	updateMemberRole: (companyId: string, userId: string, data: AssignRoleDTO) =>
		API.put<CompanyMemberDTO>(
			`/company/${companyId}/members/${userId}/role`,
			data
		),
};
