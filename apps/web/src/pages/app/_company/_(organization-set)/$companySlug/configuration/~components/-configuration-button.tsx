import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface ConfigurationButtonProps {
	className?: string;
	description?: string;
	icon: LucideIcon;
	isSelected?: boolean;
	onClick: () => void;
	title: string;
	variant?: "default" | "compact";
}

export function ConfigurationButton({
	onClick,
	title,
	description,
	icon: Icon,
	isSelected = false,
	variant = "default",
	className,
}: ConfigurationButtonProps) {
	if (variant === "compact") {
		return (
			<button
				className={[
					"flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors",
					isSelected
						? "border-surface-navy bg-surface-navy"
						: "border-border bg-surface hover:border-foreground-primary/20",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				onClick={onClick}
				type="button"
			>
				<div
					className={[
						"flex h-9 w-9 items-center justify-center rounded-[8px]",
						isSelected ? "bg-white/10" : "bg-surface-raised",
					].join(" ")}
				>
					<Icon
						className={[
							"h-5 w-5",
							isSelected
								? "text-foreground-inverse"
								: "text-foreground-secondary",
						].join(" ")}
					/>
				</div>

				<span
					className={[
						"font-inter font-semibold text-sm",
						isSelected ? "text-foreground-inverse" : "text-foreground-primary",
					].join(" ")}
				>
					{title}
				</span>
			</button>
		);
	}

	return (
		<button
			className={[
				"flex w-full cursor-pointer items-center gap-4 rounded-[14px] border p-5 text-left transition-colors",
				isSelected
					? "border-surface-accent bg-surface-accent-soft"
					: "border-border bg-surface hover:border-surface-accent/40 hover:bg-surface-accent-soft/30",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			onClick={onClick}
			type="button"
		>
			<div
				className={[
					"flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px]",
					isSelected ? "bg-surface-accent" : "bg-surface-raised",
				].join(" ")}
			>
				<Icon
					className={[
						"h-5 w-5",
						isSelected
							? "text-foreground-inverse"
							: "text-foreground-secondary",
					].join(" ")}
				/>
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<span className="font-inter font-semibold text-foreground-primary text-sm">
					{title}
				</span>

				{description && (
					<span className="font-inter text-foreground-secondary text-xs leading-[1.4]">
						{description}
					</span>
				)}
			</div>

			{isSelected && (
				<div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-surface-accent">
					<Check className="h-3 w-3 text-foreground-inverse" />
				</div>
			)}
		</button>
	);
}
