import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/panel/")({
	beforeLoad: () => {
		throw redirect({ to: "/panel/overview" });
	},
});
