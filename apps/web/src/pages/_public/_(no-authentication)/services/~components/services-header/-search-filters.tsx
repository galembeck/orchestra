import {
	ScrollArea,
	ScrollBar,
} from "@repo/ui/components/atoms/scroll-area/scroll-area";
import { Banknote, Check, Clock, SlidersHorizontal, Star } from "lucide-react";

export function SearchFilters() {
	return (
		<ScrollArea className="w-full whitespace-nowrap pb-2">
			<div className="flex w-max items-center gap-1.5">
				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
					type="button"
				>
					<SlidersHorizontal className="h-3 w-3 text-foreground-secondary" />
					Filtros
				</button>

				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-full border bg-surface-navy px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-inverse transition-all duration-200 hover:bg-surface-navy-2"
					type="button"
				>
					<Check className="h-3 w-3 text-foreground-inverse" />
					Verificadas
				</button>

				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
					type="button"
				>
					4{" "}
					<Star className="h-3 w-3 fill-foreground-secondary text-foreground-secondary" />
					ou mais
				</button>

				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
					type="button"
				>
					<Clock className="h-3 w-3 text-foreground-secondary" />
					Disponível agora
				</button>

				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
					type="button"
				>
					<Banknote className="h-3 w-3 text-foreground-secondary" />
					Aceita PIX
				</button>
			</div>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
