import type { LucideIcon } from "lucide-react";

export interface ProfileTabItem {
	active?: boolean;
	badge?: string;
	icon: LucideIcon;
	label: string;
}

interface ProfileTabsProps {
	items: ProfileTabItem[];
}

export function ProfileTabs({ items }: ProfileTabsProps) {
	return (
		<nav className="flex flex-wrap border-border border-b">
			{items.map((item) => (
				<ProfileTab item={item} key={item.label} />
			))}
		</nav>
	);
}

function ProfileTab({ item }: { item: ProfileTabItem }) {
	const Icon = item.icon;
	const activeClasses = item.active
		? "border-foreground-primary text-foreground-primary font-semibold"
		: "border-transparent text-foreground-tertiary hover:text-foreground-secondary";

	return (
		<button
			className={`-mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 px-4.5 py-3.5 font-inter text-[13px] transition-colors ${activeClasses}`}
			type="button"
		>
			<Icon className="h-3.5 w-3.5" />
			{item.label}
			{item.badge ? (
				<span className="rounded-full bg-surface-tertiary px-2 py-0.5 font-jetbrains-mono font-semibold text-[10px] text-foreground-secondary">
					{item.badge}
				</span>
			) : null}
		</button>
	);
}
