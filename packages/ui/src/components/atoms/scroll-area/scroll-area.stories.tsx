import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea, ScrollBar } from "./scroll-area";

const meta = {
	title: "Atoms/ScrollArea",
	component: ScrollArea,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A custom scrollable container built on Radix UI's ScrollArea primitive. Renders a styled scrollbar thumb via `ScrollBar` and supports both vertical and horizontal orientations.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Additional CSS classes applied to the root element",
		},
	},
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export const Vertical: Story = {
	render: () => (
		<ScrollArea className="h-64 w-56 rounded-md border border-border p-2">
			<div className="flex flex-col gap-1">
				{items.map((item) => (
					<div
						className="rounded px-2 py-1 text-foreground-primary text-sm hover:bg-surface-secondary"
						key={item}
					>
						{item}
					</div>
				))}
			</div>
		</ScrollArea>
	),
	parameters: {
		docs: {
			description: {
				story: "Vertical scroll area with a fixed height and a list of items.",
			},
		},
	},
};

export const Horizontal: Story = {
	render: () => (
		<ScrollArea className="w-72 rounded-md border border-border">
			<div className="flex gap-3 p-4">
				{Array.from({ length: 20 }, (_, i) => (
					<div
						className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-surface-secondary text-foreground-secondary text-xs"
						// biome-ignore lint/suspicious/noArrayIndexKey: not important for story files
						key={i}
					>
						Card {i + 1}
					</div>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Horizontal scroll area. Add `<ScrollBar orientation="horizontal" />` alongside the default vertical one.',
			},
		},
	},
};

export const TallContent: Story = {
	render: () => (
		<ScrollArea className="h-48 w-80 rounded-md border border-border p-4">
			<p className="text-foreground-secondary text-sm leading-relaxed">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus
				error sit voluptatem accusantium doloremque laudantium.
			</p>
		</ScrollArea>
	),
	parameters: {
		docs: {
			description: {
				story: "Fixed-height container with overflowing text content.",
			},
		},
	},
};
