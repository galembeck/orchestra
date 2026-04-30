import { Navbar } from "@repo/ui/components/organisms/navbar/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	return (
		<main className="min-h-screen w-full bg-surface text-black">
			<Navbar />

			<div>
				<Outlet />
			</div>
		</main>
	);
}
