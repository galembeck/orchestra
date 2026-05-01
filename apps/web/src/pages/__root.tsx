import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { NotFoundPage } from "./_error/not-found";

export const Route = createRootRoute({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title:
					"Orchestra | Encontre o serviço certo, com a empresa certa, na hora certa",
			},
		],
	}),
	notFoundComponent: () => <NotFoundPage />,
});

function RootComponent() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="recycly-theme">
			<HeadContent />
			<Outlet />
		</ThemeProvider>
	);
}
