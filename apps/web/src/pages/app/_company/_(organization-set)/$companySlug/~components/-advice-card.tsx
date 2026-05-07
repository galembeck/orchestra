import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function AdviceCard() {
	return (
		<div className="flex w-full items-center justify-between rounded-[10px] border border-border bg-surface-paper-soft px-4 py-3">
			<article className="flex items-center gap-3.5">
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1f7a3d26]">
					<Sparkles className="h-3.5 w-3.5 text-success" />
				</div>

				<p className="font-inter font-medium text-[13px] text-foreground-primary">
					Você está acima da meta semanal - abril já é seu melhor mês de 2025.
				</p>
			</article>

			<Link
				className="flex items-center gap-2 font-jetbrains-mono font-semibold text-foreground-primary text-xs hover:underline hover:underline-offset-2"
				to="/"
			>
				Ver detalhes <ArrowRight className="h-3 w-3" />
			</Link>
		</div>
	);
}
