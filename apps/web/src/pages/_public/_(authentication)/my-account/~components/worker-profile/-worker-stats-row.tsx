import { formatCurrency } from "@repo/core/utils/format-currency";
import { Star } from "lucide-react";
import { StatCard } from "../_shared/-stat-card";

const STAR_INDICES = [0, 1, 2, 3, 4];

export function WorkerStatsRow() {
	return (
		<section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				caption="Último: hoje · 09:40"
				eyebrow="Atendimentos realizados"
				value="126"
			/>
			<StatCard
				caption={
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#5C82FF26] px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-surface-accent">
						<span className="h-1.5 w-1.5 rounded-full bg-surface-accent" />
						Próximo · 14:00 · #4821
					</span>
				}
				eyebrow="Agenda hoje"
				value="3"
			/>
			<StatCard
				caption="Comissão líquida após 12% taxa"
				eyebrow="Ganhos · 2025"
				value={formatCurrency.format(28_640)}
			/>
			<StatCard
				caption="Média 4.9 · entregue"
				eyebrow="Avaliações recebidas"
				value={
					<span className="flex items-end gap-2">
						<span>118</span>
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
