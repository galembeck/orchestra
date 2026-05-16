import type { CompanyRegistrationItem } from "@repo/core/types/company-registration";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/molecules/table/table";
import { RegistrationRowActions } from "./-registration-row-actions";
import { RegistrationRowMenu } from "./-registration-row-menu";
import { RegistrationStatusBadge } from "./-registration-status-badge";

function formatCnpj(cnpj: string): string {
	return cnpj.replace(
		// biome-ignore lint/performance/useTopLevelRegex: not important in this context
		/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
		"$1.$2.$3/$4-$5"
	);
}

function formatDate(dateString: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(dateString));
}

interface RegistrationsTableProps {
	companies: CompanyRegistrationItem[];
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
}

export function RegistrationsTable({
	companies,
	onApprove,
	onReject,
}: RegistrationsTableProps) {
	if (companies.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<p className="font-inter text-foreground-secondary text-sm">
					Nenhum cadastro encontrado.
				</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Empresa</TableHead>
					<TableHead>CNPJ</TableHead>
					<TableHead>Responsável</TableHead>
					<TableHead>E-mail</TableHead>
					<TableHead>Cidade / UF</TableHead>
					<TableHead>Cadastrado em</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Ações</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{companies.map((company) => (
					<TableRow key={company.id}>
						<TableCell>
							<div className="flex flex-col gap-0.5">
								<span className="font-medium text-foreground-primary">
									{company.fantasyName}
								</span>
								<span className="text-foreground-secondary text-xs">
									{company.socialReason}
								</span>
							</div>
						</TableCell>
						<TableCell className="font-jetbrains-mono text-xs">
							{formatCnpj(company.cnpj)}
						</TableCell>
						<TableCell>{company.ownerName}</TableCell>
						<TableCell className="text-foreground-secondary">
							{company.ownerEmail}
						</TableCell>
						<TableCell className="text-foreground-secondary">
							{company.city} / {company.state}
						</TableCell>
						<TableCell className="text-foreground-secondary">
							{formatDate(company.createdAt)}
						</TableCell>
						<TableCell>
							<RegistrationStatusBadge status={company.approvalStatus} />
						</TableCell>
						<TableCell>
							<RegistrationRowActions
								approvalStatus={company.approvalStatus}
								companyId={company.id}
								onApprove={onApprove}
								onReject={onReject}
							/>
						</TableCell>
						<TableCell>
							<RegistrationRowMenu company={company} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
