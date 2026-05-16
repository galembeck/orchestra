import { useAuth } from "@repo/core/providers/auth-provider";
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
import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { Fragment, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/organisms/dashboard-skeleton/dashboard-skeleton";
import { buildBreadcrumbs } from "@/utils/build-breadcrumb";
import { DashboardSidebar } from "../../~components/-dashboard-sidebar";
import { ContentSearch } from "../../~components/sidebar-elements/sidebar-header/-content-search";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug"
)({
	component: CompanyDashboardLayout,
});

function CompanyDashboardLayout() {
	const navigate = useNavigate();

	const { companySlug } = Route.useParams();

	const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

	const company = user?.company;

	useEffect(() => {
		if (!(isAuthLoading || isAuthenticated)) {
			navigate({ to: "/sign-in" });
		}
	}, [isAuthLoading, isAuthenticated, navigate]);

	const companyMissing = !isAuthLoading && isAuthenticated && !company;

	useEffect(() => {
		if (companyMissing) {
			toast.error("Empresa não encontrada.", {
				description: "Redirecionando de volta para a página inicial...",
			});

			navigate({ to: "/" });
		}
	}, [companyMissing, navigate]);

	const { pathname } = useLocation();

	const breadcrumbs = useMemo(
		() => buildBreadcrumbs(pathname, companySlug),
		[pathname, companySlug]
	);

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

	if (isAuthLoading || !isAuthenticated || !company) {
		return <DashboardSkeleton />;
	}

	return (
		<main className="bg-surface text-foreground-primary">
			<SidebarProvider>
				<DashboardSidebar />

				<SidebarInset>
					<header className="flex h-20 shrink-0 items-center justify-between gap-2 border-border border-b pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-18">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />

							<article className="flex flex-col gap-2">
								<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
									{company.fantasyName} · Painel ·{" "}
									{new Date().toLocaleDateString()}
								</span>

								<h1 className="font-instrument-serif text-2xl text-foreground-primary">
									{getGreeting()}, {user?.name?.split(" ")[0]}
								</h1>
							</article>
						</div>

						<div className="flex items-center gap-2">
							<div className="hidden lg:block">
								<ContentSearch />
							</div>

							<ThemeToggle />
						</div>
					</header>

					<main className="flex flex-col gap-4.5 p-3.5 lg:p-8">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<span className="text-foreground-tertiary">
										Painel administrativo
									</span>
								</BreadcrumbItem>

								{breadcrumbs.length > 0 && <BreadcrumbSeparator />}

								{breadcrumbs.map((crumb, index) => {
									const isLast = index === breadcrumbs.length - 1;

									return (
										<Fragment key={crumb.href}>
											<BreadcrumbItem>
												{isLast ? (
													<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
												) : (
													<BreadcrumbLink asChild>
														<Link to={crumb.href}>{crumb.label}</Link>
													</BreadcrumbLink>
												)}
											</BreadcrumbItem>

											{!isLast && <BreadcrumbSeparator />}
										</Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>

						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</main>
	);
}
