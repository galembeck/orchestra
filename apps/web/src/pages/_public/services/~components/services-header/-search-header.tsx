import { SearchFilters } from "./-search-filters";

export function SearchHeader() {
	return (
		<div className="w-full border border-border bg-surface">
			<div className="flex flex-col items-start justify-between gap-3 px-5 py-3.5 lg:flex-row lg:items-center lg:px-20">
				<article className="shrink-0">
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1px]">
						148 empresas · ordenado por proximidade
					</span>
				</article>

				<div className="w-full min-w-0 lg:max-w-max lg:flex-1">
					<SearchFilters />
				</div>
			</div>
		</div>
	);
}
