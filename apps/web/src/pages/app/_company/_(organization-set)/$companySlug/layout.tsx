import { useAuth } from "@repo/core/hooks/services/use-auth";
import { useMyCompanies } from "@repo/core/hooks/services/use-company";
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
import { Loader2 } from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { BREADCRUMB_LABELS } from "@/constants/_app/company/breadcrumb-labels";
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

	const { user, isAuthenticated, isPending: isAuthLoading } = useAuth();

	const { data: companies, isLoading, isError } = useMyCompanies();

	const company = companies?.find((c) => c.slug === companySlug);

	useEffect(() => {
		if (!(isAuthLoading || isAuthenticated)) {
			navigate({ to: "/sign-in" });
		}
	}, [isAuthLoading, isAuthenticated, navigate]);

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
					<header className="flex h-20 shrink-0 items-center justify-between gap-2 border-border border-b pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-18">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />

							<article className="flex flex-col gap-2">
								<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
									Painel · {new Date().toLocaleDateString()}
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

interface Crumb {
	href: string;
	label: string;
}

function buildBreadcrumbs(pathname: string, companySlug: string): Crumb[] {
	const segments = pathname.split("/").filter(Boolean);
	const crumbs: Crumb[] = [];

	let acc = "";
	for (const segment of segments) {
		acc += `/${segment}`;

		if (segment === "app") {
			continue;
		}

		if (segment === companySlug) {
			crumbs.push({ href: acc, label: BREADCRUMB_LABELS.overview });
			continue;
		}

		const label = BREADCRUMB_LABELS[segment];
		if (!label) {
			continue;
		}

		crumbs.push({ href: acc, label });
	}

	return crumbs;
}
