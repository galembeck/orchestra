import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

function Table({ className, ...props }: ComponentProps<"table">) {
	return (
		<div
			className="relative w-full overflow-x-auto"
			data-slot="table-container"
		>
			<table
				className={cn(
					"w-full caption-bottom border-collapse font-inter text-sm",
					className
				)}
				data-slot="table"
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
	return (
		<thead
			className={cn(
				"border-border border-b bg-surface-paper-soft/40 [&_tr]:border-b",
				className
			)}
			data-slot="table-header"
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
	return (
		<tbody
			className={cn("[&_tr:last-child]:border-0", className)}
			data-slot="table-body"
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
	return (
		<tfoot
			className={cn(
				"border-border border-t bg-surface-paper-soft/40 font-medium [&>tr]:last:border-b-0",
				className
			)}
			data-slot="table-footer"
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
	return (
		<tr
			className={cn(
				"border-border border-b transition-colors hover:bg-surface-paper-soft/40 data-[state=selected]:bg-surface-paper-soft",
				className
			)}
			data-slot="table-row"
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
	return (
		<th
			className={cn(
				"h-11 px-4 text-left align-middle font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px] [&:has([role=checkbox])]:pr-0",
				className
			)}
			data-slot="table-head"
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
	return (
		<td
			className={cn(
				"p-4 align-middle text-foreground-primary [&:has([role=checkbox])]:pr-0",
				className
			)}
			data-slot="table-cell"
			{...props}
		/>
	);
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
	return (
		<caption
			className={cn("mt-4 text-foreground-secondary text-sm", className)}
			data-slot="table-caption"
			{...props}
		/>
	);
}

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
};
