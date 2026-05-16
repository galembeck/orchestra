import { useAuth } from "@repo/core/hooks/services/use-auth";
import {
	ACCOUNT_TYPE_DETAILS,
	type AccountType,
} from "@repo/core/types/enums/account-type";
import { getUserInitials } from "@repo/core/utils/get-user-initials";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/components/molecules/collapsible/collapsible";
import { useNavigate } from "@tanstack/react-router";
import {
	Building2,
	ChevronRight,
	LayoutDashboard,
	LogOut,
	User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../atoms/badge/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../molecules/dropdown-menu/dropdown-menu";

export function ProfileDropdown() {
	const navigate = useNavigate();

	const { user, signOut } = useAuth();

	const handleSignOut = () => {
		signOut();

		toast.success("Desconectado!", {
			description: "Esperamos te ver em breve em nossa plataforma...",
		});
	};

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-foreground-primary font-semibold text-sm text-surface transition-colors hover:bg-primary-green/90"
					type="button"
				>
					{getUserInitials(user.name)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Informações pessoais</DropdownMenuLabel>

					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<button
								className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground-primary font-semibold text-sm text-surface transition-colors hover:bg-primary-green/90"
								type="button"
							>
								{getUserInitials(user.name)}
							</button>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>

								<span className="truncate text-muted-foreground text-xs">
									{user.email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel>Opções de perfil</DropdownMenuLabel>

					<DropdownMenuItem
						className="flex cursor-pointer items-center justify-between"
						onClick={() => navigate({ to: "/my-account" })}
					>
						<span className="flex items-center gap-2">
							<User className="h-4 w-4" />
							Perfil
						</span>

						{user.accountType === "CLIENT" && (
							<Badge className="bg-foreground-primary font-jetbrains-mono font-medium text-[11px] uppercase">
								{ACCOUNT_TYPE_DETAILS[user.accountType as AccountType]?.label}
							</Badge>
						)}
					</DropdownMenuItem>

					{user.accountType === "OWNER" && user.company && (
						<Collapsible className="group/collapsible">
							<CollapsibleTrigger asChild>
								<DropdownMenuItem
									className="flex cursor-pointer items-center justify-between"
									onSelect={(e) => e.preventDefault()}
								>
									<ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />

									<span className="flex items-center gap-2">
										<LayoutDashboard className="h-4 w-4" />
										Dashboard
									</span>

									<div className="flex items-center gap-1.5">
										<Badge className="bg-foreground-accent font-jetbrains-mono font-medium text-[11px] uppercase">
											{
												ACCOUNT_TYPE_DETAILS[user.accountType as AccountType]
													?.label
											}
										</Badge>
									</div>
								</DropdownMenuItem>
							</CollapsibleTrigger>

							<CollapsibleContent className="px-1 py-1">
								<DropdownMenuItem
									className="mt-1 flex cursor-pointer items-center gap-2"
									onClick={() => navigate({ to: `/app/${user.company?.slug}` })}
								>
									<div className="ml-0.5 h-6 w-1 bg-foreground-accent" />

									<Building2 className="h-3.5 w-3.5 text-muted-foreground" />

									<span className="truncate text-sm">
										{user.company.fantasyName}
									</span>
								</DropdownMenuItem>
							</CollapsibleContent>
						</Collapsible>
					)}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="group cursor-pointer hover:bg-red-100! focus:text-red-400"
					onClick={handleSignOut}
				>
					<LogOut className="h-4 w-4 group-focus:text-red-400" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
