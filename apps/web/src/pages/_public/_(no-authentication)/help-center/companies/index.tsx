import { createFileRoute } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { InteractiveCards } from "./~components/-interactive-cards";
import { SearchByCategories } from "./~components/-search-by-categories";
import { SearchInput } from "./~components/-search-input";
import { AccountAccordion } from "./~components/accordions/-account-accordion";
import { LGPDAccordion } from "./~components/accordions/-lgpd-accordion";
import { OperationAccordion } from "./~components/accordions/-operation.accordion";
import { PaymentAccordion } from "./~components/accordions/-payment-accordion";

export const Route = createFileRoute(
	"/_public/_(no-authentication)/help-center/companies/"
)({
	component: CompaniesFrequentQuestionsPage,
	head: () => ({
		meta: [{ title: "Perguntas frequentes - Empresas | orchestra.web" }],
	}),
});

function CompaniesFrequentQuestionsPage() {
	const [category] = useQueryState(
		"category",
		parseAsString.withDefault("all")
	);
	const [search] = useQueryState("search", parseAsString.withDefault(""));

	const showAll = category === "all";

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

				<SearchInput />

				<SearchByCategories />
			</div>

			<div className="grid grid-cols-1 items-start space-y-8 lg:grid-cols-3 lg:gap-8">
				<div className="col-span-2 flex w-full flex-col gap-9">
					{(showAll || category === "account") && (
						<AccountAccordion search={search} />
					)}
					{(showAll || category === "payment") && (
						<PaymentAccordion search={search} />
					)}
					{(showAll || category === "operation") && (
						<OperationAccordion search={search} />
					)}
					{(showAll || category === "lgpd") && (
						<LGPDAccordion search={search} />
					)}
				</div>

				<InteractiveCards />
			</div>
		</main>
	);
}
