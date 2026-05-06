import { createFileRoute } from "@tanstack/react-router";
import { CallToActionSection } from "./~components/~sections/-call-to-action-section";
import { CategoriesSection } from "./~components/~sections/-categories-section";
import { CompanyNumbersSection } from "./~components/~sections/-company-numbers-section";
import { ForBusinessSection } from "./~components/~sections/-for-business-section";
import { HowItWorksSection } from "./~components/~sections/-how-it-works-section";
import { IntroSection } from "./~components/~sections/-intro-section";

export const Route = createFileRoute("/_public/")({
	component: LandingPage,
	head: () => ({
		meta: [
			{
				title:
					"Orchestra | Encontre o serviço certo, com a empresa certa, na hora certa",
			},
		],
	}),
});

function LandingPage() {
	return (
		<main>
			<IntroSection />

			<CategoriesSection />

			<HowItWorksSection />

			<ForBusinessSection />

			<CompanyNumbersSection />

			<CallToActionSection />
		</main>
	);
}
