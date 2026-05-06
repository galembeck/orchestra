import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUpLayout,
});

function SignUpLayout() {
	return (
		<main className="min-h-screen w-full bg-surface text-foreground-primary">
			<Outlet />
		</main>
	);
}
