import { COMPANY_STATS } from "@repo/core/constants/company-stats";

export function AuthVisualPanel() {
	return (
		<aside className="sticky top-0 hidden h-screen flex-col justify-between bg-surface-navy px-13 py-15 xl:flex xl:w-150 dark:bg-surface-navy-2">
			<div className="flex flex-col gap-3.5">
				<div className="flex w-fit items-center gap-2 rounded-full border border-border-on-navy bg-surface-navy-2 px-3.5 py-1.5">
					<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />

					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse uppercase tracking-[1.5px]">
						Plataforma nº 1 em serviços
					</span>
				</div>

				<h2 className="font-instrument-serif text-[48px] text-foreground-inverse leading-[1.1] tracking-[-1.2px]">
					Sua orquestra de serviços já tocou hoje?
				</h2>

				<p className="font-inter text-[15px] text-foreground-inverse-muted leading-[1.55]">
					12.400 empresas, 320 cidades e R$ 320 milhões em PIX já passaram por
					aqui em 2025.
				</p>
			</div>

			<div className="flex flex-col gap-4 rounded-[14px] border border-border-on-navy bg-surface-navy-2 p-[22px]">
				<div className="flex items-center justify-between">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse-muted uppercase tracking-[1.5px]">
						Serviço #4821 · a caminho
					</span>
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse-muted tracking-[1.5px]">
						ETA 14 min
					</span>
				</div>

				<div className="flex items-center gap-3.5">
					<div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-surface">
						<span className="font-jetbrains-mono font-semibold text-[13px] text-foreground-primary">
							CR
						</span>
					</div>

					<div className="flex flex-col gap-[3px]">
						<span className="font-inter font-semibold text-[14px] text-foreground-inverse">
							Carlos · HidroFix Reparos
						</span>
						<span className="font-jetbrains-mono text-[12px] text-foreground-inverse-muted">
							Conserto de chuveiro · 2.4 km
						</span>
					</div>
				</div>

				<div className="flex items-center gap-1.5">
					<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
					<span className="h-0.5 flex-1 bg-success" />
					<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
					<span className="h-0.5 flex-1 bg-border-on-navy" />
					<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-border-on-navy" />
					<span className="h-0.5 flex-1 bg-border-on-navy" />
					<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-border-on-navy" />
				</div>
			</div>

			<div className="flex gap-6 border-border-on-navy border-t pt-5">
				{COMPANY_STATS.map(({ value, label }) => (
					<div className="flex flex-1 flex-col gap-1.5" key={label}>
						<span className="font-instrument-serif text-[32px] text-foreground-inverse tracking-[-0.8px]">
							{value}
						</span>

						<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse-muted tracking-[1.5px]">
							{label}
						</span>
					</div>
				))}
			</div>
		</aside>
	);
}
