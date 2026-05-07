import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
	base: [
		"inline-flex cursor-pointer items-center justify-center rounded-lg font-inter font-medium text-sm transition-colors",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
	],
	variants: {
		variant: {
			primary:
				"bg-foreground-primary px-5.5 py-3.5 text-surface hover:bg-foreground-primary/90",
			secondary:
				"border border-border bg-surface-paper-soft px-5.5 py-3.5 text-foreground-primary hover:bg-surface-paper-soft/80",
			accent:
				"gap-2 bg-accent px-5.5 py-3 text-surface hover:bg-accent/90 [&_svg]:size-4",
		},
		size: {
			default: "",
			sm: "h-8 rounded-md px-3 py-1.5 text-xs",
			lg: "h-12 px-8 py-4 text-base",
			icon: "size-10 p-0",
		},
	},
	defaultVariants: { variant: "primary", size: "default" },
});

export interface ButtonProps
	extends ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {}

export function Button({
	className,
	variant = "primary",
	size = "default",
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={twMerge(buttonVariants({ variant, size }), className)}
			data-disabled={disabled ? "" : undefined}
			data-slot="button"
			disabled={disabled}
			type="button"
			{...props}
		>
			{children}
		</button>
	);
}
