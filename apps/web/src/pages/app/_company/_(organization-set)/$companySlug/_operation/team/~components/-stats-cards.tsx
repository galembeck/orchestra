import type { LucideIcon } from "lucide-react";
import { Clock, MailOpen, UserCheck } from "lucide-react";

interface Stat {
	description: string;
	icon: LucideIcon;
	label: string;
	tone: "neutral" | "warning" | "info";
	value: number;
}

interface TeamStatsCardsProps {
	activeMembers: number;
	pendingActions: number;
	pendingInvites: number;
}

export function TeamStatsCards({
	activeMembers,
	pendingInvites,
	pendingActions,
}: TeamStatsCardsProps) {
	const items: Stat[] = [
		{
			description: "Colaboradores com acesso ao painel",
			icon: UserCheck,
			label: "Profissionais ativos",
			tone: "neutral",
			value: activeMembers,
		},
		{
			description: "Convites enviados aguardando aceite",
			icon: MailOpen,
			label: "Pares convidados",
			tone: "info",
			value: pendingInvites,
		},
		{
			description: "Ações pendentes nesta semana",
			icon: Clock,
			label: "Ações pendentes",
			tone: "warning",
			value: pendingActions,
		},
	];

	return (
		<section className="grid grid-cols-1 gap-3 md:grid-cols-3">
			{items.map((it) => {
				const Icon = it.icon;
				const toneStyles =
					it.tone === "warning"
						? "bg-warning/10 text-warning"
						: // biome-ignore lint/style/noNestedTernary: not important in this context
							it.tone === "info"
							? "bg-accent/10 text-foreground-accent"
							: "bg-surface-secondary text-foreground-secondary";

				return (
					<article
						className="flex flex-col gap-3 rounded-lg border border-border bg-surface-paper-soft p-5"
						key={it.label}
					>
						<header className="flex items-center justify-between">
							<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
								{it.label}
							</span>
							<span
								className={`flex h-7 w-7 items-center justify-center rounded-full ${toneStyles}`}
							>
								<Icon className="h-3.5 w-3.5" />
							</span>
						</header>

						<div className="flex items-baseline gap-2">
							<p className="font-instrument-serif text-3xl text-foreground-primary">
								{it.value}
							</p>
						</div>

						<p className="text-foreground-secondary text-xs">
							{it.description}
						</p>
					</article>
				);
			})}
		</section>
	);
}
