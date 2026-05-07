import { Button } from "@repo/ui/components/atoms/button/button";
import {
	Avatar,
	AvatarFallback,
} from "@repo/ui/components/molecules/avatar/avatar";
import { ArrowRight, BookOpen, MessageCircle, Video } from "lucide-react";

export function InteractiveCards() {
	return (
		<div className="flex flex-col items-center justify-center gap-3.5">
			<div className="flex w-full flex-col gap-4.5 rounded-2xl border border-border-on-navy bg-surface-navy p-6 dark:bg-surface-navy-2">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-inverse-muted uppercase tracking-[1.5px]">
					Comece em 2 minutos
				</span>

				<h3 className="font-instrument-serif text-3xl text-foreground-inverse -tracking-[0.6px]">
					Não achou sua resposta?
				</h3>

				<p className="font-inter text-foreground-inverse-muted text-sm leading-[155%]">
					Cadastre sua empresa em 2 minutos. Sem cartão, sem mensalidade. Você
					só paga quando recebe.
				</p>

				<Button className="flex items-center gap-2 bg-foreground-inverse text-surface-navy hover:bg-foreground-inverse/80 hover:text-surface-navy">
					Cadastrar minha empresa{" "}
					<ArrowRight className="h-3.5 w-3.5 text-surface-navy" />
				</Button>

				<article className="mt-4.5 flex flex-col gap-2.5 border-border-on-navy border-t pt-4.5">
					<p className="flex items-center justify-between font-inter text-foreground-inverse-muted text-sm">
						Empresas verificadas
						<span className="font-jetbrains-mono font-semibold text-foreground-inverse text-sm">
							12.400+
						</span>
					</p>

					<p className="flex items-center justify-between font-inter text-foreground-inverse-muted text-sm">
						Pago via PIX em 2025
						<span className="font-jetbrains-mono font-semibold text-foreground-inverse text-sm">
							R$ 320M
						</span>
					</p>

					<p className="flex items-center justify-between font-inter text-foreground-inverse-muted text-sm">
						Validação média
						<span className="font-jetbrains-mono font-semibold text-foreground-inverse text-sm">
							32 horas
						</span>
					</p>
				</article>
			</div>

			<div className="flex w-full flex-col gap-4.5 rounded-2xl border border-border bg-surface-paper-soft p-6">
				<h3 className="font-inter font-semibold text-foreground-primary text-sm">
					Fale com um de nossos especialista
				</h3>

				<button
					className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border bg-surface p-3 transition-colors duration-300 hover:bg-surface-tertiary/80"
					type="button"
				>
					<article className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A3D26]">
							<MessageCircle className="h-4 w-4 text-success" />
						</div>

						<article className="flex flex-col items-start">
							<h4 className="font-inter font-semibold text-foreground-primary text-sm">
								WhatsApp
							</h4>

							<span className="font-jetbrains-mono text-foreground-tertiary text-xs">
								Seg–sáb · 8h às 22h
							</span>
						</article>
					</article>

					<ArrowRight className="h-3.5 w-3.5 text-foreground-tertiary" />
				</button>

				<button
					className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border bg-surface p-3 transition-colors duration-300 hover:bg-surface-tertiary/80"
					type="button"
				>
					<article className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-accent-soft">
							<Video className="h-4 w-4 text-foreground-accent" />
						</div>

						<article className="flex flex-col items-start">
							<h4 className="font-inter font-semibold text-foreground-primary text-sm">
								Demo · 20 min
							</h4>

							<span className="font-jetbrains-mono text-foreground-tertiary text-xs">
								Agende com nosso time
							</span>
						</article>
					</article>

					<ArrowRight className="h-3.5 w-3.5 text-foreground-tertiary" />
				</button>

				<button
					className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border bg-surface p-3 transition-colors duration-300 hover:bg-surface-tertiary/80"
					type="button"
				>
					<article className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-tertiary">
							<BookOpen className="h-4 w-4 text-foreground-primary" />
						</div>

						<article className="flex flex-col items-start">
							<h4 className="font-inter font-semibold text-foreground-primary text-sm">
								Manual do parceiro
							</h4>

							<span className="font-jetbrains-mono text-foreground-tertiary text-xs">
								15 min · PDF + vídeos
							</span>
						</article>
					</article>

					<ArrowRight className="h-3.5 w-3.5 text-foreground-tertiary" />
				</button>
			</div>

			<div className="flex w-full flex-col gap-4.5 rounded-2xl border border-border bg-surface-paper-soft p-6">
				<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
					O que dizem
				</span>

				<p className="font-instrument-serif text-base text-foreground-primary italic">
					"Saí do caderno e da maquininha. Em 3 meses dobrei a equipe - e o
					painel me lembra quem cobrar."
				</p>

				<div className="flex items-center gap-2">
					<Avatar className="h-9 w-9">
						<AvatarFallback className="rounded-full bg-surface-navy font-jetbrains-mono font-semibold text-foreground-inverse text-xs uppercase">
							AS
						</AvatarFallback>
					</Avatar>

					<div className="grid flex-1 text-left">
						<span className="truncate font-inter font-semibold text-foreground-primary text-sm">
							Antônio Souza
						</span>
						<span className="truncate font-jetbrains-mono text-[11px] text-foreground-tertiary">
							Água & Cia · São Paulo, SP
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
