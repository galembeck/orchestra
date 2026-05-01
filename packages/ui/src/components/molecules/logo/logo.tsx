import { Link } from "@tanstack/react-router";
import { AudioWaveform } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

export interface LogoProps extends ComponentProps<"a"> {}

export function Logo({ className }: LogoProps) {
	return (
		<Link
			className={cn(
				"flex items-center gap-2.5 text-foreground-primary",
				className
			)}
			// {...props}
			to="/"
		>
			<AudioWaveform className="h-7 w-7" />

			<h1 className="font-instrument-serif font-medium text-2xl">Orchestra</h1>
		</Link>
	);
}
