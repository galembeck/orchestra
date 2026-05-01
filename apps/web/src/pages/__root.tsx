import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
	// notFoundComponent: () => <NotFoundPage />,
});

function RootComponent() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="recycly-theme">
			<HeadContent />
			<Outlet />
		</ThemeProvider>
	);
}
