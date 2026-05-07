import { Button } from "@repo/ui/components/atoms/button/button";
import { IconizedInput } from "@repo/ui/components/atoms/iconized-input/iconized-input";
import {
	ScrollArea,
	ScrollBar,
} from "@repo/ui/components/atoms/scroll-area/scroll-area";
import { createFileRoute } from "@tanstack/react-router";
import {
	Banknote,
	ClipboardCheck,
	LayoutList,
	Search,
	ShieldCheck,
	Truck,
} from "lucide-react";

export const Route = createFileRoute(
	"/_public/_general/frequent-questions/companies/"
)({
	component: CompaniesFrequentQuestionsPage,
	head: () => ({
		meta: [{ title: "Perguntas frequentes - Empresas | orchestra.web" }],
	}),
});

function CompaniesFrequentQuestionsPage() {
	return (
		<main className="flex flex-col gap-8 px-5 py-10 lg:px-20 lg:py-14">
			<div className="flex flex-col items-center justify-center gap-8 text-center">
				<h3 className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px] md:text-[11px]">
					Para empresas de serviços · Perguntas frequentes
				</h3>

				<h1 className="font-instrument-serif text-4xl text-foreground-primary -tracking-[1.5px] md:text-5xl lg:text-6xl">
					Tudo que você quer saber antes de cadastrar.
				</h1>

				<p className="max-w-3xl font-inter text-foreground-secondary text-xs md:text-sm lg:text-base">
					Cadastro, validação, pagamentos PIX, taxas, suporte, LGPD. Sem
					letrinhas pequenas - só o que importa para sua operação girar.
				</p>

				<div className="mt-4 flex w-full max-w-[560px] items-center justify-between gap-2 rounded-2xl border border-border bg-surface-paper-soft p-1.5 transition-all focus-within:ring-1 focus-within:ring-border-strong">
					<IconizedInput
						className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
						icon={Search}
						placeholder="Pergunte sobre validação, PIX, taxas..."
					/>

					<Button className="shrink-0 px-4 py-2.5">Buscar</Button>
				</div>

				<div className="w-full min-w-0 lg:max-w-max lg:flex-1">
					<ScrollArea className="w-full whitespace-nowrap">
						<div className="flex w-max items-center gap-1.5">
							<button
								className="flex cursor-pointer items-center gap-1.5 rounded-full border bg-surface-navy px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-inverse transition-all duration-200 hover:bg-surface-navy-2"
								type="button"
							>
								<LayoutList className="h-3 w-3 text-foreground-inverse" />
								Todas
							</button>

							<button
								className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
								type="button"
							>
								<ClipboardCheck className="h-3 w-3 text-foreground-secondary" />
								Cadastro & validação
							</button>

							<button
								className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
								type="button"
							>
								<Banknote className="h-3 w-3 text-foreground-secondary" />
								Pagamentos & PIX
							</button>

							<button
								className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
								type="button"
							>
								<Truck className="h-3 w-3 text-foreground-secondary" />
								Operações & equipe
							</button>

							<button
								className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-inter font-medium text-[12px] text-foreground-secondary transition-all duration-200 hover:bg-surface-raised"
								type="button"
							>
								<ShieldCheck className="h-3 w-3 text-foreground-secondary" />
								LGPD & segurança
							</button>
						</div>

						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</div>
		</main>
	);
}
