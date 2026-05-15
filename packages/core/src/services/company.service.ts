import { API } from "../api/connection/api.js";
import type {
	AssignRoleDTO,
	CompanyDocumentDTO,
	CompanyInvitationDTO,
	CompanyMemberDTO,
	InviteMemberDTO,
	PublicCompanyDTO,
	RegisterCompanyDTO,
	RejectCompanyDTO,
	UpdateCompanyConfigurationDTO,
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
	register: (data: RegisterCompanyDTO) =>
		API.post<{ userId: string; companyId: string }>("/auth/register/owner", {
			name: data.ownerName,
			email: data.ownerEmail,
			document: data.ownerDocument.replace(/\D/g, ""),
			cellphone: data.ownerCellphone.replace(/\D/g, ""),
			password: data.ownerPassword,
			acceptedTerms: data.acceptTerms,
			company: {
				name: data.fantasyName,
				document: data.cnpj.replace(/\D/g, ""),
				email: data.ownerEmail,
				segment: data.segment,
			},
		}),

	getMyCompanies: () => API.get<PublicCompanyDTO[]>("/company/me"),

	getByCompanies: () => API.get<PublicCompanyDTO[]>("/company/me"),

	getById: (companyId: string) =>
		API.get<PublicCompanyDTO>(`/company/${companyId}`),

	update: (companyId: string, data: UpdateCompanyDTO) =>
		API.put<PublicCompanyDTO>(`/company/${companyId}`, data),

	updateConfiguration: (companyId: string, data: UpdateCompanyConfigurationDTO) =>
		API.patch<PublicCompanyDTO>(`/company/${companyId}/configuration`, data),

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

	getInvitations: (companyId: string) =>
		API.get<CompanyInvitationDTO[]>(`/company/${companyId}/invitations`),

	resendInvitation: (companyId: string, invitationId: string) =>
		API.post<CompanyInvitationDTO>(
			`/company/${companyId}/invitations/${invitationId}/resend`
		),

	revokeInvitation: (companyId: string, invitationId: string) =>
		API.delete<void>(`/company/${companyId}/invitations/${invitationId}`),

	exportMembersCsv: async (companyId: string) => {
		const res = await fetch(
			`http://localhost:5005/company/${companyId}/members/export`,
			{ credentials: "include" }
		);

		if (!res.ok) {
			throw new Error(`Falha ao exportar (${res.status})`);
		}

		const blob = await res.blob();
		const disposition = res.headers.get("content-disposition") ?? "";
		const filename =
			/filename="?([^";]+)"?/i.exec(disposition)?.[1] ??
			`equipe-${companyId}.csv`;

		return { blob, filename };
	},
};
