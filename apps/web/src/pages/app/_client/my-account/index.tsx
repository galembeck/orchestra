import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_client/my-account/")({
	component: MyAccountPage,
	head: () => ({
		meta: [{ title: "Minha conta | orchestra.web" }],
	}),
});

function MyAccountPage() {
	return <div>Hello "/app/_client/my-account/"!</div>;
}
