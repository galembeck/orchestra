import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
	title: "Atoms/Input",
	component: Input,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Single-line text control styled with project design tokens. Supports all native `<input>` types, disabled state, and `aria-invalid` for error styling.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["text", "email", "password", "number", "search", "tel", "url"],
			description: "Native input type",
			table: { defaultValue: { summary: "text" } },
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when the field is empty",
		},
		disabled: {
			control: "boolean",
			description: "Disables the input and applies muted styling",
			table: { defaultValue: { summary: "false" } },
		},
	},
	args: {
		type: "text",
		placeholder: "Type something…",
		disabled: false,
	},
	decorators: [
		(Story) => (
			<div className="ui:w-72">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Email: Story = {
	args: { type: "email", placeholder: "you@example.com" },
};

export const Password: Story = {
	args: { type: "password", placeholder: "••••••••" },
};

export const Disabled: Story = {
	args: { disabled: true, placeholder: "Not editable" },
	parameters: {
		docs: {
			description: {
				story:
					"Disabled inputs become non-interactive with `bg-surface-secondary` and 50% opacity.",
			},
		},
	},
};

export const Invalid: Story = {
	render: (args) => <Input {...args} aria-invalid="true" />,
	args: { placeholder: "invalid@" },
	parameters: {
		docs: {
			description: {
				story:
					"`aria-invalid=\"true\"` switches the border and focus ring to `danger` tokens — pair this with `FieldError` to show a validation message.",
			},
		},
	},
};

export const WithValue: Story = {
	args: { defaultValue: "Pedro Galembeck", type: "text" },
	parameters: {
		docs: {
			description: { story: "Input with a pre-filled value." },
		},
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="ui:flex ui:w-72 ui:flex-col ui:gap-4">
			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:text-[10px] ui:font-medium ui:uppercase ui:tracking-[1.5px] ui:text-foreground-tertiary">
					Default
				</span>
				<Input placeholder="Type something…" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:text-[10px] ui:font-medium ui:uppercase ui:tracking-[1.5px] ui:text-foreground-tertiary">
					With value
				</span>
				<Input defaultValue="pedro@orchestra.com.br" type="email" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:text-[10px] ui:font-medium ui:uppercase ui:tracking-[1.5px] ui:text-foreground-tertiary">
					Invalid
				</span>
				<Input aria-invalid="true" placeholder="invalid@" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:text-[10px] ui:font-medium ui:uppercase ui:tracking-[1.5px] ui:text-foreground-tertiary">
					Disabled
				</span>
				<Input disabled placeholder="Not editable" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "All four states stacked for quick visual comparison." },
		},
	},
};
