import { adminAuthQueryOptions } from "@repo/core/services/admin/admin-auth.service";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_sign-in")({
	beforeLoad: async ({ context: { queryClient } }) => {
		const user = await queryClient
			.ensureQueryData(adminAuthQueryOptions)
			.catch(() => null);

		if (user) {
			throw redirect({ to: "/panel" });
		}
	},
	component: SignInLayout,
});

function SignInLayout() {
	return (
		<main className="min-h-screen w-full bg-surface text-foreground-primary">
			<Outlet />
		</main>
	);
}
