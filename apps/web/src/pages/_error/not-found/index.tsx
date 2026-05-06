import { Button } from "@repo/ui/components/atoms/button/button";
import { Navbar } from "@repo/ui/components/organisms/navbar/navbar";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, LayoutGrid, Phone, Search } from "lucide-react";
import { ExplorationCard } from "./~components/-exploration-card";
import { IncompletePartitureCard } from "./~components/-incomplete-partiture-card";

export const Route = createFileRoute("/_error/not-found/")({
	component: NotFoundPage,
	head: () => ({
		meta: [{ title: "Página não encontrada... | orchestra.web" }],
	}),
});

export function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<main className="flex min-h-screen w-full flex-col bg-surface text-foreground-primary">
			<Navbar />

			<div className="flex flex-col gap-12 px-5 py-10 lg:px-40 lg:py-10 xl:flex-row xl:items-center">
				<article className="flex flex-col gap-9">
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Erro 404 · Rota inexistente
					</span>

					<h1 className="font-instrument-serif text-[58px] text-foreground-primary leading-[102%] -tracking-[2px] md:text-[68px] lg:text-[78px]">
						Essa página saiu da partitura.
					</h1>

					<p className="font-inter text-[17px] text-foreground-secondary">
						O endereço que você procurou não existe - ou foi reagendado, como
						acontece com qualquer bom serviço. Vamos te colocar de volta no
						compasso certo.
					</p>

					<div className="flex items-center gap-3">
						<Button
							className="flex items-center gap-2"
							onClick={() => navigate({ to: "/" })}
						>
							<ArrowLeft className="h-3.5 w-3.5" />
							Voltar para o início
						</Button>

						<Button
							className="flex items-center gap-2"
							onClick={() => navigate({ to: "/" })}
							variant="secondary"
						>
							<Search className="h-3.5 w-3.5" /> Buscar um serviço
						</Button>
					</div>

					<div className="flex flex-col gap-2">
						<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Ou explore por aqui
						</span>

						<ExplorationCard
							description="32 categorias de encanamento a dedetização"
							icon={LayoutGrid}
							onClick={() => navigate({ to: "/" })}
							title="Categorias de serviço"
						/>

						<ExplorationCard
							description="Validação em até 48h · receba pelo PIX"
							icon={Building2}
							onClick={() => navigate({ to: "/" })}
							title="Cadastrar minha empresa"
						/>

						<ExplorationCard
							description="WhatsApp · seg-sáb · 8h às 22h"
							icon={Phone}
							onClick={() => navigate({ to: "/" })}
							title="Falar com nosso suporte"
						/>
					</div>
				</article>

				<IncompletePartitureCard />
			</div>
		</main>
	);
}
