import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "../button/button";
import { Toaster } from "./sooner";

const meta: Meta<typeof Toaster> = {
	title: "Atoms/Sooner",
	component: Toaster,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Toast notification container built on [Sonner](https://sonner.emilkowal.ski/). Mount `<Toaster />` once at the app root, then call `toast.*()` from anywhere to show notifications. Automatically follows the active theme and uses custom Orchestra icons for each type.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		position: {
			control: "select",
			options: [
				"top-left",
				"top-center",
				"top-right",
				"bottom-left",
				"bottom-center",
				"bottom-right",
			],
			description: "Where the toast stack anchors on screen",
			table: { defaultValue: { summary: "bottom-right" } },
		},
		richColors: {
			control: "boolean",
			description:
				"Apply color-coded backgrounds to success / error / warning toasts",
			table: { defaultValue: { summary: "false" } },
		},
		closeButton: {
			control: "boolean",
			description: "Show an explicit close button on each toast",
			table: { defaultValue: { summary: "false" } },
		},
		expand: {
			control: "boolean",
			description: "Always expand the toast stack instead of stacking them",
			table: { defaultValue: { summary: "false" } },
		},
	},
	args: {
		position: "bottom-right",
		richColors: false,
		closeButton: false,
	},
	decorators: [
		(Story) => (
			<div className="ui:flex ui:h-64 ui:w-96 ui:items-center ui:justify-center">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button onClick={() => toast("Notificação enviada.")}>
				Mostrar toast
			</Button>
		</>
	),
};

export const Success: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button onClick={() => toast.success("Cadastro salvo com sucesso.")}>
				Toast de sucesso
			</Button>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use `toast.success()` for positive confirmations — renders with the `CircleCheck` icon.",
			},
		},
	},
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: not a problem in this context
export const Error: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button
				onClick={() => toast.error("Erro ao salvar as alterações.")}
				variant="secondary"
			>
				Toast de erro
			</Button>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use `toast.error()` for failure feedback — renders with the `OctagonX` icon.",
			},
		},
	},
};

export const Warning: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button
				onClick={() => toast.warning("Sessão expirará em 5 minutos.")}
				variant="secondary"
			>
				Toast de aviso
			</Button>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use `toast.warning()` for non-critical alerts — renders with the `TriangleAlert` icon.",
			},
		},
	},
};

export const Info: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button
				onClick={() => toast.info("Documentos atualizados.")}
				variant="secondary"
			>
				Toast de informação
			</Button>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use `toast.info()` for informational messages — renders with the `Info` icon.",
			},
		},
	},
};

export const Loading: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<Button
				onClick={() => {
					const id = toast.loading("Processando...");
					setTimeout(() => toast.success("Concluído!", { id }), 2500);
				}}
				variant="secondary"
			>
				Toast de carregamento
			</Button>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use `toast.loading()` with an `id`, then resolve it via `toast.success(msg, { id })` to transition the same toast — avoids stacking.",
			},
		},
	},
};

export const AllTypes: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<div className="ui:flex ui:flex-wrap ui:gap-2">
				<Button onClick={() => toast("Padrão")}>Padrão</Button>
				<Button onClick={() => toast.success("Sucesso")}>Sucesso</Button>
				<Button onClick={() => toast.error("Erro")}>Erro</Button>
				<Button onClick={() => toast.warning("Aviso")}>Aviso</Button>
				<Button onClick={() => toast.info("Info")}>Info</Button>
			</div>
		</>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Fire all five toast types at once to see them stacked in the corner.",
			},
		},
	},
};
