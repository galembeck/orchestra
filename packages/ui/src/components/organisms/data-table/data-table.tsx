import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	type Table as TableInstance,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
	type ReactNode,
	useState,
} from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../atoms/button/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../molecules/table/table";

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	className?: string;
	emptyMessage?: ReactNode;
	pageSize?: number;
	enablePagination?: boolean;
	enableSorting?: boolean;
	enableColumnFilters?: boolean;
	globalFilter?: string;
	onGlobalFilterChange?: (value: string) => void;
	toolbar?: (table: TableInstance<TData>) => ReactNode;
	footer?: (table: TableInstance<TData>) => ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	className,
	emptyMessage = "Nenhum resultado encontrado.",
	pageSize = 10,
	enablePagination = true,
	enableSorting = true,
	enableColumnFilters = true,
	globalFilter,
	onGlobalFilterChange,
	toolbar,
	footer,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			...(globalFilter !== undefined ? { globalFilter } : {}),
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		getFilteredRowModel: enableColumnFilters ? getFilteredRowModel() : undefined,
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		initialState: {
			pagination: { pageSize },
		},
	});

	return (
		<div className={cn("flex w-full flex-col gap-3", className)}>
			{toolbar?.(table)}

			<div className="overflow-hidden rounded-lg border border-border bg-surface-paper">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								className="hover:bg-transparent"
								key={headerGroup.id}
							>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sorted = header.column.getIsSorted();

									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : canSort ? (
												<button
													className="inline-flex cursor-pointer items-center gap-1.5 hover:text-foreground-primary"
													onClick={header.column.getToggleSortingHandler()}
													type="button"
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{sorted === "asc" ? (
														<ArrowUp className="h-3 w-3" />
													) : sorted === "desc" ? (
														<ArrowDown className="h-3 w-3" />
													) : (
														<ArrowUpDown className="h-3 w-3 opacity-50" />
													)}
												</button>
											) : (
												flexRender(
													header.column.columnDef.header,
													header.getContext()
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									data-state={row.getIsSelected() ? "selected" : undefined}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className="hover:bg-transparent">
								<TableCell
									className="h-24 text-center text-foreground-secondary text-sm"
									colSpan={columns.length}
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{footer
				? footer(table)
				: enablePagination && <DataTablePagination table={table} />}
		</div>
	);
}

interface DataTablePaginationProps<TData> {
	table: TableInstance<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const total = table.getFilteredRowModel().rows.length;
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const from = total === 0 ? 0 : pageIndex * pageSize + 1;
	const to = Math.min(total, (pageIndex + 1) * pageSize);

	return (
		<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
			<p className="font-jetbrains-mono text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
				{total === 0
					? "Nenhum resultado"
					: `Exibindo ${from}–${to} de ${total}`}
			</p>

			<div className="flex items-center gap-2">
				<Button
					className="h-8 w-8 p-0"
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
					variant="secondary"
				>
					<ChevronLeft className="h-3.5 w-3.5" />
				</Button>

				<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					{pageIndex + 1} / {Math.max(1, table.getPageCount())}
				</span>

				<Button
					className="h-8 w-8 p-0"
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
					variant="secondary"
				>
					<ChevronRight className="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	);
}
