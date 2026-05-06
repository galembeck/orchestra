import { Button } from "@repo/ui/components/atoms/button/button";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BusinessDashboardPreview } from "@/components/organisms/dashboard-placeholder/dashboard-placeholder";
import { businessFeatures } from "@/constants/_public/for-business";

export function ForBusinessSection() {
	const navigate = useNavigate();

	return (
		<section className="px-5 py-10 lg:px-20 lg:py-14" id="for-business">
			<div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
				<article className="flex flex-col gap-7 lg:flex-1">
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Para empresas de serviços
					</span>

					<h1 className="font-instrument-serif text-5xl text-foreground-primary leading-[1.05]">
						Seu caderno virou painel.
					</h1>

					<p className="font-inter text-base text-foreground-secondary leading-[1.55]">
						Pedidos, agenda, equipe, conversas e pagamentos PIX em um só painel.
						Receba do cliente sem taxa abusiva e organize sua operação como as
						grandes redes — sem sair do Brasil.
					</p>

					<ul className="flex flex-col gap-3.5">
						{businessFeatures.map((feature) => (
							<li
								className="flex items-center gap-3 font-inter text-[15px] text-foreground-primary"
								key={feature}
							>
								<Check className="size-[18px] shrink-0 text-foreground-primary" />
								{feature}
							</li>
						))}
					</ul>

					<div className="flex flex-wrap items-center gap-3 pt-3">
						<Button
							onClick={() => navigate({ to: "/sign-up" })}
							variant="primary"
						>
							Cadastrar minha empresa
						</Button>

						<Button variant="secondary">Falar com vendas</Button>
					</div>
				</article>

				<div className="w-full lg:flex-1">
					<BusinessDashboardPreview />
				</div>
			</div>
		</section>
	);
}
