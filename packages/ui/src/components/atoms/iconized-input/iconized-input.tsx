"use client";

import { Input } from "@repo/ui/components/atoms/input/input";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type IconizedInputProps = React.ComponentProps<typeof Input> & {
	icon: LucideIcon;
	children?: ReactNode;
};

export function IconizedInput({
	className,
	icon: Icon,
	children,
	...props
}: IconizedInputProps) {
	return (
		<div className="relative">
			<Icon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />

			<Input className={`pr-10 pl-12 ${className ?? ""}`} {...props} />

			{children}
		</div>
	);
}
