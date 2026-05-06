import { ArrowRight } from "lucide-react";
import { CategoriesDialog } from "@/components/atoms/categories-dialog/categories-dialog";
import { CategoryCard } from "@/components/molecules/category-card/category-card";
import { categories } from "@/constants/_public/categories";

export function CategoriesSection() {
	return (
		<section
			className="flex flex-col gap-12 px-5 py-10 lg:px-20 lg:py-14"
			id="categories"
		>
			<article className="flex flex-col gap-2.5">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Categorias
				</span>

				<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
					<h1 className="font-instrument-serif text-5xl text-foreground-primary">
						Tudo o que sua casa ou empresa precisa.
					</h1>

					<CategoriesDialog>
						<button
							className="flex cursor-pointer items-center justify-end gap-1 font-inter font-medium text-foreground-primary text-sm hover:text-foreground-primary/80 hover:underline hover:underline-offset-4"
							type="button"
						>
							Ver todas as 32 categorias
							<ArrowRight className="h-3.5 w-3.5 text-foreground-primary" />
						</button>
					</CategoriesDialog>
				</div>
			</article>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{categories.map((category) => (
					<CategoryCard
						category={category.category}
						icon={category.icon}
						key={category.id}
						professionalsCount={category.professionalsCount}
					/>
				))}
			</div>
		</section>
	);
}
