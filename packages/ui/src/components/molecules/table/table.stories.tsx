import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";

const meta = {
	title: "Molecules/Table",
	component: Table,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Semantic, unstyled table primitives (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableFooter`, `TableCaption`) that follow the design system. Use them directly for static tables or compose them via the `DataTable` organism for sortable/filterable/paginated data.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
	{ id: "INV001", name: "Marina Lima", role: "Diretora", status: "Ativa" },
	{ id: "INV002", name: "André Castro", role: "Eletricista", status: "Ativo" },
	{ id: "INV003", name: "Júlia Rocha", role: "Analista", status: "Convidada" },
];

export const Default: Story = {
	render: () => (
		<div className="w-[640px]">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Cargo</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((r) => (
						<TableRow key={r.id}>
							<TableCell>{r.name}</TableCell>
							<TableCell>{r.role}</TableCell>
							<TableCell>{r.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	),
};

export const WithFooterAndCaption: Story = {
	render: () => (
		<div className="w-[640px]">
			<Table>
				<TableCaption>Resumo da equipe ativa</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Cargo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((r) => (
						<TableRow key={r.id}>
							<TableCell>{r.name}</TableCell>
							<TableCell>{r.role}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Total</TableCell>
						<TableCell>{rows.length}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`TableCaption` renders below the table; `TableFooter` renders a summary row above the caption.",
			},
		},
	},
};
