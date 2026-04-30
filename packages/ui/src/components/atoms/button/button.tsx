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
				"border border-border bg-surface-raised px-5.5 py-3.5 text-foreground-primary hover:bg-surface",
			accent:
				"gap-2 bg-accent px-5.5 py-3 text-surface hover:bg-accent/90 [&_svg]:size-4",
		},
	},
	defaultVariants: { variant: "primary" },
});

export interface ButtonProps
	extends ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {}

export function Button({
	className,
	variant = "primary",
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={twMerge(buttonVariants({ variant }), className)}
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
