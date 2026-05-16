import {
	approveCompanyMutationOptions,
	COMPANY_REGISTRATIONS_QUERY_KEY,
	companyRegistrationsQueryOptions,
	rejectCompanyMutationOptions,
} from "@repo/core/services/admin/company-registrations.service";
import {
	COMPANY_APPROVAL_STATUS,
	type CompanyApprovalStatus,
} from "@repo/core/types/enums/company-approval-status";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RegistrationStatsCard } from "./~components/-registration-stats-card";
import { RegistrationsTable } from "./~components/-registrations-table";

export const Route = createFileRoute("/_app/panel/validation/")({
	component: PanelValidationPage,
	head: () => ({
		meta: [{ title: "Validação de cadastro | Painel - orchestra.admin" }],
	}),
});

type StatusFilter = CompanyApprovalStatus | "all";

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
	{ label: "Todos", value: "all" },
	{ label: "Pendentes", value: COMPANY_APPROVAL_STATUS.PENDING },
	{ label: "Aprovados", value: COMPANY_APPROVAL_STATUS.APPROVED },
	{ label: "Recusados", value: COMPANY_APPROVAL_STATUS.REJECTED },
];

function PanelValidationPage() {
	const queryClient = useQueryClient();
	const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

	const { data: companies = [] } = useQuery(companyRegistrationsQueryOptions);

	const { mutate: handleApprove } = useMutation({
		...approveCompanyMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: COMPANY_REGISTRATIONS_QUERY_KEY,
			});
			toast.success("Cadastro de empresa aprovado com sucesso!");
		},
		onError: () => {
			toast.error("Ocorreu um erro ao aprovar o cadastro da empresa.");
		},
	});

	const { mutate: handleReject } = useMutation({
		...rejectCompanyMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: COMPANY_REGISTRATIONS_QUERY_KEY,
			});
			toast.success("Cadastro de empresa recusado.");
		},
		onError: () => {
			toast.error("Ocorreu um erro ao recusar o cadastro da empresa.");
		},
	});

	const pendingCount = companies.filter(
		(c) => c.approvalStatus === COMPANY_APPROVAL_STATUS.PENDING
	).length;
	const approvedCount = companies.filter(
		(c) => c.approvalStatus === COMPANY_APPROVAL_STATUS.APPROVED
	).length;
	const rejectedCount = companies.filter(
		(c) => c.approvalStatus === COMPANY_APPROVAL_STATUS.REJECTED
	).length;

	const filtered =
		activeFilter === "all"
			? companies
			: companies.filter((c) => c.approvalStatus === activeFilter);

	const countByFilter: Record<string, number> = {
		all: companies.length,
		[COMPANY_APPROVAL_STATUS.PENDING]: pendingCount,
		[COMPANY_APPROVAL_STATUS.APPROVED]: approvedCount,
		[COMPANY_APPROVAL_STATUS.REJECTED]: rejectedCount,
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Operação
				</span>

				<h1 className="font-instrument-serif font-medium text-3xl text-foreground-primary">
					Validação de cadastros
				</h1>

				<p className="font-inter text-[13px] text-foreground-tertiary">
					Visualize, aprove ou recuse os cadastro pendentes de empresas na
					plataforma.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<RegistrationStatsCard
					description="Total de empresas cadastradas"
					icon={Building2}
					title="Total de cadastros"
					value={companies.length}
				/>

				<RegistrationStatsCard
					description="Aguardando análise"
					icon={Clock}
					title="Pendentes"
					value={pendingCount}
				/>

				<RegistrationStatsCard
					description={`${approvedCount} aprovadas · ${rejectedCount} recusadas`}
					icon={CheckCircle2}
					title="Revisados"
					value={approvedCount + rejectedCount}
				/>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<CardTitle>Cadastros de empresas</CardTitle>

							<CardDescription className="mt-1">
								Revise os dados das empresas e aprove ou recuse cada cadastro na
								plataforma.
							</CardDescription>
						</div>

						<div className="flex flex-wrap gap-1.5">
							{FILTER_OPTIONS.map((option) => (
								<button
									className={`cursor-pointer rounded-full px-3 py-1 font-inter text-xs transition-colors ${
										activeFilter === option.value
											? "bg-foreground-primary text-surface"
											: "bg-surface-secondary text-foreground-secondary hover:bg-surface-secondary/80"
									}`}
									key={String(option.value)}
									onClick={() => setActiveFilter(option.value)}
									type="button"
								>
									{option.label} ({countByFilter[String(option.value)]})
								</button>
							))}
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<RegistrationsTable
						companies={filtered}
						onApprove={handleApprove}
						onReject={handleReject}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
