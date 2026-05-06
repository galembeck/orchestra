import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { Toaster } from "@repo/ui/components/atoms/sooner/sooner";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
	// notFoundComponent: () => <NotFound />,
	head: () => ({
		meta: [
			{
				title: "Painel Administrativo | orchestra.admin",
			},
		],
	}),
});

function RootComponent() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="orchestra-theme">
			<HeadContent />
			<Outlet />
			<Toaster />
		</ThemeProvider>
	);
}
