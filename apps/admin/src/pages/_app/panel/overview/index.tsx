import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/panel/overview/")({
	component: PanelOverviewPage,
	head: () => ({
		meta: [{ title: "Visão geral | Painel - orchestra.admin" }],
	}),
});

function PanelOverviewPage() {
	return <div>Hello "/_app/panel/overview/"!</div>;
}
