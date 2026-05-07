import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon } from "lucide-react";
import { Button } from "../../atoms/button/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const meta = {
	title: "Molecules/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A floating label that appears on hover/focus, built on Radix UI's Tooltip primitive. Wrap usages in `TooltipProvider` (done automatically in the stories). `sideOffset` and `side` control placement; an arrow is rendered automatically.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="secondary">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent>This is a tooltip</TooltipContent>
		</Tooltip>
	),
};

export const WithIcon: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger className="text-foreground-secondary">
				<InfoIcon className="size-4" />
				<span className="sr-only">More information</span>
			</TooltipTrigger>
			<TooltipContent>
				Technicians are automatically notified 1 hour before their shift.
			</TooltipContent>
		</Tooltip>
	),
	parameters: {
		docs: {
			description: {
				story: "Icon trigger with an `sr-only` accessible label.",
			},
		},
	},
};

export const AllSides: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-8 p-12">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Tooltip key={side}>
					<TooltipTrigger asChild>
						<Button className="w-24 capitalize" variant="secondary">
							{side}
						</Button>
					</TooltipTrigger>
					<TooltipContent side={side}>Tooltip on {side}</TooltipContent>
				</Tooltip>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All four placement sides for the tooltip content.",
			},
		},
	},
};
