import { useMyCompanies } from "@repo/core/hooks/services/use-company";
import { createFileRoute } from "@tanstack/react-router";
import { AgendaList } from "./~components/-agenda-list";
import { OnboardingCard } from "./~components/-onboarding-card";
import { RecentRequests } from "./~components/-recent-requests";
import { RevenueChart } from "./~components/-revenue-chart";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug/_operation/_overview/"
)({
	component: CompanyOverviewPage,
	head: () => ({
		meta: [{ title: "Visão geral | Painel - orchestra.web" }],
	}),
});

function CompanyOverviewPage() {
	const { companySlug } = Route.useParams();
	const { data: companies } = useMyCompanies();
	const company = companies?.find((c) => c.slug === companySlug);

	return (
		<main className="flex flex-col gap-5">
			{company && <OnboardingCard company={company} />}

			{/*<AdviceCard />*/}

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RevenueChart />
				</div>

				<AgendaList />
			</div>

			<RecentRequests />
		</main>
	);
}
