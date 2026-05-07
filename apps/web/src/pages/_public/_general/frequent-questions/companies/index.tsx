import { createFileRoute } from "@tanstack/react-router";

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
			<div className="flex flex-col items-center justify-center gap-4 text-center">
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
			</div>
		</main>
	);
}
