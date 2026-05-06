import type { PublicUserDTO } from "@repo/core/models/user.model";
import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { Toaster } from "@repo/ui/components/atoms/sooner/sooner";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { useGlobalHashScroll } from "@/hooks/use-global-hash-scroll";
import { NotFoundPage } from "./_error/not-found";

export interface RouterContext {
	auth: {
		isAuthenticated: boolean;
		user: PublicUserDTO | null;
	};
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
	useGlobalHashScroll();

	return (
		<ThemeProvider defaultTheme="light" storageKey="orchestra-theme">
			<HeadContent />
			<Outlet />
			<Toaster />
		</ThemeProvider>
	);
}
