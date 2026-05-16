import {
	approveCompanyMutationOptions,
	COMPANY_REGISTRATIONS_QUERY_KEY,
	companyDocumentsQueryOptions,
	companyRegistrationDetailQueryOptions,
	rejectCompanyMutationOptions,
} from "@repo/core/services/admin/company-registrations.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CompanyAddressCard } from "./~components/-company-address-card";
import { CompanyDetailHeader } from "./~components/-company-detail-header";
import { CompanyDocumentsCard } from "./~components/-company-documents-card";
import { CompanyInfoCard } from "./~components/-company-info-card";
import { CompanyOwnerCard } from "./~components/-company-owner-card";
import { CompanyTimelineCard } from "./~components/-company-timeline-card";

export const Route = createFileRoute("/_app/panel/validation/$companyId/")({
	component: CompanyRegistrationDetailPage,
	head: () => ({
		meta: [{ title: "Detalhes do cadastro | Painel - orchestra.admin" }],
	}),
});

function CompanyRegistrationDetailPage() {
	const { companyId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: company, isLoading } = useQuery(
		companyRegistrationDetailQueryOptions(companyId)
	);

	const { data: documents = [] } = useQuery(
		companyDocumentsQueryOptions(companyId)
	);

	const { mutate: handleApprove } = useMutation({
		...approveCompanyMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: COMPANY_REGISTRATIONS_QUERY_KEY,
			});
			queryClient.invalidateQueries({
				queryKey: ["admin", "company-registration", companyId],
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
			queryClient.invalidateQueries({
				queryKey: ["admin", "company-registration", companyId],
			});
			toast.success("Cadastro de empresa recusado.");
			navigate({ to: "/panel/validation" });
		},
		onError: () => {
			toast.error("Ocorreu um erro ao recusar o cadastro da empresa.");
		},
	});

	if (isLoading || !company) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="font-inter text-foreground-tertiary text-sm">
					Carregando dados do cadastro…
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<CompanyDetailHeader
				company={company}
				onApprove={handleApprove}
				onReject={handleReject}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CompanyInfoCard company={company} />
				<CompanyOwnerCard company={company} />
				<CompanyAddressCard company={company} />
				<CompanyTimelineCard company={company} />
			</div>

			<CompanyDocumentsCard documents={documents} />
		</div>
	);
}
