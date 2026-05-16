import type {
	RegisterCompanyDTO,
	RejectCompanyDTO,
	UpdateCompanyConfigurationDTO,
	UpdateCompanyDTO,
} from "@core/models/company.model.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../providers/auth-provider.js";
import { authService } from "../../services/auth.service.js";
import { companyService } from "../../services/company.service.js";
import type { ApiException } from "../../types/api-error.js";

export function useRegisterCompany() {
	const { refetch } = useAuth();

	const [serverError, setServerError] = useState("");

	const { mutate: register, isPending } = useMutation({
		mutationFn: async (data: RegisterCompanyDTO) => {
			await companyService.register(data);

			await authService.signIn({
				identifier: data.ownerEmail,
				password: data.ownerPassword,
			});
		},

		onSuccess: async () => {
			await refetch();

			toast.success("Empresa cadastrada!", {
				description:
					"Sua conta está em análise. Você receberá um e-mail quando aprovada.",
			});
		},

		onError: (err) => {
			const status = (err as ApiException).status;
			const message =
				status >= 400 && status < 500 && err.message
					? err.message
					: "Erro ao cadastrar empresa. Tente novamente.";

			setServerError(message);

			toast.error("Erro ao cadastrar empresa!", { description: message });
		},
	});

	return { register, isPending, serverError };
}

export function useMyCompanies(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: ["companies", "me"],
		queryFn: companyService.getMyCompanies,
		enabled: options?.enabled ?? true,
	});
}

export function useCompany(companyId: string | undefined) {
	useEffect(() => {
		if (!companyId) {
			toast.error("Erro ao carregar dados da empresa.", {
				description: "O identificador (ID) da empresa não foi fornecido.",
			});
		}
	}, [companyId]);

	return useQuery({
		queryKey: ["companies", companyId],
		queryFn: () => companyService.getById(companyId as string),
		enabled: !!companyId,
	});
}

export function useUpdateCompanyConfiguration(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCompanyConfigurationDTO) =>
			companyService.updateConfiguration(companyId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["companies", companyId] });
			queryClient.invalidateQueries({ queryKey: ["companies", "me"] });

			toast.success("Configuração salva com sucesso!");
		},
		onError: (err) =>
			toast.error("Erro ao salvar configuração.", { description: err.message }),
	});
}

export function useUpdateCompany(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCompanyDTO) =>
			companyService.update(companyId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["companies", companyId] });
			queryClient.invalidateQueries({ queryKey: ["companies", "me"] });

			toast.success("Os dados da sua empresa foram atualizados!");
		},
		onError: (err) =>
			toast.error("Erro ao atualizar dados da empresa", {
				description: err.message,
			}),
	});
}

export function useCompanyDocuments(companyId: string | undefined) {
	return useQuery({
		queryKey: ["companies", companyId, "documents"],

		queryFn: () => {
			if (!companyId) {
				toast.error("Não foi possível carregar os documentos.", {
					description: "O identficador (ID) da empresa está ausente.",
				});

				return null;
			}

			return companyService.getDocuments(companyId);
		},

		enabled: !!companyId,
	});
}

export function useCompanyMembers(companyId: string | undefined) {
	return useQuery({
		queryKey: ["companies", companyId, "members"],

		queryFn: () => {
			if (!companyId) {
				toast.error("Não foi possível carregar os membros.", {
					description: "O identficador (ID) da empresa está ausente.",
				});

				return null;
			}

			return companyService.getMembers(companyId);
		},

		enabled: !!companyId,
	});
}

export function useInviteMember(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { userEmail: string; roleId: string }) =>
			companyService.inviteMember(companyId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "members"],
			});

			toast.success("O convite para o membro foi enviado com sucesso!");
		},

		onError: (err) =>
			toast.error("Erro ao convidar membro para empresa.", {
				description: err.message,
			}),
	});
}

export function useRemoveMember(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) =>
			companyService.removeMember(companyId, userId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "members"],
			});

			toast.success("Membro removido de sua empresa!");
		},
	});
}

export function useUpdateMemberRole(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
			companyService.updateMemberRole(companyId, userId, { roleId }),

		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "members"],
			}),
	});
}

export function useCompanyInvitations(companyId: string | undefined) {
	return useQuery({
		queryKey: ["companies", companyId, "invitations"],

		queryFn: () => {
			if (!companyId) {
				toast.error("Não foi possível carregar os convites.", {
					description: "O identificador (ID) da empresa está ausente.",
				});

				return null;
			}

			return companyService.getInvitations(companyId);
		},

		enabled: !!companyId,
	});
}

export function useResendInvitation(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (invitationId: string) =>
			companyService.resendInvitation(companyId, invitationId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "invitations"],
			});

			toast.success("Convite reenviado com sucesso!");
		},

		onError: (err) =>
			toast.error("Erro ao reenviar convite.", { description: err.message }),
	});
}

export function useRevokeInvitation(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (invitationId: string) =>
			companyService.revokeInvitation(companyId, invitationId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "invitations"],
			});

			toast.success("Convite revogado.");
		},

		onError: (err) =>
			toast.error("Erro ao revogar convite.", { description: err.message }),
	});
}

export function useExportMembersCsv(companyId: string) {
	return useMutation({
		mutationFn: () => companyService.exportMembersCsv(companyId),

		onSuccess: ({ blob, filename }) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);

			toast.success("CSV exportado com sucesso!");
		},

		onError: (err) =>
			toast.error("Erro ao exportar CSV.", { description: err.message }),
	});
}

export function usePendingCompanies() {
	return useQuery({
		queryKey: ["companies", "admin", "pending"],
		queryFn: companyService.getPending,
	});
}

export function useApproveCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (companyId: string) => companyService.approve(companyId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", "admin", "pending"],
			});

			toast.success("Cadastro da empresa aprovada com sucesso!");
		},

		onError: (err) =>
			toast.error("Erro ao aprovar cadastro da empresa.", {
				description: err.message,
			}),
	});
}

export function useRejectCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			companyId,
			reason,
		}: { companyId: string } & RejectCompanyDTO) =>
			companyService.reject(companyId, { reason }),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", "admin", "pending"],
			});

			toast.success("Cadastro da empresa rejeitado com sucesso!");
		},

		onError: (err) =>
			toast.error("Erro ao rejeitar cadastro da empresa.", {
				description: err.message,
			}),
	});
}
