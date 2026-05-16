import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/components/molecules/collapsible/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

export function NavigationContent({
	section,
	items,
}: Readonly<{
	section?: string;
	items: {
		title: string;
		description?: string;
		url?: string;
		icon?: LucideIcon;
		badge?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}>) {
	const navigate = useNavigate();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{section}</SidebarGroupLabel>

			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						asChild
						className="group/collapsible"
						defaultOpen={item.isActive}
						key={item.title}
					>
						{item.items && item.items.length > 0 ? (
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<a href={subItem.url}>
														<span>{subItem.title}</span>
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						) : (
							<SidebarMenuItem>
								<SidebarMenuButton
									className="cursor-pointer"
									onClick={() => item.url && navigate({ to: item.url })}
									tooltip={item.title}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									{item?.badge && (
										<Badge>
											<item.badge />
										</Badge>
									)}
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
