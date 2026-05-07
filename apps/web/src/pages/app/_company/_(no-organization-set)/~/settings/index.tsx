import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/app/_company/_(no-organization-set)/~/settings/"
)({
	component: CompanySettingsPage,
});

function CompanySettingsPage() {
	return <div>Hello "/app/_company/_(no-organization-set)/~/settings/"!</div>;
}
