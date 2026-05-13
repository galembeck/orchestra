interface Request {
	id: string;
	service: string;
	client: string;
	address: string;
	status: "in_progress" | "scheduled" | "done" | "canceled";
	value: string;
}

const requests: Request[] = [
	{
		id: "#4582",
		service: "Reparo Hidráulico",
		client: "Túlio Pages",
		address: "R. Cardoso de Almeida, 1129",
		status: "in_progress",
		value: "240",
	},
	{
		id: "#4581",
		service: "Inspeção Elétrica",
		client: "Carolina Lima",
		address: "R. João Cachoeira, 87",
		status: "scheduled",
		value: "180",
	},
	{
		id: "#4580",
		service: "Instalação de Ar",
		client: "Marcelo Ávila",
		address: "Av. Brigadeiro Faria Lima, 2200",
		status: "done",
		value: "560",
	},
	{
		id: "#4579",
		service: "Pintura — sala",
		client: "Helena Ribeiro",
		address: "R. Aspicuelta, 410",
		status: "canceled",
		value: "320",
	},
];

const statusLabel: Record<Request["status"], string> = {
	in_progress: "Em execução",
	scheduled: "Agendado",
	done: "Concluído",
	canceled: "Cancelado",
};

const statusStyles: Record<Request["status"], string> = {
	in_progress: "border-foreground-primary/30 bg-foreground-primary/10 text-foreground-primary",
	scheduled: "border-border bg-surface text-foreground-tertiary",
	done: "border-success/30 bg-success/10 text-success",
	canceled: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function RecentRequests() {
	return (
		<section className="flex flex-col gap-4 rounded-[14px] border border-border bg-surface-paper-soft p-6">
			<header className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Pedidos recentes
					</span>
					<h3 className="font-instrument-serif text-foreground-primary text-xl">
						Acompanhe o que está em andamento
					</h3>
				</div>

				<button
					className="font-jetbrains-mono text-[11px] text-foreground-primary hover:underline"
					type="button"
				>
					Ver todos
				</button>
			</header>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px] border-collapse">
					<thead>
						<tr className="border-border border-b text-left font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-wider">
							<th className="py-2 pr-3 font-medium">ID</th>
							<th className="py-2 pr-3 font-medium">Serviço</th>
							<th className="py-2 pr-3 font-medium">Cliente</th>
							<th className="py-2 pr-3 font-medium">Endereço</th>
							<th className="py-2 pr-3 font-medium">Status</th>
							<th className="py-2 pl-3 text-right font-medium">Valor</th>
						</tr>
					</thead>

					<tbody>
						{requests.map((req) => (
							<tr className="border-border border-b last:border-b-0" key={req.id}>
								<td className="py-3 pr-3 font-jetbrains-mono text-[12px] text-foreground-tertiary">
									{req.id}
								</td>
								<td className="py-3 pr-3 font-inter font-medium text-[13px] text-foreground-primary">
									{req.service}
								</td>
								<td className="py-3 pr-3 font-inter text-[13px] text-foreground-primary">
									{req.client}
								</td>
								<td className="py-3 pr-3 font-inter text-[12px] text-foreground-tertiary">
									{req.address}
								</td>
								<td className="py-3 pr-3">
									<span
										className={`inline-block rounded-full border px-2 py-0.5 font-jetbrains-mono text-[10px] uppercase tracking-wider ${statusStyles[req.status]}`}
									>
										{statusLabel[req.status]}
									</span>
								</td>
								<td className="py-3 pl-3 text-right font-jetbrains-mono font-semibold text-[13px] text-foreground-primary">
									R$ {req.value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
