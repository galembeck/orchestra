import { Button } from "@repo/ui/components/atoms/button/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/components/molecules/command/command";
import { useNavigate } from "@tanstack/react-router";
import { CommandIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
	getAllNavigationItems,
	groupNavigationItems,
	type NavigationItem,
} from "@/constants/_app/panel/panel-navigation";

export function ContentSearch() {
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const navigationItems = getAllNavigationItems();

	const handleSelect = (item: NavigationItem) => {
		setOpen(false);
		navigate({ to: item.url });
	};

	const groupedItems = groupNavigationItems(navigationItems);

	return (
		<>
			<Button
				className="mr-4 w-full cursor-pointer border-border bg-surface-paper-soft px-3.5 py-2.5 text-foreground-tertiary transition-colors hover:bg-surface-paper-soft/80 hover:text-foreground-tertiary group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
				onClick={() => setOpen(true)}
			>
				<Search className="h-4 w-4 shrink-0" />

				<span className="ml-2 text-[13px] group-data-[collapsible=icon]:hidden">
					Buscar páginas, seções...
				</span>

				<kbd className="pointer-events-none ml-auto flex h-5 select-none items-center gap-1 rounded border-border bg-surface-raised px-1.5 font-medium font-mono text-[10px] text-foreground-inverse-muted opacity-100 group-data-[collapsible=icon]:hidden">
					<span className="text-xs">⌘</span> K
				</kbd>
			</Button>

			<CommandDialog onOpenChange={setOpen} open={open}>
				<CommandInput placeholder="Digite para pesquisar páginas..." />

				<CommandList>
					<CommandEmpty>Nenhuma página encontrada.</CommandEmpty>

					{Object.entries(groupedItems).map(([group, items]) => (
						<CommandGroup heading={group} key={group}>
							{items.map((item) => {
								const IconComponent = item.icon;
								return (
									<CommandItem
										className="flex cursor-pointer items-center gap-3"
										key={item.id}
										onSelect={() => handleSelect(item)}
										value={`${item.title} ${item.description} ${item.keywords.join(" ")}`}
									>
										{IconComponent ? (
											<IconComponent className="h-4 w-4 text-foreground-secondary" />
										) : (
											<CommandIcon className="h-4 w-4 text-foreground-secondary" />
										)}
										<div className="flex flex-1 flex-col gap-0.5">
											<span className="font-medium text-foreground-primary">
												{item.title}
											</span>
											<span className="text-[11px] text-foreground-secondary leading-snug">
												{item.description}
											</span>
										</div>
									</CommandItem>
								);
							})}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
}
