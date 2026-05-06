import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/company/$companySlug/overview/")({
	component: CompanyDashboardOverviewPage,
});

function CompanyDashboardOverviewPage() {
	return <div>Hello "/_app/company/$companySlug/overview/"!</div>;
}
