import { useAuth } from "@repo/core/hooks/services/use-auth";
import { getUserInitials } from "@repo/core/utils/get-user-initials";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/molecules/avatar/avatar";
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

	const { user, signOut, isPending } = useAuth();

	const handleLogout = () => {
		signOut();

		toast.success("Esperamos te ver em breve!", {
			description: "Redirecionando de volta para a página inicial...",
		});

		navigate({ to: "/sign-in" });

		window.location.reload();
	};

	if (isPending || !user) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton disabled size="lg">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarFallback className="animate-pulse rounded-lg bg-gray-300">
								...
							</AvatarFallback>
						</Avatar>

						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="h-4 w-20 animate-pulse truncate rounded bg-gray-300 font-medium" />

							<span className="mt-1 h-3 w-24 animate-pulse truncate rounded bg-gray-200 text-xs" />
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const userDisplayName = user.name ? `${user.name}` : user.name;
	const userInitials = getUserInitials(user.name);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="cursor-pointer data-[state=open]:bg-surface-navy data-[state=open]:text-sidebar-accent-foreground"
							size="lg"
						>
							<Avatar className="h-9 w-9 rounded-full bg-foreground-primary">
								<AvatarImage alt={userDisplayName} src={user.name} />

								<AvatarFallback className="rounded-lg bg-primary font-semibold text-surface">
									{userInitials}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium text-foreground-inverse-muted">
									{userDisplayName}
								</span>
								<span className="truncate text-foreground-inverse-muted/80 text-xs">
									{user.email}
								</span>
							</div>

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
								<Avatar className="h-9 w-9 rounded-full bg-foreground-primary">
									<AvatarImage alt={userDisplayName} src={user.name} />

									<AvatarFallback className="rounded-lg bg-primary font-semibold text-surface">
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
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => navigate({ to: "/my-account" })}>
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
