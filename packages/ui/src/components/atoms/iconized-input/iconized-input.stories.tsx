import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, MapPin, Search, User } from "lucide-react";
import { IconizedInput } from "./iconized-input";

const meta = {
	title: "Atoms/IconizedInput",
	component: IconizedInput,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"An `Input` wrapper that pins a Lucide icon to the left edge and optionally renders `children` inside the relative container (e.g., a right-side action button). The input already reserves `pr-10 pl-12` padding so icons never overlap the value.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		icon: {
			control: false,
			description:
				"Lucide icon component rendered on the left side of the input",
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
		children: {
			control: false,
			description:
				"Optional content rendered inside the wrapper — use absolute positioning to place it on the right side",
		},
	},
	args: {
		icon: Mail,
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
} satisfies Meta<typeof IconizedInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Email: Story = {
	args: {
		icon: Mail,
		placeholder: "pedro@orchestra.com.br",
		type: "email",
	},
};

export const WithSearchIcon: Story = {
	args: {
		icon: Search,
		placeholder: "Pesquisar...",
		type: "search",
	},
};

export const WithUserIcon: Story = {
	args: {
		icon: User,
		placeholder: "Nome completo",
	},
};

export const WithAddressIcon: Story = {
	args: {
		icon: MapPin,
		placeholder: "Rua, número, bairro",
	},
};

export const Disabled: Story = {
	args: {
		icon: Mail,
		placeholder: "Não editável",
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Disabled state — pointer events removed, `bg-surface-secondary` applied and opacity reduced to 50%.",
			},
		},
	},
};

export const Invalid: Story = {
	render: (args) => <IconizedInput {...args} aria-invalid="true" />,
	args: {
		icon: Mail,
		placeholder: "email-invalido@",
	},
	parameters: {
		docs: {
			description: {
				story:
					'`aria-invalid="true"` switches the border and focus ring to `danger` tokens — pair with `FieldError` to show a validation message.',
			},
		},
	},
};

export const WithRightAction: Story = {
	render: (args) => (
		<IconizedInput {...args}>
			<button
				className="ui:absolute ui:top-1/2 ui:right-3 ui:-translate-y-1/2 ui:cursor-pointer ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1px] ui:transition-colors ui:hover:text-foreground-primary"
				type="button"
			>
				Limpar
			</button>
		</IconizedInput>
	),
	args: {
		icon: Search,
		defaultValue: "Busca ativa",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Pass an absolutely positioned child to render a right-side action — useful for clear buttons or inline labels.",
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
				<IconizedInput icon={Mail} placeholder="pedro@orchestra.com.br" />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					With value
				</span>
				<IconizedInput defaultValue="Pedro Galembeck" icon={User} />
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					Invalid
				</span>
				<IconizedInput
					aria-invalid="true"
					icon={Mail}
					placeholder="email-invalido@"
				/>
			</div>

			<div className="ui:flex ui:flex-col ui:gap-1">
				<span className="ui:font-jetbrains-mono ui:font-medium ui:text-[10px] ui:text-foreground-tertiary ui:uppercase ui:tracking-[1.5px]">
					Disabled
				</span>
				<IconizedInput disabled icon={Mail} placeholder="Não editável" />
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
