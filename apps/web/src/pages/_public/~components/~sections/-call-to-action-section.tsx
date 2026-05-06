import { Button } from "@repo/ui/components/atoms/button/button";
import { useNavigate } from "@tanstack/react-router";

export function CallToActionSection() {
	const navigate = useNavigate();

	return (
		<section
			className="bg-surface-navy dark:bg-surface-navy-2"
			id="call-to-action"
		>
			<div className="flex flex-col items-center justify-center gap-8 px-5 py-10 lg:px-20 lg:py-14">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-inverse-muted uppercase tracking-[1.5px]">
					Comece agora · Grátis
				</span>

				<h1 className="text-center font-instrument-serif text-4xl text-foreground-inverse md:text-5xl lg:text-6xl">
					Componha o serviço certo, hoje.
				</h1>

				<p className="font-inter text-base text-foreground-inverse-muted">
					Cadastre-se em 3 minutos. Sem cartão de crédito. Sem letrinhas
					pequenas.
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<Button variant="primary">Buscar um serviço</Button>

					<Button
						onClick={() => navigate({ to: "/sign-up" })}
						variant="secondary"
					>
						Cadastrar minha empresa
					</Button>
				</div>
			</div>
		</section>
	);
}
