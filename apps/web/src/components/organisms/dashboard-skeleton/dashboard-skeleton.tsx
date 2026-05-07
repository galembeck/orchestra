import { Skeleton } from "@repo/ui/components/atoms/skeleton/skeleton";

export function DashboardSkeleton() {
	return (
		<main className="flex min-h-screen w-full bg-surface text-foreground-primary">
			<aside className="hidden w-64 shrink-0 flex-col gap-6 border-border border-r bg-surface-paper-soft p-4 lg:flex">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-4 w-24" />
				</div>

				<Skeleton className="h-12 w-full rounded-md" />

				<div className="flex flex-col gap-2">
					<Skeleton className="h-3 w-16" />
					{Array.from({ length: 5 }, (_, i) => (
						<Skeleton
							className="h-8 w-full rounded-md"
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={`nav-primary-${i}`}
						/>
					))}
				</div>

				<div className="flex flex-col gap-2">
					<Skeleton className="h-3 w-16" />
					{Array.from({ length: 4 }, (_, i) => (
						<Skeleton
							className="h-8 w-full rounded-md"
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={`nav-business-${i}`}
						/>
					))}
				</div>

				<div className="mt-auto flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="flex flex-1 flex-col gap-1.5">
						<Skeleton className="h-3 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
			</aside>

			<section className="flex flex-1 flex-col">
				<header className="flex h-20 shrink-0 items-center justify-between gap-2 border-border border-b px-4">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-2.5 w-40" />
						<Skeleton className="h-6 w-56" />
					</div>

					<div className="flex items-center gap-2">
						<Skeleton className="hidden h-9 w-64 rounded-md lg:block" />
						<Skeleton className="h-9 w-9 rounded-md" />
						<Skeleton className="h-9 w-32 rounded-md" />
					</div>
				</header>

				<div className="flex flex-col gap-4.5 p-3.5 lg:p-8">
					<Skeleton className="h-4 w-72" />

					<Skeleton className="h-12 w-full rounded-[10px]" />

					<div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-surface-paper-soft p-6">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-3 w-24" />
						</div>

						<Skeleton className="h-48 w-full rounded-[10px]" />

						<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
							{Array.from({ length: 3 }, (_, i) => (
								<div
									className="flex flex-col gap-2 rounded-[10px] border border-border bg-surface p-3.5"
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
									key={`stat-${i}`}
								>
									<Skeleton className="h-2.5 w-16" />
									<Skeleton className="h-6 w-24" />
									<Skeleton className="h-2.5 w-20" />
								</div>
							))}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3">
						<div className="flex flex-col gap-3.5 rounded-[10px] border border-border bg-surface p-4 lg:col-span-2">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-20" />
							</div>

							<div className="flex h-40 items-end gap-2">
								{Array.from({ length: 12 }, (_, i) => (
									<Skeleton
										className="flex-1 rounded-sm"
										// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
										key={`bar-${i}`}
										style={{ height: `${30 + ((i * 17) % 70)}%` }}
									/>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-3 rounded-[10px] border border-border bg-surface p-4">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3 w-12" />
							</div>

							{Array.from({ length: 4 }, (_, i) => (
								<div
									className="flex items-center gap-2.5"
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
									key={`agenda-${i}`}
								>
									<Skeleton className="h-3 w-10" />
									<div className="flex flex-1 flex-col gap-1.5">
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-2.5 w-2/3" />
									</div>
									<Skeleton className="h-5 w-14 rounded-full" />
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-3 rounded-[10px] border border-border bg-surface p-4">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-7 w-48 rounded-md" />
						</div>

						{Array.from({ length: 5 }, (_, i) => (
							<div
								className="grid grid-cols-6 items-center gap-3 border-border border-b py-2 last:border-b-0"
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
								key={`row-${i}`}
							>
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-3 w-32" />
								<Skeleton className="h-3 w-28" />
								<Skeleton className="h-5 w-16 rounded-full" />
								<Skeleton className="h-3 w-16 justify-self-end" />
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
