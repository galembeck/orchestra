import {
	ScrollArea,
	ScrollBar,
} from "@repo/ui/components/atoms/scroll-area/scroll-area";
import {
	Banknote,
	ClipboardCheck,
	LayoutList,
	ShieldCheck,
	Truck,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export type FaqCategory = "all" | "account" | "payment" | "operation" | "lgpd";

const categories: { key: FaqCategory; label: string; icon: React.ReactNode }[] =
	[
		{ key: "all", label: "Todas", icon: <LayoutList className="h-3 w-3" /> },
		{
			key: "account",
			label: "Cadastro & validação",
			icon: <ClipboardCheck className="h-3 w-3" />,
		},
		{
			key: "payment",
			label: "Pagamentos & PIX",
			icon: <Banknote className="h-3 w-3" />,
		},
		{
			key: "operation",
			label: "Operações & equipe",
			icon: <Truck className="h-3 w-3" />,
		},
		{
			key: "lgpd",
			label: "LGPD & segurança",
			icon: <ShieldCheck className="h-3 w-3" />,
		},
	];

export function SearchByCategories() {
	const [category, setCategory] = useQueryState(
		"category",
		parseAsString.withDefault("all"),
	);

	return (
		<div className="w-full min-w-0 lg:max-w-max lg:flex-1">
			<ScrollArea className="w-full whitespace-nowrap">
				<div className="flex w-max items-center gap-1.5">
					{categories.map(({ key, label, icon }) => {
						const isActive = category === key;
						return (
							<button
								className={
									isActive
										? "flex cursor-pointer items-center gap-1.5 rounded-full border bg-surface-navy px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-inverse transition-all duration-200 hover:bg-surface-navy-2"
										: "flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
								}
								key={key}
								onClick={() => setCategory(key === "all" ? null : key)}
								type="button"
							>
								<span
									className={
										isActive
											? "text-foreground-inverse"
											: "text-foreground-secondary"
									}
								>
									{icon}
								</span>
								{label}
							</button>
						);
					})}
				</div>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
