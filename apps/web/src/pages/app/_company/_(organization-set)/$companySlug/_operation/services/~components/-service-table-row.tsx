import type { ServiceDTO } from "@repo/core/models/service.model";
import { formatCurrency } from "@repo/core/utils/format-currency";
import { TableCell, TableRow } from "@repo/ui/components/molecules/table/table";
import { Star } from "lucide-react";

export function ServiceTableRow({ service }: { service: ServiceDTO }) {
	return (
		<TableRow>
			<TableCell className="font-medium">{service.categoryName}</TableCell>

			<TableCell className="text-foreground-secondary">
				{service.serviceType}
			</TableCell>

			<TableCell className="text-foreground-secondary">
				{service.neighborhood}, {service.city} - {service.state}
			</TableCell>

			<TableCell className="text-right font-medium">
				{service.budgetable ? (
					<span
						className={
							"shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-wider"
						}
					>
						Sob consulta
					</span>
				) : (
					<span className="font-medium">
						{formatCurrency.format(service.price ?? 0)}
					</span>
				)}
			</TableCell>

			<TableCell className="text-right">
				{service.reviewsCount === 0 ? (
					<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary">
						Sem avaliações
					</span>
				) : (
					<span className="inline-flex items-center gap-1 font-medium text-sm">
						<Star className="h-3.5 w-3.5 fill-current text-warning" />

						{service.rating.toFixed(1)}

						<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary">
							({service.reviewsCount})
						</span>
					</span>
				)}
			</TableCell>

			<TableCell>
				<span
					className={`shrink-0 rounded-full border px-2 py-0.5 font-jetbrains-mono text-[10px] uppercase tracking-wider ${
						service.isActive
							? "border-success/30 bg-success/10 text-success"
							: "border-border bg-surface text-foreground-tertiary"
					}`}
				>
					{service.isActive ? "Ativo" : "Inativo"}
				</span>
			</TableCell>
		</TableRow>
	);
}
