// apps/admin/src/pages/_app/panel/administrators/platform/~components/-administrator-row-menu.tsx
import type { AdminUserListItem } from "@repo/core/types/admin-user";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/molecules/dropdown-menu/dropdown-menu";
import { MoreHorizontal, ShieldCheck } from "lucide-react";

interface AdministratorRowMenuProps {
	user: AdminUserListItem;
	onEditPermissions: (user: AdminUserListItem) => void;
}

export function AdministratorRowMenu({
	user,
	onEditPermissions,
}: AdministratorRowMenuProps) {
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
				<DropdownMenuItem onClick={() => onEditPermissions(user)}>
					<ShieldCheck />
					Editar permissões
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
