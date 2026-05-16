import type { CompanyRegistrationDetail } from "@repo/core/types/company-registration";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { MapPin } from "lucide-react";

const ZIP_REGEX = /^(\d{5})(\d{3})$/;

function formatZipCode(zip: string): string {
	return zip.replace(ZIP_REGEX, "$1-$2");
}

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

interface CompanyAddressCardProps {
	company: CompanyRegistrationDetail;
}

export function CompanyAddressCard({ company }: CompanyAddressCardProps) {
	const streetLine = [company.street, company.number]
		.filter(Boolean)
		.join(", ");

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<MapPin className="h-4 w-4 text-foreground-tertiary" />
					<CardTitle>Endereço</CardTitle>
				</div>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<DetailField
					label="CEP"
					mono
					value={company.zipCode ? formatZipCode(company.zipCode) : null}
				/>

				<DetailField label="Logradouro" value={streetLine || null} />

				<DetailField label="Complemento" value={company.complement || null} />

				<DetailField label="Bairro" value={company.neighborhood} />

				<DetailField label="Cidade" value={company.city} />

				<DetailField label="Estado" value={company.state} />
			</CardContent>
		</Card>
	);
}
