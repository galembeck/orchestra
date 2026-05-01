import { AudioWaveform } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

export interface LogoProps extends ComponentProps<"div"> {}

export function Logo({ className, ...props }: LogoProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2.5 text-foreground-primary",
				className
			)}
			{...props}
		>
			<AudioWaveform className="h-7 w-7" />

			<h1 className="font-instrument-serif font-medium text-2xl">Orchestra</h1>
		</div>
	);
}
