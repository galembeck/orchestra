import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PermissionKeyValue } from "../../constants/services/role/permissions.js";
import type { CreateRoleDTO, UpdateRoleDTO } from "../../models/role.model.js";
import { roleService } from "../../services/role.service.js";

export function useRoles(companyId: string | undefined) {
	return useQuery({
		queryKey: ["companies", companyId, "roles"],

		queryFn: () => {
			if (!companyId) {
				toast.error("Não foi possível carregar os cargos.", {
					description: "O identificador (ID) da empresa está ausente.",
				});

				return null;
			}

			return roleService.list(companyId);
		},

		enabled: !!companyId,
	});
}

export function useRolePermissions(
	companyId: string | undefined,
	roleId: string | undefined
) {
	return useQuery({
		queryKey: ["companies", companyId, "roles", roleId, "permissions"],

		queryFn: () => {
			if (!(companyId && roleId)) {
				toast.error("Não foi possível carregar as permissões.", {
					description:
						"O identficador (ID) da empresa ou do cargo está ausente.",
				});

				return null;
			}

			return roleService.getPermissions(companyId, roleId);
		},

		enabled: !!companyId && !!roleId,
	});
}

export function useCreateRole(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateRoleDTO) => roleService.create(companyId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "roles"],
			});

			toast.success("Cargo criado com sucesso!");
		},
		onError: (err) =>
			toast.error("Erro ao criar cargo.", { description: err.message }),
	});
}

export function useUpdateRole(companyId: string, roleId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateRoleDTO) =>
			roleService.update(companyId, roleId, data),

		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "roles"],
			}),
	});
}

export function useSetRolePermissions(companyId: string, roleId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (permissions: PermissionKeyValue[]) =>
			roleService.setPermissions(companyId, roleId, { permissions }),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "roles", roleId, "permissions"],
			});

			toast.success("Permissões atualizadas!");
		},
	});
}

export function useDeleteRole(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (roleId: string) => roleService.delete(companyId, roleId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["companies", companyId, "roles"],
			}),
	});
}
