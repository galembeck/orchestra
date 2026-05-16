// apps/admin/src/pages/_app/panel/administrators/platform/~components/-edit-permissions-sheet.tsx
import type {
	AdminRole,
	AdminUserListItem,
	PermissionMatrix,
} from "@repo/core/types/admin-user";
import { Button } from "@repo/ui/components/atoms/button/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/molecules/sheet/sheet";
import { useEffect, useState } from "react";

const DOMAIN_LABELS: Record<string, string> = {
	companies: "Empresas",
	adminUsers: "Administradores",
	settings: "Configurações",
};

const ACTION_LABELS: Record<string, string> = {
	view: "Visualizar",
	approve: "Aprovar",
	reject: "Recusar",
	create: "Criar",
	updateRole: "Alterar cargo",
	updatePermissions: "Alterar permissões",
	deactivate: "Desativar",
	edit: "Editar",
};

function deepMerge(
	base: PermissionMatrix,
	overrides: Partial<PermissionMatrix> | null,
): PermissionMatrix {
	if (!overrides) return base;

	return {
		companies: { ...base.companies, ...(overrides.companies ?? {}) },
		adminUsers: { ...base.adminUsers, ...(overrides.adminUsers ?? {}) },
		settings: { ...base.settings, ...(overrides.settings ?? {}) },
	};
}

interface EditPermissionsSheetProps {
	user: AdminUserListItem | null;
	roles: AdminRole[];
	onClose: () => void;
	onSaveRole: (userId: string, roleId: string) => void;
	onSavePermissions: (
		userId: string,
		permissionOverrides: Partial<PermissionMatrix> | null,
	) => void;
}

export function EditPermissionsSheet({
	user,
	roles,
	onClose,
	onSaveRole,
	onSavePermissions,
}: EditPermissionsSheetProps) {
	const [selectedRoleId, setSelectedRoleId] = useState<string>("");
	const [overrides, setOverrides] = useState<Partial<PermissionMatrix> | null>(
		null,
	);

	// Re-initialise local state whenever the target user changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on user change
	useEffect(() => {
		if (user) {
			setSelectedRoleId(user.role?.id ?? "");
			setOverrides(user.permissionOverrides ?? null);
		}
	}, [user?.id]);

	const selectedRole = roles.find((r) => r.id === selectedRoleId);

	const resolvedPermissions: PermissionMatrix | null = selectedRole
		? deepMerge(selectedRole.permissions, overrides)
		: null;

	const roleDefaultPermissions: PermissionMatrix | null =
		selectedRole?.permissions ?? null;

	function handleOpenChange(open: boolean) {
		if (!open) onClose();
	}

	function togglePermission(
		domain: keyof PermissionMatrix,
		action: string,
		value: boolean,
	) {
		setOverrides((prev) => ({
			...prev,
			[domain]: {
				...(prev?.[domain] ?? {}),
				[action]: value,
			},
		}));
	}

	function handleSave() {
		if (!user) return;
		const roleChanged = selectedRoleId !== (user.role?.id ?? "");
		if (roleChanged && selectedRoleId) {
			onSaveRole(user.id, selectedRoleId);
		}
		onSavePermissions(user.id, overrides);
	}

	function handleClearOverrides() {
		if (!user) return;
		setOverrides(null);
		onSavePermissions(user.id, null);
	}

	return (
		<Sheet open={!!user} onOpenChange={handleOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Editar permissões</SheetTitle>
					<SheetDescription>
						{user?.name} — {user?.email}
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col gap-6 p-4">
					{/* Role selector */}
					<div className="flex flex-col gap-2">
						<label
							className="font-inter text-xs font-medium text-foreground-secondary uppercase tracking-wide"
							htmlFor="role-select"
						>
							Cargo
						</label>
						<select
							id="role-select"
							className="rounded-md border border-border bg-surface px-3 py-2 font-inter text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-ring"
							value={selectedRoleId}
							onChange={(e) => {
								setSelectedRoleId(e.target.value);
								setOverrides(null);
							}}
						>
							<option value="">Sem cargo</option>
							{roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>

					{/* Permission matrix */}
					{resolvedPermissions && roleDefaultPermissions && (
						<div className="flex flex-col gap-4">
							<span className="font-inter text-xs font-medium text-foreground-secondary uppercase tracking-wide">
								Permissões
							</span>

							{(
								Object.entries(resolvedPermissions) as [
									keyof PermissionMatrix,
									Record<string, boolean>,
								][]
							).map(([domain, actions]) => (
								<div key={domain} className="flex flex-col gap-2">
									<span className="font-inter text-sm font-medium text-foreground-primary">
										{DOMAIN_LABELS[domain] ?? domain}
									</span>

									{Object.entries(actions).map(([action, value]) => {
										const roleDefault = (
											roleDefaultPermissions[domain] as Record<string, boolean>
										)[action];
										const isOverride = value !== roleDefault;

										return (
											<label
												key={action}
												className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-surface-secondary"
											>
												<span
													className={`font-inter text-sm ${isOverride ? "italic text-foreground-primary" : "text-foreground-secondary"}`}
												>
													{ACTION_LABELS[action] ?? action}
													{isOverride && (
														<span
															aria-hidden="true"
															className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"
														/>
													)}
												</span>

												<input
													type="checkbox"
													checked={value}
													className="h-4 w-4 cursor-pointer accent-foreground-primary"
													onChange={(e) =>
														togglePermission(domain, action, e.target.checked)
													}
												/>
											</label>
										);
									})}
								</div>
							))}
						</div>
					)}
				</div>

				<SheetFooter>
					{overrides && (
						<button
							type="button"
							className="font-inter text-xs text-foreground-tertiary underline underline-offset-2 hover:text-foreground-secondary"
							onClick={handleClearOverrides}
						>
							Limpar substituições
						</button>
					)}

					<Button onClick={handleSave} className="w-full">
						Salvar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
