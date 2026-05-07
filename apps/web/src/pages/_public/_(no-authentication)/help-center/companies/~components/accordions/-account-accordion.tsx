import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ui/components/molecules/accordion/accordion";
import { accountItems } from "@/constants/_public/help-center/companies/account-items";

interface AccountAccordionProps {
	search?: string;
}

export function AccountAccordion({ search }: AccountAccordionProps) {
	const term = search?.trim().toLowerCase() ?? "";
	const items = term
		? accountItems.filter(
				(item) =>
					item.question.toLowerCase().includes(term) ||
					item.answer.toLowerCase().includes(term)
			)
		: accountItems;

	if (items.length === 0) {
		return null;
	}

	return (
		<div className="w-full rounded-lg">
			<div className="px-4 py-3">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					Cadastro & Validação
				</span>
			</div>

			<Accordion className="w-full" collapsible defaultValue="01" type="single">
				{items.map((item) => (
					<AccordionItem className="px-4" key={item.value} value={item.value}>
						<AccordionTrigger>
							<span className="font-jetbrains-mono text-foreground-tertiary text-xs">
								{item.value}
							</span>

							{item.question}
						</AccordionTrigger>

						<AccordionContent className="pl-8">{item.answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
