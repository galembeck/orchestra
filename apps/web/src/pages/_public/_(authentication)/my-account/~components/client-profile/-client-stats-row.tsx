import { formatCurrency } from "@repo/core/utils/format-currency";
import { Star } from "lucide-react";
import { StatCard } from "../_shared/-stat-card";

const STAR_INDICES = [0, 1, 2, 3, 4];

export function ClientStatsRow() {
	return (
		<section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				caption="Último: hoje · 14:32"
				eyebrow="Pedidos concluídos"
				value="38"
			/>
			<StatCard
				caption={
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#5C82FF26] px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-surface-accent">
						<span className="h-1.5 w-1.5 rounded-full bg-surface-accent" />A
						caminho · #4821
					</span>
				}
				eyebrow="Em andamento"
				value="1"
			/>
			<StatCard
				caption={
					<span className="text-success">Economizou R$ 320 com PIX</span>
				}
				eyebrow="Gasto total · 2025"
				value={formatCurrency.format(4860)}
			/>
			<StatCard
				caption="Média 4.8 entregue"
				eyebrow="Avaliações enviadas"
				value={
					<span className="flex items-end gap-2">
						<span>32</span>
						<span className="flex items-center gap-0.5 pb-2">
							{STAR_INDICES.map((i) => (
								<Star
									className="h-2.75 w-2.75 fill-warning text-warning"
									key={i}
								/>
							))}
						</span>
					</span>
				}
			/>
		</section>
	);
}
