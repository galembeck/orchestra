import { Card } from "@repo/ui/components/molecules/card/card";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ExplorationCardProps {
	description: string;
	icon: LucideIcon;
	onClick: () => void;
	title: string;
}

export function ExplorationCard({
	icon: Icon,
	title,
	description,
	onClick,
}: ExplorationCardProps) {
	return (
		<Card
			className="flex cursor-pointer flex-row items-center justify-between px-4 py-3.5"
			onClick={onClick}
		>
			<div className="flex items-center gap-3.5">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface">
					<Icon className="h-4 w-4" />
				</div>

				<article className="flex flex-col gap-1">
					<p className="font-inter font-semibold text-foreground-primary text-sm">
						{title}
					</p>

					<span className="font-jetbrains-mono text-foreground-tertiary text-xs">
						{description}
					</span>
				</article>
			</div>

			<ArrowRight />
		</Card>
	);
}
