import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "../../atoms/badge/badge";
import { Input } from "../../atoms/input/input";
import { DataTable } from "./data-table";

interface Member {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "invited" | "suspended";
	lastAccess: string;
}

const data: Member[] = [
	{
		id: "1",
		name: "Marina Lima",
		email: "marina@bordo.cafe",
		role: "Diretora",
		status: "active",
		lastAccess: "2026-05-07",
	},
	{
		id: "2",
		name: "André Castro",
		email: "andre@bordo.cafe",
		role: "Eletricista",
		status: "active",
		lastAccess: "2026-05-04",
	},
	{
		id: "3",
		name: "Júlia Rocha",
		email: "julia@bordo.cafe",
		role: "Analista",
		status: "invited",
		lastAccess: "—",
	},
	{
		id: "4",
		name: "Fernando Souza",
		email: "fernando@bordo.cafe",
		role: "Encarregado",
		status: "suspended",
		lastAccess: "2026-03-30",
	},
];

const columns: ColumnDef<Member>[] = [
	{
		accessorKey: "name",
		header: "Nome",
		cell: ({ row }) => (
			<span className="font-medium">{row.original.name}</span>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Cargo",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = row.original.status;
			if (s === "active") return <Badge variant="success">Ativo</Badge>;
			if (s === "invited") return <Badge variant="warning">Convidado</Badge>;
			return <Badge variant="danger">Suspenso</Badge>;
		},
	},
	{
		accessorKey: "lastAccess",
		header: "Última atividade",
	},
];

const meta = {
	title: "Organisms/DataTable",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Generic, sortable, filterable, paginated table built on TanStack Table v8. Pass `columns` (typed `ColumnDef<TData>[]`) and `data`. Supply a `toolbar` render-prop for filters and a `globalFilter`/`onGlobalFilterChange` pair for built-in fuzzy filtering. Pagination is on by default.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { columns: columns as ColumnDef<unknown>[], data: data as unknown[] },
	render: () => (
		<div className="w-[960px]">
			<DataTable columns={columns} data={data} />
		</div>
	),
};

export const WithGlobalFilter: Story = {
	args: { columns: columns as ColumnDef<unknown>[], data: data as unknown[] },
	render: () => {
		const Demo = () => {
			const [filter, setFilter] = useState("");
			return (
				<div className="w-[960px]">
					<DataTable
						columns={columns}
						data={data}
						globalFilter={filter}
						onGlobalFilterChange={setFilter}
						toolbar={() => (
							<Input
								className="max-w-sm"
								onChange={(e) => setFilter(e.target.value)}
								placeholder="Buscar por nome, email ou cargo..."
								value={filter}
							/>
						)}
					/>
				</div>
			);
		};
		return <Demo />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Pass a controlled `globalFilter` plus an `Input` rendered inside `toolbar` to wire up search-as-you-type.",
			},
		},
	},
};

export const Empty: Story = {
	args: { columns: columns as ColumnDef<unknown>[], data: [] as unknown[] },
	render: () => (
		<div className="w-[960px]">
			<DataTable
				columns={columns}
				data={[]}
				emptyMessage="Você ainda não tem colaboradores."
			/>
		</div>
	),
};
