import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface RegistrationStatsCardProps extends ComponentProps<typeof Card> {
	description: string;
	icon: LucideIcon;
	title: string;
	value: number | string;
}

export function RegistrationStatsCard({
	description,
	icon: Icon,
	title,
	value,
	...props
}: RegistrationStatsCardProps) {
	return (
		<Card {...props}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>{title}</CardTitle>
					<Icon className="h-4 w-4 text-foreground-tertiary" />
				</div>
			</CardHeader>
			<CardContent>
				<p className="font-bold font-inter text-2xl text-foreground-primary">
					{value}
				</p>
				<p className="mt-1 font-inter text-foreground-secondary text-xs">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
