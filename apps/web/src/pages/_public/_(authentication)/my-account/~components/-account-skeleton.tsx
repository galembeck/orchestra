import { Skeleton } from "@repo/ui/components/atoms/skeleton/skeleton";

export function AccountSkeleton() {
	return (
		<div className="flex flex-col gap-8" data-testid="account-skeleton">
			<HeaderCardSkeleton />
			<StatsRowSkeleton />
			<TabsSkeleton />
			<ListSkeleton />
		</div>
	);
}

function HeaderCardSkeleton() {
	return (
		<section className="flex w-full flex-col gap-6 rounded-[18px] border border-border bg-surface-paper-soft p-7 lg:flex-row lg:items-center">
			<div className="flex items-center gap-6">
				<Skeleton className="h-24 w-24 rounded-full" />

				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<Skeleton className="h-7 w-44" />
						<Skeleton className="h-4 w-24 rounded-full" />
					</div>

					<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
						<Skeleton className="h-3.5 w-48" />
						<Skeleton className="h-3.5 w-40" />
						<Skeleton className="h-3.5 w-32" />
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2.5 lg:ml-auto">
				<Skeleton className="h-9.5 w-32 rounded-[10px]" />
				<Skeleton className="h-9.5 w-9.5 rounded-[10px]" />
			</div>
		</section>
	);
}

function StatsRowSkeleton() {
	return (
		<section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
			{[0, 1, 2, 3].map((i) => (
				<article
					className="flex flex-col gap-3 rounded-[14px] border border-border bg-surface-paper-soft p-4.5"
					key={i}
				>
					<Skeleton className="h-2.5 w-32" />
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-2.5 w-28" />
				</article>
			))}
		</section>
	);
}

function TabsSkeleton() {
	const widths = ["w-24", "w-28", "w-28", "w-32", "w-24", "w-32"];

	return (
		<nav className="flex flex-wrap gap-2 border-border border-b pb-2">
			{widths.map((w, i) => (
				<Skeleton
					className={`h-7 ${w}`}
					// biome-ignore lint/suspicious/noArrayIndexKey: required based on account-type
					key={i}
				/>
			))}
		</nav>
	);
}

function ListSkeleton() {
	return (
		<section className="flex flex-col gap-4 pt-2">
			<header className="flex items-end justify-between">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-2.5 w-36" />
					<Skeleton className="h-5 w-72" />
				</div>
				<Skeleton className="h-3.5 w-20" />
			</header>

			<div className="flex flex-col gap-2.5">
				{[0, 1, 2].map((i) => (
					<article
						className="flex flex-col items-stretch gap-4 rounded-[14px] border border-border bg-surface-paper-soft p-4.5 sm:flex-row sm:items-center"
						key={i}
					>
						<Skeleton className="h-12 w-12 shrink-0 rounded-[10px]" />

						<div className="flex flex-1 flex-col gap-2">
							<div className="flex flex-wrap items-center gap-2.5">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-4 w-32 rounded-full" />
							</div>
							<Skeleton className="h-4 w-56" />
							<Skeleton className="h-3 w-72" />
						</div>

						<div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-8 w-28 rounded-lg" />
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
