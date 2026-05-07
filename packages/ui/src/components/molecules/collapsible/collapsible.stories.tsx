import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../atoms/button/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";

const meta = {
	title: "Molecules/Collapsible",
	component: Collapsible,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A simple show/hide container built on Radix UI's Collapsible primitive. Unlike Accordion it has no sibling coordination — use it for standalone expand/collapse interactions like filter panels or secondary navigation groups.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Collapsible className="w-72">
			<div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
				<span className="font-medium text-foreground-primary text-sm">
					Advanced filters
				</span>
				<CollapsibleTrigger asChild>
					<Button className="size-7" size="icon" variant="secondary">
						<ChevronDownIcon className="size-4" />
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="mt-1 rounded-md border border-border px-3 py-2">
				<div className="flex flex-col gap-2 text-foreground-secondary text-sm">
					<span>Status: Active</span>
					<span>Region: South</span>
					<span>Assigned: Yes</span>
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<div className="flex w-72 flex-col gap-2">
				<Collapsible onOpenChange={setOpen} open={open}>
					<CollapsibleTrigger asChild>
						<Button className="w-full justify-between" variant="secondary">
							{open ? "Hide details" : "Show details"}
							<ChevronDownIcon
								className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
							/>
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-1 rounded-md border border-border p-3 text-foreground-secondary text-sm">
						Controlled by external state. The button label and icon rotation
						reflect the current open value.
					</CollapsibleContent>
				</Collapsible>
				<p className="text-center text-foreground-tertiary text-xs">
					State: {open ? "open" : "closed"}
				</p>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Controlled via `open` and `onOpenChange` props — the parent drives the state.",
			},
		},
	},
};
