import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

function Checkbox({
	className,
	...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"peer relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-border outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 data-[state=checked]:border-foreground-primary data-[state=checked]:bg-foreground-primary data-[state=checked]:text-foreground-inverse aria-invalid:data-[state=checked]:border-danger",
				className
			)}
			data-slot="checkbox"
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
				data-slot="checkbox-indicator"
			>
				<CheckIcon />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
