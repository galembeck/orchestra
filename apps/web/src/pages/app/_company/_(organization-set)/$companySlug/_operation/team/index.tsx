import {
	useCompanyInvitations,
	useCompanyMembers,
	useExportMembersCsv,
	useMyCompanies,
	useRemoveMember,
	useResendInvitation,
	useRevokeInvitation,
	useUpdateMemberRole,
} from "@repo/core/hooks/services/use-company";
import { useRoles } from "@repo/core/hooks/services/use-role";
import type {
	CompanyInvitationDTO,
	CompanyMemberDTO,
} from "@repo/core/models/company.model";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Input } from "@repo/ui/components/atoms/input/input";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/molecules/avatar/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import { DataTable } from "@repo/ui/components/organisms/data-table/data-table";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { InviteMemberDialog } from "./~components/-invite-member-dialog";
import { TeamStatsCards } from "./~components/-stats-cards";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug/_operation/team/"
)({
	component: TeamPage,
});

type Row =
	| {
			kind: "member";
			data: CompanyMemberDTO;
	  }
	| {
			kind: "invitation";
			data: CompanyInvitationDTO;
	  };

function getInitials(name: string) {
	// biome-ignore lint/performance/useTopLevelRegex: not important in this context
	const parts = name.trim().split(/\s+/);
	if (parts.length === 0) {
		return "??";
	}
	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}
	// biome-ignore lint/style/useAtIndex: not important in this context
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelativeDate(iso?: string | null) {
	if (!iso) {
		return "—";
	}

	const date = new Date(iso);
	const diffMs = Date.now() - date.getTime();
	const diffMin = Math.floor(diffMs / 60_000);
	const diffHr = Math.floor(diffMs / 3_600_000);
	const diffDay = Math.floor(diffMs / 86_400_000);

	if (diffMin < 1) {
		return "agora";
	}
	if (diffMin < 60) {
		return `há ${diffMin} min`;
	}
	if (diffHr < 24) {
		return `há ${diffHr} h`;
	}
	if (diffDay < 7) {
		return `há ${diffDay} d`;
	}

	return date.toLocaleDateString("pt-BR");
}

function TeamPage() {
	const { companySlug } = Route.useParams();
	const { data: companies } = useMyCompanies();
	const company = companies?.find((c) => c.slug === companySlug);
	const companyId = company?.id;

	const { data: members, isLoading: areMembersLoading } =
		useCompanyMembers(companyId);
	const { data: invitations } = useCompanyInvitations(companyId);
	const { data: roles } = useRoles(companyId);

	const removeMember = useRemoveMember(companyId ?? "");
	const updateRole = useUpdateMemberRole(companyId ?? "");
	const resendInvite = useResendInvitation(companyId ?? "");
	const revokeInvite = useRevokeInvitation(companyId ?? "");
	const exportCsv = useExportMembersCsv(companyId ?? "");

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "invited"
	>("all");
	const [roleFilter, setRoleFilter] = useState<string>("all");

	const rows = useMemo<Row[]>(() => {
		const memberRows: Row[] = (members ?? []).map((m) => ({
			kind: "member",
			data: m,
		}));

		const pendingInvites = (invitations ?? []).filter((i) => !i.acceptedAt);
		const inviteRows: Row[] = pendingInvites.map((i) => ({
			kind: "invitation",
			data: i,
		}));

		return [...memberRows, ...inviteRows];
	}, [members, invitations]);

	const filteredRows = useMemo(() => {
		const q = search.trim().toLowerCase();

		// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: not important in this context
		return rows.filter((r) => {
			if (statusFilter === "active" && r.kind !== "member") {
				return false;
			}
			if (statusFilter === "invited" && r.kind !== "invitation") {
				return false;
			}

			if (roleFilter !== "all") {
				if (r.kind === "member" && r.data.roleId !== roleFilter) {
					return false;
				}
				if (r.kind === "invitation") {
					const role = roles?.find((x) => x.id === roleFilter);
					if (role?.key !== r.data.roleKey) {
						return false;
					}
				}
			}

			if (!q) {
				return true;
			}

			if (r.kind === "member") {
				return (
					r.data.name.toLowerCase().includes(q) ||
					r.data.email.toLowerCase().includes(q) ||
					(r.data.roleName ?? "").toLowerCase().includes(q)
				);
			}

			return (
				r.data.email.toLowerCase().includes(q) ||
				r.data.roleKey.toLowerCase().includes(q)
			);
		});
	}, [rows, search, statusFilter, roleFilter, roles]);

	const stats = useMemo(() => {
		const activeMembers = members?.length ?? 0;
		const pendingInvites = (invitations ?? []).filter(
			(i) => !i.acceptedAt
		).length;
		const expiringSoon = (invitations ?? []).filter((i) => {
			if (i.acceptedAt) {
				return false;
			}
			const expires = new Date(i.expiresAt).getTime();
			const inTwoDays = Date.now() + 2 * 86_400_000;
			return expires <= inTwoDays;
		}).length;
		return {
			activeMembers,
			pendingActions: expiringSoon,
			pendingInvites,
		};
	}, [members, invitations]);

	const columns = useMemo<ColumnDef<Row>[]>(
		() => [
			{
				id: "name",
				header: "Colaborador",
				cell: ({ row }) => {
					const r = row.original;

					if (r.kind === "member") {
						return (
							<div className="flex items-center gap-3">
								<Avatar className="h-9 w-9">
									{r.data.avatarUrl ? (
										<AvatarImage alt={r.data.name} src={r.data.avatarUrl} />
									) : null}
									<AvatarFallback>{getInitials(r.data.name)}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium text-foreground-primary text-sm">
										{r.data.name}
									</span>
									<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
										{r.data.isOwner ? "Proprietário" : "Colaborador"}
									</span>
								</div>
							</div>
						);
					}

					return (
						<div className="flex items-center gap-3">
							<Avatar className="h-9 w-9">
								<AvatarFallback>?</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="font-medium text-foreground-secondary text-sm">
									Convite enviado
								</span>
								<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
									Aguardando aceite
								</span>
							</div>
						</div>
					);
				},
			},
			{
				id: "status",
				header: "Status",
				cell: ({ row }) => {
					const r = row.original;
					if (r.kind === "member") {
						return r.data.isOwner ? (
							<Badge variant="accent">Proprietário</Badge>
						) : (
							<Badge variant="success">Ativo</Badge>
						);
					}
					const expired = new Date(r.data.expiresAt).getTime() < Date.now();
					return expired ? (
						<Badge variant="danger">Expirado</Badge>
					) : (
						<Badge variant="warning">Convidado</Badge>
					);
				},
			},
			{
				id: "email",
				header: "E-mail",
				cell: ({ row }) => (
					<span className="font-jetbrains-mono text-foreground-secondary text-xs">
						{row.original.data.email}
					</span>
				),
			},
			{
				id: "role",
				header: "Cargo",
				cell: ({ row }) => {
					const r = row.original;
					const label = r.kind === "member" ? r.data.roleName : r.data.roleKey;
					return (
						<span className="text-foreground-primary text-sm">
							{label ?? "—"}
						</span>
					);
				},
			},
			{
				id: "lastActivity",
				header: "Última atividade",
				cell: ({ row }) => {
					const r = row.original;
					if (r.kind === "member") {
						return (
							<span className="font-jetbrains-mono text-[11px] text-foreground-secondary uppercase tracking-[1.2px]">
								{formatRelativeDate(r.data.lastAccessAt)}
							</span>
						);
					}
					return (
						<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary uppercase tracking-[1.2px]">
							expira {formatRelativeDate(r.data.expiresAt)}
						</span>
					);
				},
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => {
					const r = row.original;

					return (
						<div className="flex justify-end">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-secondary hover:text-foreground-primary"
										type="button"
									>
										<MoreHorizontal className="h-4 w-4" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Ações</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{r.kind === "member" ? (
										<>
											{!r.data.isOwner && roles && roles.length > 0 ? (
												<>
													<DropdownMenuLabel className="font-normal text-[10px] text-foreground-tertiary">
														Alterar cargo
													</DropdownMenuLabel>
													{roles.map((role) => (
														<DropdownMenuItem
															disabled={role.id === r.data.roleId}
															key={role.id}
															onClick={() =>
																updateRole.mutate({
																	roleId: role.id,
																	userId: r.data.userId,
																})
															}
														>
															{role.name}
														</DropdownMenuItem>
													))}
													<DropdownMenuSeparator />
												</>
											) : null}
											<DropdownMenuItem
												disabled={r.data.isOwner}
												onClick={() => removeMember.mutate(r.data.userId)}
											>
												Remover da equipe
											</DropdownMenuItem>
										</>
									) : (
										<>
											<DropdownMenuItem
												onClick={() => resendInvite.mutate(r.data.id)}
											>
												Reenviar convite
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => revokeInvite.mutate(r.data.id)}
											>
												Revogar convite
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[removeMember, resendInvite, revokeInvite, roles, updateRole]
	);

	if (!companyId) {
		return null;
	}

	return (
		<section className="flex flex-col gap-6">
			<header className="flex flex-col gap-1.5">
				<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Painel da Equipe
				</span>
				<div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
					<div className="flex flex-col gap-1.5">
						<h2 className="font-instrument-serif text-3xl text-foreground-primary">
							Colaboradores e profissionais
						</h2>
						<p className="max-w-xl text-foreground-secondary text-sm">
							Convide colaboradores, gerencie cargos e acompanhe a atividade da
							sua equipe.
						</p>
					</div>

					<div className="flex items-center gap-2">
						<Button
							className="gap-2"
							disabled={exportCsv.isPending}
							onClick={() => exportCsv.mutate()}
							size="sm"
							variant="secondary"
						>
							<Download className="h-4 w-4" />
							{exportCsv.isPending ? "Exportando..." : "Exportar CSV"}
						</Button>
						<InviteMemberDialog companyId={companyId} />
					</div>
				</div>
			</header>

			<TeamStatsCards
				activeMembers={stats.activeMembers}
				pendingActions={stats.pendingActions}
				pendingInvites={stats.pendingInvites}
			/>

			<DataTable
				columns={columns}
				data={filteredRows}
				emptyMessage={
					areMembersLoading
						? "Carregando equipe..."
						: "Nenhum profissional encontrado."
				}
				toolbar={() => (
					<div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-foreground-tertiary" />
							<Input
								className="pl-9"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar por nome, e-mail ou cargo..."
								value={search}
							/>
						</div>

						<select
							className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-inter text-foreground-primary text-sm outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 md:w-44"
							onChange={(e) =>
								setStatusFilter(e.target.value as typeof statusFilter)
							}
							value={statusFilter}
						>
							<option value="all">Todos os status</option>
							<option value="active">Ativos</option>
							<option value="invited">Convidados</option>
						</select>

						<select
							className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-inter text-foreground-primary text-sm outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 md:w-48"
							onChange={(e) => setRoleFilter(e.target.value)}
							value={roleFilter}
						>
							<option value="all">Todos os cargos</option>
							{roles?.map((r) => (
								<option key={r.id} value={r.id}>
									{r.name}
								</option>
							))}
						</select>
					</div>
				)}
			/>
		</section>
	);
}
