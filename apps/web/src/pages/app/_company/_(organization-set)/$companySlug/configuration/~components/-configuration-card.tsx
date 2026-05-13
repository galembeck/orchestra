import {
	Card,
	CardContent,
	CardHeader,
} from "@repo/ui/components/molecules/card/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ConfigurationCardProps {
	children: ReactNode;
	description: string;
	icon: LucideIcon;
	title: string;
}

export function ConfigurationCard({
	icon: Icon,
	title,
	description,
	children,
}: ConfigurationCardProps) {
	return (
		<Card className="border border-border">
			<CardHeader className="border-border border-b">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-navy">
						<Icon className="h-5 w-5 text-foreground-inverse" />
					</div>

					<article className="flex flex-col">
						<h3 className="font-inter font-semibold text-foreground-primary text-sm">
							{title}
						</h3>

						<p className="font-inter text-foreground-secondary text-xs">
							{description}
						</p>
					</article>
				</div>
			</CardHeader>

			<CardContent>{children}</CardContent>
		</Card>
	);
}
