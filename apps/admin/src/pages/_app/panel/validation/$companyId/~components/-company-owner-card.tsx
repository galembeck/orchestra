import type { CompanyRegistrationDetail } from "@repo/core/types/company-registration";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { User } from "lucide-react";

interface DetailFieldProps {
	label: string;
	mono?: boolean;
	value: string | null | undefined;
}

function DetailField({ label, value, mono = false }: DetailFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.2px]">
				{label}
			</span>
			<span
				className={`text-foreground-primary text-sm ${mono ? "font-jetbrains-mono" : "font-inter"}`}
			>
				{value ?? "—"}
			</span>
		</div>
	);
}

interface CompanyOwnerCardProps {
	company: CompanyRegistrationDetail;
}

export function CompanyOwnerCard({ company }: CompanyOwnerCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<User className="h-4 w-4 text-foreground-tertiary" />
					<CardTitle>Responsável</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<DetailField label="Nome" value={company.ownerName} />
				<DetailField label="E-mail" value={company.ownerEmail} />
				<DetailField label="Telefone" mono value={company.ownerPhone} />
			</CardContent>
		</Card>
	);
}
