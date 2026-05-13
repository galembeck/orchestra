import { TrendingUp } from "lucide-react";

const days = [
	{ label: "S", value: 320 },
	{ label: "T", value: 480 },
	{ label: "Q", value: 410 },
	{ label: "Q", value: 660 },
	{ label: "S", value: 520 },
	{ label: "S", value: 740 },
	{ label: "D", value: 920, today: true },
];

export function RevenueChart() {
	const max = Math.max(...days.map((d) => d.value));
	const total = days.reduce((acc, d) => acc + d.value, 0);

	return (
		<section className="flex h-full flex-col gap-5 rounded-[14px] border border-border bg-surface-paper-soft p-6">
			<header className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Receita por dia
					</span>
					<div className="flex items-baseline gap-2">
						<h3 className="font-instrument-serif text-3xl text-foreground-primary">
							R$ {total.toLocaleString("pt-BR")}
						</h3>
						<span className="flex items-center gap-1 font-jetbrains-mono font-semibold text-success text-xs">
							<TrendingUp className="h-3 w-3" />
							+12,4%
						</span>
					</div>
				</div>

				<div className="flex gap-1 rounded-md border border-border bg-surface p-1 font-jetbrains-mono text-[11px]">
					<button
						className="rounded-sm bg-surface-raised px-2.5 py-1 text-foreground-primary"
						type="button"
					>
						7d
					</button>
					<button
						className="rounded-sm px-2.5 py-1 text-foreground-tertiary"
						type="button"
					>
						30d
					</button>
				</div>
			</header>

			<div className="flex h-40 items-end gap-3">
				{days.map((day) => {
					const heightPct = (day.value / max) * 100;
					return (
						<div
							className="flex flex-1 flex-col items-center gap-2"
							key={`${day.label}-${day.value}`}
						>
							<div className="relative flex h-full w-full items-end">
								<div
									className={`w-full rounded-t-sm transition-colors ${day.today ? "bg-foreground-primary" : "bg-foreground-primary/20"}`}
									style={{ height: `${heightPct}%` }}
								/>
							</div>
							<span
								className={`font-jetbrains-mono text-[10px] uppercase ${day.today ? "font-semibold text-foreground-primary" : "text-foreground-tertiary"}`}
							>
								{day.label}
							</span>
						</div>
					);
				})}
			</div>
		</section>
	);
}
