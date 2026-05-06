import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export function UserProfile() {
	const navigate = useNavigate();

	const { isMobile } = useSidebar();

	const handleLogout = () => {
		// signOut();

		toast.success("Esperamos te ver em breve!", {
			description: "Redirecionando de volta para a página inicial...",
		});

		navigate({ to: "/" });

		window.location.reload();
	};

	// if (isPending || !user) {
	// 	return (
	// 		<SidebarMenu>
	// 			<SidebarMenuItem>
	// 				<SidebarMenuButton disabled size="lg">
	// 					<Avatar className="h-8 w-8 rounded-lg">
	// 						<AvatarFallback className="animate-pulse rounded-lg bg-gray-300">
	// 							...
	// 						</AvatarFallback>
	// 					</Avatar>

	// 					<div className="grid flex-1 text-left text-sm leading-tight">
	// 						<span className="h-4 w-20 animate-pulse truncate rounded bg-gray-300 font-medium" />

	// 						<span className="mt-1 h-3 w-24 animate-pulse truncate rounded bg-gray-200 text-xs" />
	// 					</div>
	// 				</SidebarMenuButton>
	// 			</SidebarMenuItem>
	// 		</SidebarMenu>
	// 	);
	// }

	// const userDisplayName = user.name ? `${user.name}` : user.name;
	// const userInitials = getUserInitials(user.name);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							size="lg"
						>
							{/*<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage alt={userDisplayName} src={user.name} />

								<AvatarFallback className="rounded-lg bg-primary font-semibold text-primary-foreground">
									{userInitials}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{userDisplayName}</span>
								<span className="truncate text-muted-foreground text-xs">
									{user.email}
								</span>
							</div>*/}

							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								{/*<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage alt={userDisplayName} src={user.name} />

									<AvatarFallback className="rounded-lg bg-primary font-semibold text-primary-foreground">
										{userInitials}
									</AvatarFallback>
								</Avatar>

								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{userDisplayName}
									</span>

									<span className="truncate text-muted-foreground text-xs">
										{user.email}
									</span>
								</div>*/}
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => navigate({ to: "/" })}>
								<User />
								Perfil
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-600"
							onClick={handleLogout}
						>
							<LogOut />
							Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
