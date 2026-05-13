import type { PublicCompanyDTO } from "@repo/core/models/company.model";
import {
	Card,
	CardContent,
	CardHeader,
} from "@repo/ui/components/molecules/card/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clipboard, Search, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";
import {
	isBriefingComplete,
	markBriefingComplete,
	OnboardingBriefingOverlay,
} from "./-onboarding-briefing-overlay";

function isConfigurationComplete(company: PublicCompanyDTO): boolean {
	return !!(
		company.openingHour &&
		company.closingHour &&
		company.teamSize &&
		company.serviceRadius &&
		company.serviceTypes &&
		company.serviceTypes.length > 0 &&
		company.schedule
	);
}

type StepStatus = "done" | "current" | "pending";

interface Step {
	icon: typeof Search;
	label: string;
	status: StepStatus;
}

interface OnboardingCardProps {
	company: PublicCompanyDTO;
}

export function OnboardingCard({ company }: OnboardingCardProps) {
	const navigate = useNavigate();

	const [briefingDone, setBriefingDone] = useState(() =>
		isBriefingComplete(company.id)
	);
	const [showBriefing, setShowBriefing] = useState(false);

	const configDone = isConfigurationComplete(company);
	const allDone = briefingDone && configDone;

	const handleBriefingComplete = useCallback(() => {
		markBriefingComplete(company.id);
		setBriefingDone(true);
		setShowBriefing(false);
	}, [company.id]);

	const getStepStatuses = (): [StepStatus, StepStatus, StepStatus] => {
		if (!briefingDone) {
			return ["current", "pending", "pending"];
		}

		if (!configDone) {
			return ["done", "current", "pending"];
		}

		return ["done", "done", "done"];
	};

	const [s1, s2, s3] = getStepStatuses();

	const steps: Step[] = [
		{ icon: Clipboard, label: "Briefing", status: s1 },
		{ icon: Search, label: "Configuração", status: s2 },
		{ icon: ShieldCheck, label: "Painel ativo", status: s3 },
	];

	const handleContinue = () => {
		if (!briefingDone) {
			setShowBriefing(true);
			return;
		}

		navigate({
			to: "/app/$companySlug/configuration",
			params: { companySlug: company.slug },
		});
	};

	if (allDone) {
		return null;
	}

	return (
		<>
			{showBriefing && (
				<OnboardingBriefingOverlay
					companyId={company.id}
					onComplete={handleBriefingComplete}
				/>
			)}

			<Card className="flex flex-col gap-6 bg-surface-navy">
				<CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-col gap-1.5">
						<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse-muted uppercase tracking-[1.5px]">
							Configuração inicial
						</span>
						<h2 className="font-instrument-serif text-2xl text-foreground-inverse leading-tight">
							{allDone
								? "Sua loja está ativa na vitrine!"
								: "Você está a 3 passos de ativar sua loja na vitrine."}
						</h2>
					</div>

					<button
						className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-surface px-4 py-2.5 font-inter font-semibold text-foreground-primary text-sm transition-opacity hover:opacity-90 lg:w-fit dark:bg-surface-navy-2"
						onClick={handleContinue}
						type="button"
					>
						{briefingDone ? "Continuar configuração" : "Iniciar briefing"}
						<ArrowRight className="h-3.5 w-3.5" />
					</button>
				</CardHeader>

				<CardContent>
					<div className="flex flex-1 flex-col gap-5">
						<ol className="flex items-center gap-4">
							{steps.map((step, i) => {
								const Icon = step.icon;
								const done = step.status === "done";
								const current = step.status === "current";

								return (
									<li
										className="flex flex-1 items-center gap-3 last:flex-none"
										key={step.label}
									>
										<div
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
												done
													? "border-success bg-success/20 text-foreground-inverse"
													: // biome-ignore lint/style/noNestedTernary: not important is this context
														current
														? "border-border bg-foreground-inverse-muted text-foreground-primary"
														: "border-border/30 bg-foreground-inverse-muted"
											}`}
										>
											<Icon className="h-4 w-4" />
										</div>

										<div className="flex flex-col">
											<span className="font-jetbrains-mono text-[10px] text-foreground-inverse-muted uppercase tracking-wider">
												Etapa {i + 1}
											</span>
											<span className="font-inter font-medium text-[13px] text-foreground-inverse">
												{step.label}
											</span>
										</div>

										{i < steps.length - 1 && (
											<div className="ml-auto hidden h-px flex-1 bg-background/20 lg:block" />
										)}
									</li>
								);
							})}
						</ol>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
