import type { PublicUserDTO } from "@repo/core/models/user.model";
import { formatMemberSince } from "@repo/core/utils/format-member-since";
import { getUserInitials } from "@repo/core/utils/get-user-initials";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	Avatar,
	AvatarFallback,
} from "@repo/ui/components/molecules/avatar/avatar";
import {
	Calendar,
	CheckCircle,
	Ellipsis,
	MapPin,
	PenLine,
	Phone,
} from "lucide-react";
import { MetaItem } from "../_shared/-meta-item";

function buildLocation(user: PublicUserDTO) {
	const parts = [user.neighborhood, user.city].filter(Boolean);
	if (user.state) {
		return `${parts.join(", ")} · ${user.state}`;
	}
	return parts.join(", ");
}

interface ClientHeaderCardProps {
	user: PublicUserDTO;
}

export function ClientHeaderCard({ user }: ClientHeaderCardProps) {
	return (
		<section className="flex w-full flex-col gap-6 rounded-[18px] border border-border bg-surface-paper-soft p-7 lg:flex-row lg:items-center">
			<div className="flex items-center gap-6">
				<Avatar className="h-24 w-24">
					<AvatarFallback className="rounded-full bg-surface-navy font-instrument-serif text-3xl text-foreground-inverse uppercase">
						{getUserInitials(user.name)}
					</AvatarFallback>
				</Avatar>

				<article className="flex flex-col gap-2.5">
					<div className="flex items-center gap-3">
						<h2 className="font-instrument-serif text-3xl text-foreground-primary tracking-tight">
							{user.name}
						</h2>

						<Badge className="bg-[#1F7A3D26] font-jetbrains-mono font-semibold text-[10px] text-success uppercase">
							<CheckCircle className="h-2.75 w-2.75 text-success" />
							Verificado
						</Badge>
					</div>

					<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
						<MetaItem icon={<MapPin className="h-3.25 w-3.25" />}>
							{buildLocation(user) || "Endereço não informado"}
						</MetaItem>

						<MetaItem icon={<Calendar className="h-3.25 w-3.25" />}>
							{formatMemberSince(user.createdAt)}
						</MetaItem>

						{user.cellphone ? (
							<MetaItem icon={<Phone className="h-3.25 w-3.25" />}>
								{user.cellphone}
							</MetaItem>
						) : null}
					</div>
				</article>
			</div>

			<div className="flex items-center gap-2.5 lg:ml-auto">
				<button
					className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2.5 font-inter font-medium text-[13px] text-foreground-primary hover:bg-surface/40"
					type="button"
				>
					<PenLine className="h-3.25 w-3.25 text-foreground-primary" />
					Editar perfil
				</button>

				<button
					aria-label="Mais opções"
					className="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface hover:bg-surface/40"
					type="button"
				>
					<Ellipsis className="h-4 w-4 text-foreground-primary" />
				</button>
			</div>
		</section>
	);
}
