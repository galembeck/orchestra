import type { QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { Toaster } from "@repo/ui/components/atoms/sooner/sooner";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
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
