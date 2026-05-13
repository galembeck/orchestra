import { Button } from "@repo/ui/components/atoms/button/button";
import { Card } from "@repo/ui/components/molecules/card/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface RegistrationErrorStepProps {
	errorMessage?: string;
	onRetry: () => void;
}

export function RegistrationErrorStep({
	errorMessage,
	onRetry,
}: RegistrationErrorStepProps) {
	return (
		<Card className="p-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<AlertCircle className="h-7 w-7 text-destructive" />
					</div>

					<div className="flex flex-col gap-1">
						<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Erro no cadastro
						</span>

						<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
							Algo deu errado.
						</h2>
					</div>

					<p className="max-w-[420px] font-inter text-[15px] text-foreground-secondary">
						{errorMessage ||
							"Não foi possível concluir o cadastro da sua empresa. Verifique os dados e tente novamente."}
					</p>
				</div>

				<div className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						O que fazer agora?
					</span>

					<ul className="flex flex-col gap-2">
						{[
							"Verifique se o CNPJ já está cadastrado na plataforma.",
							"Confirme se o e-mail informado não está em uso.",
							"Certifique-se de que os documentos enviados são legíveis.",
						].map((tip) => (
							<li
								key={tip}
								className="flex items-start gap-2 font-inter text-[13px] text-foreground-secondary"
							>
								<span className="mt-0.5 text-destructive">•</span>
								{tip}
							</li>
						))}
					</ul>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						className="w-full gap-2"
						variant="outline"
						onClick={onRetry}
					>
						<ArrowLeft className="h-4 w-4" />
						Voltar e corrigir
					</Button>

					<Button className="w-full gap-2" onClick={onRetry}>
						<RefreshCw className="h-4 w-4" />
						Tentar novamente
					</Button>
				</div>
			</div>
		</Card>
	);
}
