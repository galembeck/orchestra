import { useMyCompanies } from "@repo/core/hooks/services/use-company";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import type { ComponentProps } from "react";
import { dashboardData } from "@/constants/_app/company/dashboard-sidebar";
import { NavigationContent } from "./sidebar-elements/sidebar-content/-navigation-content";
import { UserProfile } from "./sidebar-elements/sidebar-footer/-user-profile";
import { CompanySwitcher } from "./sidebar-elements/sidebar-header/-company-switcher";
import { OrchestraHeader } from "./sidebar-elements/sidebar-header/-orchestra-header";

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const navigate = useNavigate();

	const { data: companies, isLoading } = useMyCompanies();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<OrchestraHeader />

				<CompanySwitcher companies={companies} isLoading={isLoading} />

				{/*<ContentSearch />*/}
			</SidebarHeader>

			<SidebarContent>
				<NavigationContent items={dashboardData.primary} section="Operação" />

				<NavigationContent items={dashboardData.business} section="Negócio" />

				<SidebarGroup>
					<SidebarGroupLabel>Sistema</SidebarGroupLabel>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer"
							onClick={() => navigate({ to: "/" })}
							tooltip="Configurações"
						>
							<Settings2 />
							<span>Configurações</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<UserProfile />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
