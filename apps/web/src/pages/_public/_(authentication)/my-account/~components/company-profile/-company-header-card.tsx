import type { PublicUserDTO } from "@repo/core/models/user.model";
import { formatCNPJ } from "@repo/core/utils/format-masks";
import { getCompanyInitials } from "@repo/core/utils/get-company-initials";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	Avatar,
	AvatarFallback,
} from "@repo/ui/components/molecules/avatar/avatar";
import {
	BadgeCheck,
	Building2,
	Ellipsis,
	MapPin,
	PenLine,
	UserPlus,
} from "lucide-react";
import { MetaItem } from "../_shared/-meta-item";

interface CompanyHeaderCardProps {
	user: PublicUserDTO;
}

export function CompanyHeaderCard({ user }: CompanyHeaderCardProps) {
	const company = user.company;
	const fantasyName = company?.fantasyName ?? user.name;
	const initials = getCompanyInitials(fantasyName);
	const cnpjLine = company?.cnpj
		? `CNPJ ${formatCNPJ(company.cnpj)}`
		: "CNPJ não informado";
	const isApproved = company?.approvalStatus === "APPROVED";

	return (
		<section className="flex w-full flex-col gap-6 rounded-[18px] border border-border bg-surface-paper-soft p-7 lg:flex-row lg:items-center">
			<div className="flex items-center gap-6">
				<Avatar className="h-24 w-24">
					<AvatarFallback className="rounded-full bg-surface-navy font-instrument-serif text-3xl text-foreground-inverse uppercase">
						{initials}
					</AvatarFallback>
				</Avatar>

				<article className="flex flex-col gap-2.5">
					<div className="flex items-center gap-3">
						<h2 className="font-instrument-serif text-3xl text-foreground-primary tracking-tight">
							{user.name}
						</h2>

						<Badge
							className={
								isApproved
									? "bg-[#1F7A3D26] font-jetbrains-mono font-semibold text-[10px] text-success uppercase"
									: "bg-[#FFB02C26] font-jetbrains-mono font-semibold text-[10px] text-warning uppercase"
							}
						>
							<BadgeCheck className="h-2.75 w-2.75" />
							{isApproved ? "Empresa aprovada" : "Aprovação pendente"}
						</Badge>
					</div>

					<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
						<MetaItem icon={<Building2 className="h-3.25 w-3.25" />}>
							{cnpjLine}
						</MetaItem>

						<MetaItem icon={<MapPin className="h-3.25 w-3.25" />}>
							{company?.city} / {company?.state}
						</MetaItem>

						<MetaItem icon={<UserPlus className="h-3.25 w-3.25" />}>
							Dono: {user.name}
						</MetaItem>
					</div>
				</article>
			</div>

			<div className="flex items-center gap-2.5 lg:ml-auto">
				<button
					className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2.5 font-inter font-medium text-[13px] text-foreground-primary hover:bg-surface/40"
					type="button"
				>
					<PenLine className="h-3.25 w-3.25 text-foreground-primary" />
					Editar empresa
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
