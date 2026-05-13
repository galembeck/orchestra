import type { ReactNode } from "react";

interface MetaItemProps {
	children: ReactNode;
	icon: ReactNode;
}

export function MetaItem({ icon, children }: MetaItemProps) {
	return (
		<p className="flex items-center gap-2 font-jetbrains-mono text-[13px] text-foreground-secondary">
			<span className="text-foreground-tertiary">{icon}</span>
			{children}
		</p>
	);
}
