import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_general/frequent-questions/")({
	beforeLoad: () => {
		throw redirect({ to: "/frequent-questions/companies" });
	},
});
