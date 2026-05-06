import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
	title: "Atoms/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Accessible checkbox via Radix UI. Unchecked shows a bordered square; checked fills with `foreground-primary` (dark navy) and a cream checkmark. Supports disabled and `aria-invalid` states.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		checked: {
			control: "boolean",
			description: "Controlled checked state",
		},
		disabled: {
			control: "boolean",
			description: "Disables interaction and reduces opacity",
			table: { defaultValue: { summary: "false" } },
		},
	},
	args: {
		disabled: false,
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
	args: { defaultChecked: true },
};

export const Disabled: Story = {
	args: { disabled: true },
	parameters: {
		docs: {
			description: { story: "Non-interactive with 50% opacity." },
		},
	},
};

export const DisabledChecked: Story = {
	args: { disabled: true, defaultChecked: true },
	parameters: {
		docs: {
			description: {
				story:
					"Checked and disabled — retains filled style at reduced opacity.",
			},
		},
	},
};

export const Invalid: Story = {
	render: (args) => <Checkbox {...args} aria-invalid="true" />,
	parameters: {
		docs: {
			description: {
				story:
					'`aria-invalid="true"` switches the border and focus ring to `danger` tokens.',
			},
		},
	},
};

export const WithLabel: Story = {
	render: (args) => (
		<div className="ui:flex ui:items-center ui:gap-2.5">
			<Checkbox {...args} id="terms" />
			<label
				className="ui:cursor-pointer ui:font-inter ui:font-medium ui:text-foreground-secondary ui:text-sm"
				htmlFor="terms"
			>
				Aceito os termos de uso
			</label>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Pair with a `<label>` linked via `htmlFor` for accessible click targets.",
			},
		},
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="ui:flex ui:flex-col ui:gap-4">
			{(
				[
					{ label: "Unchecked", checked: false, disabled: false },
					{ label: "Checked", checked: true, disabled: false },
					{ label: "Disabled", checked: false, disabled: true },
					{ label: "Disabled + checked", checked: true, disabled: true },
				] as const
			).map(({ label, checked, disabled }) => (
				<div className="ui:flex ui:items-center ui:gap-2.5" key={label}>
					<Checkbox defaultChecked={checked} disabled={disabled} id={label} />
					<label
						className="ui:cursor-pointer ui:font-inter ui:text-foreground-secondary ui:text-sm"
						htmlFor={label}
					>
						{label}
					</label>
				</div>
			))}
			<div className="ui:flex ui:items-center ui:gap-2.5">
				<Checkbox aria-invalid="true" id="invalid" />
				<label
					className="ui:cursor-pointer ui:font-inter ui:text-foreground-secondary ui:text-sm"
					htmlFor="invalid"
				>
					Invalid
				</label>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All five states with labels for quick visual comparison.",
			},
		},
	},
};
