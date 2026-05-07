import { createFileRoute } from "@tanstack/react-router";
import { AdviceCard } from "./~components/-advice-card";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug/"
)({
	component: CompanyOverviewPage,
});

function CompanyOverviewPage() {
	return (
		<main>
			<AdviceCard />
		</main>
	);
}
