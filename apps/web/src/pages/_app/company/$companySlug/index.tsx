import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/company/$companySlug/")({
	beforeLoad: () => {
		const { companySlug } = Route.useParams();

		throw redirect({
			to: "/company/$companySlug/overview",
			params: { companySlug },
			replace: true,
		});
	},
});
