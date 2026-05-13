import type { ReactNode } from "react";

interface StatCardProps {
	caption: ReactNode;
	eyebrow: string;
	value: ReactNode;
}

export function StatCard({ eyebrow, value, caption }: StatCardProps) {
	return (
		<article className="flex flex-col gap-2 rounded-[14px] border border-border bg-surface-paper-soft p-4.5">
			<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
				{eyebrow}
			</span>
			<span className="font-instrument-serif text-3xl text-foreground-primary tracking-tight">
				{value}
			</span>
			<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary">
				{caption}
			</span>
		</article>
	);
}
