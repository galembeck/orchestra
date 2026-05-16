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
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelSidebar } from "./~components/-panel-sidebar";
import { ContentSearch } from "./~components/sidebar-elements/sidebar-header/-content-search";

export const Route = createFileRoute("/_app/panel")({
	component: PanelLayout,
});

function PanelLayout() {
	const pageLabels: Record<string, string> = {
		"/panel/overview": "Visão geral",
	};

	const currentPageLabel =
		pageLabels[location.pathname] || "Página não reconhecida...";

	return (
		<main className="bg-surface text-foreground-primary">
			<SidebarProvider>
				<PanelSidebar />

				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-border border-b pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />

							<article className="flex flex-col gap-2">
								<Breadcrumb>
									<BreadcrumbList>
										{location.pathname !== "/panel" && (
											<>
												<BreadcrumbItem>
													<BreadcrumbLink href="/panel/overview">
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
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</main>
	);
}
