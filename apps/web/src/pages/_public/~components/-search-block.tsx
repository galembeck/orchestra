import { Button } from "@repo/ui/components/atoms/button/button";
import {
	Building2,
	Calendar,
	Factory,
	HelpCircle,
	House,
	MapPin,
	Search,
} from "lucide-react";
import { useState } from "react";

const tabs = [
	{ id: "residencial", label: "Residencial", icon: House },
	{ id: "empresarial", label: "Empresarial", icon: Building2 },
	{ id: "industrial", label: "Industrial", icon: Factory },
] as const;

type TabId = (typeof tabs)[number]["id"];

const popularTags = [
	"Vazamento de pia",
	"Instalação de ar-condicionado",
	"Pintura de sala",
	"Mudança rápida",
];

export function SearchBlock() {
	const [activeTab, setActiveTab] = useState<TabId>("residencial");

	return (
		<div className="flex w-full flex-col gap-[18px]">
			<div className="flex items-center gap-0 overflow-x-auto rounded-xl border border-border bg-surface-paper-soft p-1.5">
				<div className="flex shrink-0 items-center gap-4">
					{tabs.map(({ id, label, icon: Icon }, index) => (
						<>
							<button
								className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-[18px] py-2.5 font-inter font-medium text-[13px] transition-colors ${
									activeTab === id
										? "bg-foreground-primary text-surface"
										: "hover:bg-surface-paper-soft/80"
								}`}
								key={id}
								onClick={() => setActiveTab(id)}
								type="button"
							>
								<Icon className="h-3.5 w-3.5" />
								{label}
							</button>

							{index < tabs.length - 1 && (
								<div className="h-4 w-px shrink-0 bg-border" />
							)}
						</>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-1 rounded-[14px] border border-border bg-surface-paper-soft p-2.5 lg:flex-row lg:items-center lg:gap-2">
				<div className="flex flex-1 flex-col gap-1 px-4 py-2">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1px]">
						O que você precisa?
					</span>
					<div className="flex items-center gap-1.5">
						<HelpCircle className="h-3.5 w-3.5 shrink-0 text-foreground-primary" />
						<span className="font-inter font-medium text-foreground-primary text-sm">
							Conserto de chuveiro elétrico
						</span>
					</div>
				</div>

				<div className="mx-4 h-px bg-border lg:mx-0 lg:h-8 lg:w-px lg:shrink-0" />

				<div className="flex flex-1 flex-col gap-1 px-4 py-2">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1px]">
						Onde?
					</span>
					<div className="flex items-center gap-1.5">
						<MapPin className="h-3.5 w-3.5 shrink-0 text-foreground-primary" />
						<span className="font-inter font-medium text-foreground-primary text-sm">
							Pinheiros, São Paulo
						</span>
					</div>
				</div>

				<div className="mx-4 h-px bg-border lg:mx-0 lg:h-8 lg:w-px lg:shrink-0" />

				<div className="flex flex-1 flex-col gap-1 px-4 py-2">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1px]">
						Quando?
					</span>
					<div className="flex items-center gap-1.5">
						<Calendar className="h-3.5 w-3.5 shrink-0 text-foreground-primary" />
						<span className="font-inter font-medium text-foreground-primary text-sm">
							Hoje, agora
						</span>
					</div>
				</div>

				<Button
					className="mt-1 w-full lg:mt-0 lg:w-auto lg:shrink-0"
					variant="accent"
				>
					<Search />
					Buscar
				</Button>
			</div>

			<div className="flex flex-wrap items-center gap-2.5">
				<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Populares
				</span>
				{popularTags.map((tag) => (
					<button
						className="rounded-full border border-border bg-surface-paper-soft px-3.5 py-[7px] font-inter text-[13px] text-foreground-secondary transition-colors hover:bg-surface-tertiary"
						key={tag}
						type="button"
					>
						{tag}
					</button>
				))}
			</div>
		</div>
	);
}
