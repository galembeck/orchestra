import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, LogOut, Settings, Trash2, User } from "lucide-react";
import { Button } from "../../atoms/button/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
	title: "Molecules/DropdownMenu",
	component: DropdownMenu,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A composable dropdown menu built on Radix UI's DropdownMenu primitive. Uses `bg-surface-raised` for the panel and `bg-surface` for hover states — both adapt automatically in dark mode via CSS custom properties.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Open Menu</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem>
					<User />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings />
					Configurações
				</DropdownMenuItem>
				<DropdownMenuItem>
					<BookOpen />
					Documentação
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<LogOut />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Standard menu with items and a destructive action.",
			},
		},
	},
};

export const WithLabel: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Minha conta</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Conta</DropdownMenuLabel>
				<DropdownMenuItem>
					<User />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings />
					Configurações
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Zona de perigo</DropdownMenuLabel>
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Excluir conta
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Menu with section labels and a destructive variant.",
			},
		},
	},
};

export const WithShortcuts: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Ações</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem>
					<User />
					Perfil
					<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings />
					Configurações
					<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<LogOut />
					Sair
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Items with keyboard shortcut hints aligned to the right.",
			},
		},
	},
};

export const WithCheckboxItems: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Visualização</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Painel</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem checked>
					Barra de status
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Barra de atividade</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked>
					Painel lateral
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Checkbox items for toggling visibility of UI panels.",
			},
		},
	},
};

export const WithRadioItems: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Posição</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Posição do painel</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value="bottom">
					<DropdownMenuRadioItem value="top">Topo</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="bottom">Baixo</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="right">Direita</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: { story: "Radio items for mutually exclusive selection." },
		},
	},
};

export const WithSubMenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Mais opções</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem>
					<User />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Settings />
						Configurações
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>Conta</DropdownMenuItem>
						<DropdownMenuItem>Notificações</DropdownMenuItem>
						<DropdownMenuItem>Segurança</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<LogOut />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: { story: "Nested sub-menu triggered on hover." },
		},
	},
};
