import type { PublicUserDTO } from "@repo/core/models/user.model";
import { getUserInitials } from "@repo/core/utils/get-user-initials";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	Avatar,
	AvatarFallback,
} from "@repo/ui/components/molecules/avatar/avatar";
import { CheckCircle, Ellipsis, MapPin, PenLine } from "lucide-react";

interface ProfileInformationCardProps {
	user: PublicUserDTO;
}

export function ProfileInformationCard({ user }: ProfileInformationCardProps) {
	return (
		<div className="flex w-full flex-col justify-between rounded-[18px] border border-border bg-surface-paper-soft p-7 lg:flex-row lg:items-center">
			<div className="flex items-center gap-6">
				<Avatar className="h-24 w-24">
					<AvatarFallback className="rounded-full bg-surface-navy font-semibold text-2xl text-foreground-inverse uppercase">
						{getUserInitials(user.name)}
					</AvatarFallback>
				</Avatar>

				<article className="flex flex-col gap-2.5">
					<div className="flex items-center gap-2.5">
						<h2 className="font-instrument-serif text-2xl text-foreground-primary">
							{user.name}
						</h2>

						<Badge className="bg-[#1F7A3D26] font-jetbrains-mono font-semibold text-[10px] text-success uppercase">
							<CheckCircle className="h-2.75 w-2.75 text-success" /> Verificado
						</Badge>
					</div>

					<div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
						<p className="flex items-center gap-2 font-jetbrains-mono text-[13px] text-foreground-secondary">
							<MapPin className="h-3.25 w-3.25 text-foreground-secondary" />
							{user.neighborhood}, {user.city} · {user.state}
						</p>
					</div>
				</article>
			</div>

			<div className="flex items-center justify-end gap-2.5">
				<button
					className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2.5 font-inter font-medium text-[13px] text-foreground-primary hover:bg-surface/40"
					type="button"
				>
					<PenLine className="h-4 w-4 text-foreground-primary" />
					Editar informações
				</button>

				<button
					className="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface hover:bg-surface/40"
					type="button"
				>
					<Ellipsis className="h-4 w-4 text-foreground-primary" />
				</button>
			</div>
		</div>
	);
}
