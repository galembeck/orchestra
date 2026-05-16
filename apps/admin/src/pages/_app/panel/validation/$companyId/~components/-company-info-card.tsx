import type { CompanyRegistrationDetail } from "@repo/core/types/company-registration";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { Building2 } from "lucide-react";

const CNPJ_REGEX = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;

function formatCnpj(cnpj: string): string {
	return cnpj.replace(CNPJ_REGEX, "$1.$2.$3/$4-$5");
}

interface DetailFieldProps {
	label: string;
	value: string | null | undefined;
	mono?: boolean;
}

function DetailField({ label, value, mono = false }: DetailFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.2px]">
				{label}
			</span>
			<span
				className={`text-sm text-foreground-primary ${mono ? "font-jetbrains-mono" : "font-inter"}`}
			>
				{value ?? "—"}
			</span>
		</div>
	);
}

interface CompanyInfoCardProps {
	company: CompanyRegistrationDetail;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Building2 className="h-4 w-4 text-foreground-tertiary" />
					<CardTitle>Dados da empresa</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<DetailField label="Nome fantasia" value={company.fantasyName} />
				<DetailField label="Razão social" value={company.socialReason} />
				<DetailField label="CNPJ" mono value={formatCnpj(company.cnpj)} />
				<DetailField label="Slug" mono value={company.slug} />
			</CardContent>
		</Card>
	);
}
