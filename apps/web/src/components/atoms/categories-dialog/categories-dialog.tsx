import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/molecules/dialog/dialog";
import type { ReactNode } from "react";

interface CategoriesDialogProps {
	children: ReactNode;
}

export function CategoriesDialog({ children }: CategoriesDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Categorias
						</span>

						<h1 className="mt-2 font-instrument-serif text-3xl text-foreground-primary tracking-[1.2px]">
							Tudo o que sua casa ou empresa precisa
						</h1>
					</DialogTitle>
				</DialogHeader>

				<article>
					<p>Categoria 1</p>
					<p>Categoria 2</p>
					<p>Categoria 3</p>
					<p>Categoria 4</p>
					<p>Categoria 5</p>
					<p>Categoria 6</p>
				</article>
			</DialogContent>
		</Dialog>
	);
}
