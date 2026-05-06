import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "./field";

const meta = {
	title: "Molecules/Field",
	component: Field,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Composable form-field primitives: `Field`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSeparator`, `FieldGroup`, and `FieldSet`. Supports `vertical`, `horizontal`, and `responsive` orientations.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "radio",
			options: ["vertical", "horizontal", "responsive"],
			description: "Axis along which the label and control are arranged",
			table: {
				defaultValue: { summary: "vertical" },
			},
		},
	},
	args: {
		orientation: "vertical",
	},
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

const inputCls =
	"ui:w-full ui:rounded-[8px] ui:border ui:border-border ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-sm ui:text-foreground-primary ui:outline-none focus:ui:ring-2 focus:ui:ring-accent/30";

export const Vertical: Story = {
	render: (args) => (
		<Field className="ui:w-72" {...args}>
			<FieldLabel htmlFor="v-email">E-mail</FieldLabel>
			<input
				className={inputCls}
				id="v-email"
				placeholder="you@example.com"
				type="email"
			/>
		</Field>
	),
};

export const WithDescription: Story = {
	render: (args) => (
		<Field className="ui:w-72" {...args}>
			<FieldLabel htmlFor="wd-email">E-mail</FieldLabel>
			<input
				className={inputCls}
				id="wd-email"
				placeholder="you@example.com"
				type="email"
			/>
			<FieldDescription>
				Used for login and service notifications.
			</FieldDescription>
		</Field>
	),
	parameters: {
		docs: {
			description: {
				story: "`FieldDescription` renders below the control in muted text.",
			},
		},
	},
};

export const WithError: Story = {
	render: (args) => (
		<Field className="ui:w-72" data-invalid="true" {...args}>
			<FieldLabel htmlFor="we-email">E-mail</FieldLabel>
			<input
				className="ui:w-full ui:rounded-[8px] ui:border ui:border-danger ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-primary ui:text-sm ui:outline-none"
				id="we-email"
				placeholder="you@example.com"
				type="email"
			/>
			<FieldError>Please enter a valid e-mail address.</FieldError>
		</Field>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`data-invalid="true"` on `Field` cascades the danger color. `FieldError` renders the message in `text-danger`.',
			},
		},
	},
};

export const WithErrorList: Story = {
	render: (args) => (
		<Field className="ui:w-72" data-invalid="true" {...args}>
			<FieldLabel htmlFor="wel-password">Senha</FieldLabel>
			<input
				className="ui:w-full ui:rounded-[8px] ui:border ui:border-danger ui:bg-surface ui:px-3 ui:py-2 ui:font-inter ui:text-foreground-primary ui:text-sm ui:outline-none"
				id="wel-password"
				placeholder="••••••••"
				type="password"
			/>
			<FieldError
				errors={[
					{ message: "Minimum 8 characters required." },
					{ message: "Must include at least one number." },
					{ message: "Must include at least one symbol." },
				]}
			/>
		</Field>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Pass an `errors` array to `FieldError` to render a deduplicated bullet list.",
			},
		},
	},
};

export const Horizontal: Story = {
	args: { orientation: "horizontal" },
	render: (args) => (
		<Field className="ui:w-80" {...args}>
			<FieldLabel htmlFor="h-notify">Notificações por e-mail</FieldLabel>
			<input id="h-notify" type="checkbox" />
		</Field>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`orientation="horizontal"` places the label and control side by side — useful for checkboxes and toggles.',
			},
		},
	},
};

export const WithTitleAndDescription: Story = {
	render: (args) => (
		<Field className="ui:w-72" {...args}>
			<FieldTitle>Cidade</FieldTitle>
			<input className={inputCls} placeholder="São Paulo" type="text" />
			<FieldDescription>
				Used to match you with local service providers.{" "}
				<a href="#learn-more">Learn more</a>
			</FieldDescription>
		</Field>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`FieldTitle` is a plain `div` (no `for` binding) — use it when the label association is handled elsewhere. Links inside `FieldDescription` are automatically underlined.",
			},
		},
	},
};

export const WithSeparator: Story = {
	render: () => (
		<FieldGroup className="ui:w-72">
			<Field>
				<FieldLabel htmlFor="sep-name">Nome completo</FieldLabel>
				<input
					className={inputCls}
					id="sep-name"
					placeholder="Pedro Silva"
					type="text"
				/>
			</Field>
			<FieldSeparator>ou</FieldSeparator>
			<Field>
				<FieldLabel htmlFor="sep-handle">Apelido</FieldLabel>
				<input
					className={inputCls}
					id="sep-handle"
					placeholder="pedro_s"
					type="text"
				/>
			</Field>
		</FieldGroup>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`FieldSeparator` draws a full-width rule. Pass a child string to show a centred label over the line.",
			},
		},
	},
};

export const FieldSetExample: Story = {
	render: () => (
		<FieldSet className="ui:w-72">
			<legend className="ui:mb-1 ui:font-inter ui:font-medium ui:text-foreground-primary ui:text-sm">
				Endereço
			</legend>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="fs-street">Rua</FieldLabel>
					<input
						className={inputCls}
						id="fs-street"
						placeholder="Av. Paulista, 1000"
						type="text"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="fs-city">Cidade</FieldLabel>
					<input
						className={inputCls}
						id="fs-city"
						placeholder="São Paulo"
						type="text"
					/>
					<FieldDescription>Used to match nearby providers.</FieldDescription>
				</Field>
			</FieldGroup>
		</FieldSet>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`FieldSet` + `FieldGroup` compose multiple fields inside a semantic `<fieldset>`, ideal for address or payment blocks.",
			},
		},
	},
};
