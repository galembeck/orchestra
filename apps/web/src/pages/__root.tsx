import { ThemeProvider } from "@repo/core/providers/theme-provider";
import { Toaster } from "@repo/ui/components/atoms/sooner/sooner";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useGlobalHashScroll } from "@/hooks/use-global-hash-scroll";
import { NotFoundPage } from "./_error/not-found";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: () => <NotFoundPage />,
});

function RootComponent() {
	useGlobalHashScroll();

	return (
		<ThemeProvider defaultTheme="light" storageKey="orchestra-theme">
			<NuqsAdapter>
				<HeadContent />
				<Outlet />
				<Toaster />
			</NuqsAdapter>
		</ThemeProvider>
	);
}
