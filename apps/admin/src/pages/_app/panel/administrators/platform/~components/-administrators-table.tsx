// apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrators-table.tsx
import type { AdminUserListItem } from "@repo/core/types/admin-user";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/molecules/table/table";
import { AdministratorRowMenu } from "./-administrator-row-menu";

function formatDate(iso: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(iso));
}

interface AdministratorsTableProps {
	users: AdminUserListItem[];
	onEditPermissions: (user: AdminUserListItem) => void;
}

export function AdministratorsTable({
	users,
	onEditPermissions,
}: AdministratorsTableProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Administradores da plataforma</CardTitle>
				<CardDescription className="mt-1">
					Lista de todos os administradores internos cadastrados na plataforma.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				{users.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="font-inter text-foreground-secondary text-sm">
							Nenhum administrador encontrado.
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>E-mail</TableHead>
								<TableHead>Matrícula</TableHead>
								<TableHead>Cargo</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Criado em</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>

						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium text-foreground-primary">
										{user.name}
									</TableCell>

									<TableCell className="text-foreground-secondary">
										{user.email}
									</TableCell>

									<TableCell className="font-jetbrains-mono text-xs text-foreground-secondary">
										{user.registration}
									</TableCell>

									<TableCell>
										{user.role ? (
											<Badge variant="secondary">{user.role.name}</Badge>
										) : (
											<span className="text-foreground-tertiary text-xs">
												Sem cargo
											</span>
										)}
									</TableCell>

									<TableCell>
										<Badge variant={user.isActive ? "default" : "danger"}>
											{user.isActive ? "Ativo" : "Inativo"}
										</Badge>
									</TableCell>

									<TableCell className="text-foreground-secondary">
										{formatDate(user.createdAt)}
									</TableCell>

									<TableCell>
										<AdministratorRowMenu
											user={user}
											onEditPermissions={onEditPermissions}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
