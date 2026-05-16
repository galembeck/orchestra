import type { CompanyContextDTO } from "@repo/core/models/user.model";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { Building2, ChevronsUpDown, Plus, Wrench } from "lucide-react";

export function CompanySwitcher({ company }: { company?: CompanyContextDTO }) {
	const navigate = useNavigate();

	const { isMobile } = useSidebar();

	if (!company) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="h-14 cursor-pointer bg-surface-navy-2 px-3! data-[state=open]:bg-surface-navy-2/80 dark:bg-surface-navy dark:data-[state=open]:bg-surface-navy/80 dark:hover:bg-surface-navy/80"
							size="lg"
						>
							<div className="flex size-10 h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F5EFE6] text-surface-navy">
								<Wrench className="size-5" />
							</div>

							<div className="grid min-w-0 flex-1 text-left leading-tight">
								<span className="block truncate font-inter font-semibold text-[13px] text-foreground-inverse">
									{company.socialReason}
								</span>

								<div className="mt-0.5 flex min-w-0 items-center gap-1.5">
									{company.approvalStatus === "PENDING" && (
										<>
											<span className="size-2 shrink-0 rounded-full bg-accent" />

											<span className="block truncate font-jetbrains-mono text-[13px] text-foreground-inverse-muted">
												Pendente
											</span>
										</>
									)}

									{company.approvalStatus === "APPROVED" && (
										<>
											<span className="size-2 shrink-0 rounded-full bg-success" />

											<span className="block truncate font-jetbrains-mono text-[13px] text-foreground-inverse-muted">
												Verificada
											</span>
										</>
									)}

									{company.approvalStatus === "REJECTED" && (
										<>
											<span className="size-2 shrink-0 rounded-full bg-danger" />

											<span className="block truncate font-jetbrains-mono text-[13px] text-foreground-inverse-muted">
												Rejeitada
											</span>
										</>
									)}
								</div>
							</div>

							<ChevronsUpDown className="ml-auto size-4 text-foreground-inverse-muted" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-foreground-secondary text-xs">
							Empresas
						</DropdownMenuLabel>

						<DropdownMenuItem
							className="cursor-pointer gap-2 p-2"
							onClick={() => navigate({ to: `/app/${company.slug}` })}
						>
							<div className="flex size-6 items-center justify-center rounded-md border border-border">
								<Building2 className="size-3.5 shrink-0 text-foreground-secondary" />
							</div>

							<span className="truncate text-foreground-primary">
								{company.socialReason}
							</span>

							<DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="cursor-pointer gap-2 p-2"
							onClick={() => navigate({ to: "/" })}
						>
							<div className="flex size-6 items-center justify-center rounded-md border border-border bg-transparent">
								<Plus className="size-4 text-foreground-secondary" />
							</div>

							<div className="font-medium text-foreground-secondary">
								Registrar empresa
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
