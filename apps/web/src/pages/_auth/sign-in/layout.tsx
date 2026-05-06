import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignInLayout,
});

function SignInLayout() {
	return (
		<main className="min-h-screen w-full bg-surface text-foreground-primary">
			<Outlet />
		</main>
	);
}
