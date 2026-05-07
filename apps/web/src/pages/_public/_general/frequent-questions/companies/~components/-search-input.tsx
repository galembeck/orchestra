import { Button } from "@repo/ui/components/atoms/button/button";
import { IconizedInput } from "@repo/ui/components/atoms/iconized-input/iconized-input";
import { Search, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

export function SearchInput() {
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [inputValue, setInputValue] = useState(search);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSearch(inputValue.trim() || null);
	};

	const handleClear = () => {
		setInputValue("");
		setSearch(null);
	};

	return (
		<form
			className="mt-4 flex w-full max-w-[560px] items-center justify-between gap-2 rounded-2xl border border-border bg-surface-paper-soft p-1.5 transition-all focus-within:ring-1 focus-within:ring-border-strong"
			onSubmit={handleSubmit}
		>
			<div className="flex-1">
				<IconizedInput
					className="w-full border-none bg-transparent shadow-none focus-visible:ring-0"
					icon={Search}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Pergunte sobre validação, PIX, taxas..."
					value={inputValue}
				/>
			</div>

			{inputValue && (
				<button
					className="shrink-0 rounded-full p-1 text-foreground-tertiary transition-colors hover:text-foreground-primary"
					onClick={handleClear}
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			)}

			<Button className="shrink-0 px-4 py-2.5" type="submit">
				Buscar
			</Button>
		</form>
	);
}
