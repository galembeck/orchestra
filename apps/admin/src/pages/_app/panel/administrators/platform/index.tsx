// apps/admin/src/pages/_app/panel/administrators/platform/index.tsx
import { adminRolesQueryOptions } from "@repo/core/services/admin/admin-roles.service";
import {
	ADMIN_USERS_QUERY_KEY,
	adminUsersQueryOptions,
	updateAdminUserPermissionsMutationOptions,
	updateAdminUserRoleMutationOptions,
} from "@repo/core/services/admin/admin-users.service";
import type { AdminUserListItem } from "@repo/core/types/admin-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdministratorsTable } from "./~components/-administrators-table";
import { EditPermissionsSheet } from "./~components/-edit-permissions-sheet";

export const Route = createFileRoute("/_app/panel/administrators/platform/")({
	component: PlatformAdministratorsPage,
	head: () => ({
		meta: [
			{ title: "Administradores — Plataforma | Painel - orchestra.admin" },
		],
	}),
});

function PlatformAdministratorsPage() {
	const queryClient = useQueryClient();
	const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(
		null,
	);

	const { data: users = [] } = useQuery(adminUsersQueryOptions);
	const { data: roles = [] } = useQuery(adminRolesQueryOptions);

	const { mutate: handleUpdateRole } = useMutation({
		...updateAdminUserRoleMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
			toast.success("Cargo atualizado com sucesso.");
		},
		onError: () => {
			toast.error("Ocorreu um erro ao atualizar o cargo.");
		},
	});

	const { mutate: handleUpdatePermissions } = useMutation({
		...updateAdminUserPermissionsMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
			toast.success("Permissões atualizadas com sucesso.");
		},
		onError: () => {
			toast.error("Ocorreu um erro ao atualizar as permissões.");
		},
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Administradores
				</span>

				<h1 className="font-instrument-serif font-medium text-3xl text-foreground-primary">
					Plataforma
				</h1>

				<p className="font-inter text-[13px] text-foreground-tertiary">
					Gerencie os administradores internos da plataforma, seus cargos e
					permissões.
				</p>
			</div>

			<AdministratorsTable users={users} onEditPermissions={setSelectedUser} />

			<EditPermissionsSheet
				user={selectedUser}
				roles={roles}
				onClose={() => setSelectedUser(null)}
				onSaveRole={(userId, roleId) => {
					handleUpdateRole({ id: userId, roleId });
					setSelectedUser(null);
				}}
				onSavePermissions={(userId, permissionOverrides) => {
					handleUpdatePermissions({ id: userId, permissionOverrides });
					setSelectedUser(null);
				}}
			/>
		</div>
	);
}
