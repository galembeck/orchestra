interface AgendaItem {
	time: string;
	title: string;
	description: string;
	status: "confirmed" | "pending" | "incoming";
}

const items: AgendaItem[] = [
	{
		time: "09:00",
		title: "Túlio Pages — Bairro X",
		description: "Reparo hidráulico residencial",
		status: "confirmed",
	},
	{
		time: "11:30",
		title: "Carolina Lima — Itaim",
		description: "Inspeção elétrica preventiva",
		status: "incoming",
	},
	{
		time: "14:00",
		title: "Marcelo Ávila — Pinheiros",
		description: "Visita técnica + orçamento",
		status: "pending",
	},
	{
		time: "16:30",
		title: "Helena Ribeiro — Vila Madalena",
		description: "Instalação de aquecedor",
		status: "incoming",
	},
];

const statusStyles: Record<AgendaItem["status"], string> = {
	confirmed:
		"border-success/30 bg-success/10 text-success",
	pending: "border-border bg-surface text-foreground-tertiary",
	incoming: "border-foreground-primary/30 bg-surface text-foreground-primary",
};

const statusLabel: Record<AgendaItem["status"], string> = {
	confirmed: "Confirmado",
	pending: "Pendente",
	incoming: "Em rota",
};

export function AgendaList() {
	return (
		<section className="flex flex-col gap-4 rounded-[14px] border border-border bg-surface-paper-soft p-6">
			<header className="flex items-center justify-between">
				<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Agenda · Hoje
				</span>
				<button
					className="font-jetbrains-mono text-[11px] text-foreground-primary hover:underline"
					type="button"
				>
					Ver tudo
				</button>
			</header>

			<ul className="flex flex-col gap-3">
				{items.map((item) => (
					<li
						className="flex items-start gap-3 rounded-md border border-border bg-surface px-3 py-2.5"
						key={item.time + item.title}
					>
						<div className="flex flex-col items-center gap-0.5">
							<span className="font-jetbrains-mono font-semibold text-foreground-primary text-xs">
								{item.time}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-1">
							<span className="font-inter font-medium text-[13px] text-foreground-primary leading-tight">
								{item.title}
							</span>
							<span className="font-inter text-[11px] text-foreground-tertiary">
								{item.description}
							</span>
						</div>

						<span
							className={`shrink-0 rounded-full border px-2 py-0.5 font-jetbrains-mono text-[10px] uppercase tracking-wider ${statusStyles[item.status]}`}
						>
							{statusLabel[item.status]}
						</span>
					</li>
				))}
			</ul>
		</section>
	);
}
