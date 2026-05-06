import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
	title: "Atoms/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Visually divides content horizontally or vertically. Renders a semantic `<hr>` (or `<div>` when decorative) via Radix UI. Sized automatically based on orientation.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "radio",
			options: ["horizontal", "vertical"],
			description: "Direction of the separator line",
			table: {
				defaultValue: { summary: "horizontal" },
			},
		},
		decorative: {
			control: "boolean",
			description:
				"When true, the separator is purely visual and hidden from assistive technology",
			table: {
				defaultValue: { summary: "true" },
			},
		},
	},
	args: {
		orientation: "horizontal",
		decorative: true,
	},
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	render: (args) => (
		<div className="w-64">
			<p className="ui:text-foreground-secondary ui:text-sm">Above</p>
			<Separator {...args} className="ui:my-3" />
			<p className="ui:text-foreground-secondary ui:text-sm">Below</p>
		</div>
	),
};

export const Vertical: Story = {
	args: { orientation: "vertical" },
	render: (args) => (
		<div className="ui:flex ui:h-8 ui:items-center ui:gap-3">
			<span className="ui:text-foreground-secondary ui:text-sm">Left</span>
			<Separator {...args} />
			<span className="ui:text-foreground-secondary ui:text-sm">Right</span>
		</div>
	),
};

export const WithLabel: Story = {
	render: (args) => (
		<div className="ui:w-64">
			<div className="ui:flex ui:items-center ui:gap-3">
				<Separator {...args} />
				<span className="ui:shrink-0 ui:font-medium ui:text-foreground-tertiary ui:text-xs">
					ou
				</span>
				<Separator {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "Common pattern for 'or' dividers in auth forms." },
		},
	},
};

export const AllOrientations: Story = {
	render: () => (
		<div className="ui:flex ui:flex-col ui:gap-8">
			<div className="ui:w-64">
				<p className="ui:mb-2 ui:font-medium ui:text-foreground-tertiary ui:text-xs">
					Horizontal
				</p>
				<Separator orientation="horizontal" />
			</div>
			<div className="ui:flex ui:h-10 ui:items-center ui:gap-4">
				<p className="ui:font-medium ui:text-foreground-tertiary ui:text-xs">
					Vertical
				</p>
				<Separator orientation="vertical" />
				<p className="ui:text-foreground-secondary ui:text-xs">Content</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "Both orientations at a glance." },
		},
	},
};
