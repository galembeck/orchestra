import { formatTime } from "@repo/core/utils/format-time";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Card } from "@repo/ui/components/molecules/card/card";
import {
	BookOpen,
	CheckCircle2,
	Circle,
	Loader2,
	MessageCircle,
	Smartphone,
	Sparkles,
} from "lucide-react";
import { useMemo } from "react";

interface AnalysisStepProps {
	companyName?: string;
}

export function AnalysisStep({ companyName }: AnalysisStepProps) {
	const receivedAt = useMemo(() => new Date(), []);

	return (
		<Card className="p-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground-primary">
						<Sparkles className="h-7 w-7 text-surface" />
					</div>

					<div className="flex flex-col gap-1">
						<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Cadastro recebido · ORC-{receivedAt.toISOString().split("T")[0]}
						</span>

						<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
							Sua orquestra está afinando.
						</h2>
					</div>

					<p className="max-w-[420px] font-inter text-[15px] text-foreground-secondary">
						Recebemos os dados
						{companyName ? ` da ${companyName}` : ""}. Em até 48h úteis nossa
						equipe valida tudo e libera seu painel — você recebe um e-mail assim
						que estiver pronto.
					</p>
				</div>

				<div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Progresso da análise
					</span>

					<div className="flex flex-col gap-4">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />

							<div className="flex flex-1 flex-col gap-0.5">
								<p className="font-inter font-medium text-[13px] text-foreground-primary">
									Cadastro recebido
								</p>

								<p className="font-inter text-[12px] text-foreground-tertiary">
									Hoje · {formatTime(receivedAt)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<Loader2 className="mt-0.5 h-4.5 w-4.5 shrink-0 animate-spin text-accent" />

							<div className="flex flex-1 flex-col gap-0.5">
								<div className="flex items-center gap-2">
									<p className="font-inter font-medium text-[13px] text-foreground-primary">
										Verificação de documentos
									</p>

									<span className="rounded-full bg-accent/10 px-2 py-0.5 font-jetbrains-mono font-medium text-[10px] text-accent uppercase tracking-[1px]">
										agora
									</span>
								</div>

								<p className="font-inter text-[12px] text-foreground-tertiary">
									Em andamento · normalmente ~6h
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<Circle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-border" />

							<div className="flex flex-1 flex-col gap-0.5">
								<p className="font-inter font-medium text-[13px] text-foreground-tertiary">
									Painel liberado
								</p>

								<p className="font-inter text-[12px] text-foreground-tertiary">
									Você receberá um aviso por e-mail.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Enquanto isso
					</span>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
							<BookOpen className="h-5 w-5 text-foreground-primary" />

							<div className="flex flex-col gap-1">
								<p className="font-inter font-semibold text-[14px] text-foreground-primary">
									Manual do parceiro
								</p>

								<p className="font-inter text-[12px] text-foreground-secondary">
									15 min de leitura para tirar mais dos primeiros pedidos.
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
							<Smartphone className="h-5 w-5 text-foreground-primary" />

							<div className="flex flex-col gap-1">
								<p className="font-inter font-semibold text-[14px] text-foreground-primary">
									Baixe o app
								</p>
								<p className="font-inter text-[12px] text-foreground-secondary">
									Receba pedidos no celular assim que abrirmos sua conta.
								</p>
							</div>
						</div>
					</div>
				</div>

				<Button className="w-full gap-2">
					<MessageCircle className="h-4 w-4" />
					Falar com nosso time no WhatsApp
				</Button>
			</div>
		</Card>
	);
}
