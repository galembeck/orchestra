import { useAuth } from "@repo/core/providers/auth-provider";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignInLayout,
});

function SignInLayout() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate({ to: "/" });
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (isLoading || isAuthenticated) {
		return (
			<main className="flex min-h-screen w-full items-center justify-center bg-surface text-foreground-primary">
				<Loader2 className="h-8 w-8 animate-spin text-foreground-primary" />
			</main>
		);
	}

	return (
		<main className="min-h-screen w-full bg-surface text-foreground-primary">
			<Outlet />
		</main>
	);
}
