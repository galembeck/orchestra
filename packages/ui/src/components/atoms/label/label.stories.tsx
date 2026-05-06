import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";

const meta = {
	title: "Atoms/Label",
	component: Label,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Accessible form label via Radix UI. Automatically links to a control via `htmlFor`, and inherits disabled/error state from a wrapping `Field` group through peer and group selectors.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "Label text or content",
		},
		htmlFor: {
			control: "text",
			description: "ID of the associated form control",
		},
	},
	args: {
		children: "E-mail",
	},
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="ui:flex ui:flex-col ui:gap-1.5">
			<Label {...args} htmlFor="email-default" />
			<input
				className="ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-primary ui:text-sm ui:outline-none focus:ui:ring-2 focus:ui:ring-accent/30"
				id="email-default"
				placeholder="you@example.com"
				type="email"
			/>
		</div>
	),
};

export const WithDescription: Story = {
	render: (args) => (
		<div className="ui:flex ui:flex-col ui:gap-1.5">
			<Label {...args} htmlFor="email-desc">
				E-mail
			</Label>
			<input
				className="ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-primary ui:text-sm ui:outline-none focus:ui:ring-2 focus:ui:ring-accent/30"
				id="email-desc"
				placeholder="you@example.com"
				type="email"
			/>
			<p className="ui:font-inter ui:text-foreground-muted ui:text-xs">
				Used for login and notifications.
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Label paired with a helper text below the input.",
			},
		},
	},
};

export const Disabled: Story = {
	render: (args) => (
		<div
			className="ui:group/field ui:flex ui:flex-col ui:gap-1.5"
			data-disabled="true"
		>
			<Label {...args} htmlFor="email-disabled">
				E-mail
			</Label>
			<input
				className="ui:cursor-not-allowed ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-muted ui:text-sm ui:opacity-50 ui:outline-none"
				disabled
				id="email-disabled"
				placeholder="you@example.com"
				type="email"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'When the wrapping element has `data-disabled="true"`, the label fades to 50% opacity via the `group-data-[disabled=true]` selector.',
			},
		},
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="ui:flex ui:w-64 ui:flex-col ui:gap-6">
			<div className="ui:flex ui:flex-col ui:gap-1.5">
				<Label htmlFor="s-default">Default</Label>
				<input
					className="ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-primary ui:text-sm ui:outline-none"
					id="s-default"
					placeholder="Placeholder"
					type="text"
				/>
			</div>

			<div
				className="ui:group/field ui:flex ui:flex-col ui:gap-1.5"
				data-disabled="true"
			>
				<Label htmlFor="s-disabled">Disabled</Label>
				<input
					className="ui:cursor-not-allowed ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-muted ui:text-sm ui:opacity-50 ui:outline-none"
					disabled
					id="s-disabled"
					placeholder="Disabled"
					type="text"
				/>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "Default and disabled states side by side." },
		},
	},
};
