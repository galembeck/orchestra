import { AuthProvider, useAuth } from "@repo/core/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { routeTree } from "./route-tree-gen";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: required by @TanStack-Router
		auth: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const auth = useAuth();

	if (auth.isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-surface">
				<Loader2 className="h-8 w-8 animate-spin text-foreground-primary" />
			</div>
		);
	}

	// 2. Only render the Router once we are 100% sure about the user's status
	return <RouterProvider context={{ auth }} router={router} />;
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<InnerApp />
			</AuthProvider>
		</QueryClientProvider>
	);
}
