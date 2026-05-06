import { cn } from "../../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			className={cn(
				"h-10 w-full min-w-0 rounded-lg border border-border bg-surface px-3 font-inter text-foreground-primary text-sm outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground-primary file:text-sm placeholder:text-foreground-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
				className
			)}
			data-slot="input"
			type={type}
			{...props}
		/>
	);
}

export { Input };
