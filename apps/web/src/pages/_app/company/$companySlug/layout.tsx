import { useAuth } from "@repo/core/hooks/services/use-auth";
import { useCompany } from "@repo/core/hooks/services/use-company";
import { ThemeToggle } from "@repo/ui/components/atoms/theme-toggle/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/components/molecules/breadcrumb/breadcrumb";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { DashboardSidebar } from "../~components/-dashboard-sidebar";
import { ContentSearch } from "../~components/sidebar-elements/sidebar-header/-content-search";

export const Route = createFileRoute("/_app/company/$companySlug")({
	component: CompanyDashboardLayout,
});

function CompanyDashboardLayout() {
	const navigate = useNavigate();

	const { companySlug } = Route.useParams();

	const { user, isAuthenticated } = useAuth();

	const { data: company, isLoading, isError } = useCompany(companySlug);

	useEffect(() => {
		if (!(isLoading || isAuthenticated)) {
			navigate({ to: "/sign-in" });
		}
	}, [isLoading, isAuthenticated, navigate]);

	const pageLabels: Record<string, string> = {
		"/company/$companySlug/overview": "Visão geral",
	};

	const currentPageLabel =
		pageLabels[location.pathname] || "Página não reconhecida...";

	const getGreeting = () => {
		const currentHour = new Date().getHours();

		if (currentHour >= 5 && currentHour < 12) {
			return "Bom dia";
		}

		if (currentHour >= 12 && currentHour < 18) {
			return "Boa tarde";
		}

		return "Boa noite";
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-surface">
				<Loader2 className="h-8 w-8 animate-spin text-foreground-primary" />
			</div>
		);
	}

	if (isError || !company) {
		toast.error("Empresa não encontrada.", {
			description: "Redirecionando de volta para a página inicial...",
		});

		return navigate({ to: "/" });
	}

	return (
		<main className="bg-surface text-foreground-primary">
			<SidebarProvider>
				<DashboardSidebar />

				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-border border-b pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />

							<article className="flex flex-col gap-2">
								<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
									Painel · {new Date().toLocaleDateString()}
								</span>

								<Breadcrumb>
									<BreadcrumbList>
										{location.pathname !== "/app" && (
											<>
												<BreadcrumbItem>
													<BreadcrumbLink href="/app/dashboard">
														Painel Administrativo
													</BreadcrumbLink>
												</BreadcrumbItem>
												<BreadcrumbSeparator />
											</>
										)}
										<BreadcrumbItem>
											<BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</article>
						</div>

						<div className="flex items-center gap-2">
							<div className="hidden lg:block">
								<ContentSearch />
							</div>

							<ThemeToggle />
						</div>
					</header>

					<main className="container mx-auto space-y-8 p-4">
						<h1 className="font-instrument-serif text-3xl text-foreground-primary">
							{getGreeting()}, {user?.name?.split(" ")[0]}
						</h1>

						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</main>
	);
}
