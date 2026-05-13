import type { ReactNode } from "react";

interface ProfileRowProps {
	accent?: boolean;
	action: ReactNode;
	icon: ReactNode;
	iconBg: string;
	id: string;
	status: ReactNode;
	subtitle: string;
	title: string;
	value: string;
}

export function ProfileRow({
	accent,
	action,
	icon,
	iconBg,
	id,
	status,
	subtitle,
	title,
	value,
}: ProfileRowProps) {
	const borderColor = accent ? "border-surface-accent" : "border-border";

	return (
		<article
			className={`flex flex-col items-stretch gap-4 rounded-[14px] border bg-surface-paper-soft p-4.5 sm:flex-row sm:items-center ${borderColor}`}
		>
			<div
				className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
			>
				{icon}
			</div>

			<div className="flex flex-1 flex-col gap-1.5">
				<div className="flex flex-wrap items-center gap-2.5">
					<span className="font-jetbrains-mono font-semibold text-[11px] text-foreground-tertiary">
						{id}
					</span>
					{status}
				</div>
				<h4 className="font-inter font-semibold text-[15px] text-foreground-primary">
					{title}
				</h4>
				<p className="font-jetbrains-mono text-[12px] text-foreground-tertiary">
					{subtitle}
				</p>
			</div>

			<div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
				<span className="font-instrument-serif font-semibold text-foreground-primary text-lg">
					{value}
				</span>
				{action}
			</div>
		</article>
	);
}
