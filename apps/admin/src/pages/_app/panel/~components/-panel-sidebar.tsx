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
import { dashboardData } from "@/constants/_app/panel/panel-sidebar";
import { NavigationContent } from "./sidebar-elements/sidebar-content/-navigation-content";
import { UserProfile } from "./sidebar-elements/sidebar-footer/-user-profile";
import { OrchestraHeader } from "./sidebar-elements/sidebar-header/-orchestra-header";

export function PanelSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const navigate = useNavigate();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<OrchestraHeader />

				{/*<ContentSearch />*/}
			</SidebarHeader>

			<SidebarContent>
				<NavigationContent items={dashboardData.primary} section="Operação" />

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
