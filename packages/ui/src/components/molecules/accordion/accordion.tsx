import { Minus, Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "../../../lib/utils";

function Accordion({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return (
		<AccordionPrimitive.Root
			className={cn("flex w-full flex-col gap-[18px]", className)}
			data-slot="accordion"
			{...props}
		/>
	);
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			className={cn(
				"rounded-[14px] border border-border-subtle bg-surface-paper-soft data-[state=open]:border-[1.5px] data-[state=open]:border-border-strong",
				className
			)}
			data-slot="accordion-item"
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				className={cn(
					"group/accordion-trigger flex flex-1 cursor-pointer items-center justify-between gap-3.5 px-6 py-5 text-left font-instrument-serif text-lg outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
					className
				)}
				data-slot="accordion-trigger"
				{...props}
			>
				<span className="flex items-center gap-3.5">{children}</span>
				<Plus
					className="pointer-events-none size-[18px] shrink-0 group-aria-expanded/accordion-trigger:hidden"
					data-slot="accordion-trigger-icon"
				/>
				<Minus
					className="pointer-events-none hidden size-[18px] shrink-0 group-aria-expanded/accordion-trigger:inline"
					data-slot="accordion-trigger-icon"
				/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down"
			data-slot="accordion-content"
			{...props}
		>
			<div
				className={cn(
					"px-6 pb-5 font-inter text-foreground-secondary text-sm leading-[1.6] [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
					className
				)}
			>
				{children}
			</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
