import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_public/_(no-authentication)/help-center/"
)({
	beforeLoad: () => {
		throw redirect({ to: "/help-center/companies" });
	},
});
