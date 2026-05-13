import { formatCurrency } from "@repo/core/utils/format-currency";
import {
	CheckCircle,
	Flame,
	Navigation,
	Paintbrush,
	Repeat,
	Star,
	Truck,
} from "lucide-react";
import { ProfileRow } from "../_shared/-profile-row";

export function ClientRecentOrders() {
	return (
		<section className="flex flex-col gap-4 pt-2">
			<header className="flex items-end justify-between">
				<div className="flex flex-col gap-1.5">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Pedidos recentes
					</span>
					<h3 className="font-instrument-serif text-foreground-primary text-xl tracking-tight">
						Sua atividade dos últimos 30 dias
					</h3>
				</div>

				<button
					className="cursor-pointer font-jetbrains-mono font-medium text-[12px] text-foreground-primary hover:underline"
					type="button"
				>
					Ver tudo →
				</button>
			</header>

			<div className="flex flex-col gap-2.5">
				<ProfileRow
					accent
					action={
						<button
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-navy px-3.5 py-2 font-inter font-medium text-[12px] text-foreground-inverse hover:bg-surface-navy/90"
							type="button"
						>
							<Navigation className="h-3.25 w-3.25" />
							Acompanhar
						</button>
					}
					icon={<Truck className="h-5.5 w-5.5 text-surface-accent" />}
					iconBg="bg-surface-accent-soft"
					id="#4821"
					status={
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#5C82FF26] px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-surface-accent">
							<span className="h-1.5 w-1.5 rounded-full bg-surface-accent" />A
							caminho · ETA 14 min
						</span>
					}
					subtitle="HidroFix Reparos · Carlos Rocha · hoje, 15:00"
					title="Conserto de chuveiro elétrico"
					value={formatCurrency.format(180)}
				/>

				<ProfileRow
					action={
						<button
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 font-inter font-medium text-[12px] text-foreground-primary hover:bg-surface/40"
							type="button"
						>
							<Repeat className="h-3.25 w-3.25" />
							Pedir de novo
						</button>
					}
					icon={<Flame className="h-5.5 w-5.5 text-foreground-primary" />}
					iconBg="bg-surface-tertiary"
					id="#4810"
					status={
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A3D26] px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-success">
							<CheckCircle className="h-2.25 w-2.25" />
							Concluído · 5 ★
						</span>
					}
					subtitle="Hidromaster SP · Marcos Silva · 12 abr, 10:30"
					title="Manutenção de aquecedor a gás"
					value={formatCurrency.format(540)}
				/>

				<ProfileRow
					action={
						<button
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-navy px-3.5 py-2 font-inter font-medium text-[12px] text-foreground-inverse hover:bg-surface-navy/90"
							type="button"
						>
							<Star className="h-3.25 w-3.25" />
							Avaliar serviço
						</button>
					}
					icon={<Paintbrush className="h-5.5 w-5.5 text-foreground-primary" />}
					iconBg="bg-surface-tertiary"
					id="#4798"
					status={
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A3D26] px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-success">
							<CheckCircle className="h-2.25 w-2.25" />
							Concluído · aguarda avaliação
						</span>
					}
					subtitle="Casa Cor Studio · Ana Beatriz · 28 mar"
					title="Pintura de sala · 24 m²"
					value={formatCurrency.format(1240)}
				/>
			</div>
		</section>
	);
}
