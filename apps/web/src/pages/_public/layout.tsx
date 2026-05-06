import { Footer } from "@repo/ui/components/organisms/footer/footer";
import { Navbar } from "@repo/ui/components/organisms/navbar/navbar";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	const location = useLocation();

	return (
		<div className="flex min-h-screen w-full flex-col bg-surface text-foreground-primary">
			{location.pathname === "/" ? <Navbar /> : <Navbar />}

			<main className="flex-1">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
}
