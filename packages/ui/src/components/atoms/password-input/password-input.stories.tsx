import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "./password-input";

const meta = {
	title: "Atoms/PasswordInput",
	component: PasswordInput,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A password field with a built-in show/hide toggle. The Lock icon anchors the left edge; the Eye/EyeOff button on the right lets users reveal or hide the entered value. Internally manages visibility state — no external state needed.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder text shown when the field is empty",
			table: { defaultValue: { summary: "••••••••••" } },
		},
		disabled: {
			control: "boolean",
			description:
				"Disables the input and the toggle button, applying muted styling",
			table: { defaultValue: { summary: "false" } },
		},
	},
	args: {
		placeholder: "••••••••••",
		disabled: false,
	},
	decorators: [
		(Story) => (
			<div className="ui:w-72">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
	args: { defaultValue: "minhasenha123" },
	parameters: {
		docs: {
			description: {
				story:
					"Input with a pre-filled value — click the Eye icon on the right to toggle visibility.",
			},
		},
	},
};

export const Disabled: Story = {
	args: { disabled: true },
	parameters: {
		docs: {
			description: {
				story:
					"Disabled state — pointer events removed and opacity reduced to 50%. The toggle button is also non-interactive.",
			},
		},
	},
};

export const Invalid: Story = {
	render: (args) => <PasswordInput {...args} aria-invalid="true" />,
	parameters: {
		docs: {
			description: {
				story:
					'`aria-invalid="true"` applies the `danger` border and focus ring — pair with `FieldError` to show a validation message below the field.',
			},
		},
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="ui:flex ui:w-72 ui:flex-col ui:gap-4">
			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					Default
				</span>
				<PasswordInput placeholder="••••••••••" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					With value
				</span>
				<PasswordInput defaultValue="minhasenha123" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					Invalid
				</span>
				<PasswordInput aria-invalid="true" placeholder="••••••••••" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					Disabled
				</span>
				<PasswordInput disabled placeholder="••••••••••" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All four states stacked for quick visual comparison.",
			},
		},
	},
};
