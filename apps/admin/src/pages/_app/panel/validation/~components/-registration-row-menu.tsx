import type { CompanyRegistrationItem } from "@repo/core/types/company-registration";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { Building2, FileText, MoreHorizontal } from "lucide-react";

interface RegistrationRowMenuProps {
	company: CompanyRegistrationItem;
}

export function RegistrationRowMenu({ company }: RegistrationRowMenuProps) {
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="Mais ações"
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-surface hover:text-foreground-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					type="button"
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Ações</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						navigate({
							to: `/panel/validation/${company.id}` as never,
						})
					}
				>
					<Building2 />
					Detalhes da empresa
				</DropdownMenuItem>
				<DropdownMenuItem>
					<FileText />
					Ver documentos
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
