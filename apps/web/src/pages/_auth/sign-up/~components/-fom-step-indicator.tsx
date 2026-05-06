import {
	ACCOUNT_TYPE,
	type AccountType,
} from "@repo/core/types/enums/account-type";
import { Check } from "lucide-react";
import { CLIENT_STEPS, COMPANY_STEPS } from "@/constants/_auth/form-steps";

interface FormStepIndicatorProps {
	accountType?: AccountType;
	currentStep: number;
}

export function FormStepIndicator({
	currentStep,
	accountType,
}: FormStepIndicatorProps) {
	const activeSteps =
		accountType === ACCOUNT_TYPE.CLIENT ? CLIENT_STEPS : COMPANY_STEPS;

	return (
		<div className="mx-auto flex w-full items-start justify-center">
			{activeSteps.map((label, index) => {
				const stepNum = index + 1;
				const completed = stepNum < currentStep;
				const active = stepNum === currentStep;
				const isLast = index === activeSteps.length - 1;

				let circleClass = "border border-border text-foreground-tertiary";

				if (completed) {
					circleClass = "bg-success";
				}

				if (active) {
					circleClass = "bg-foreground-primary text-surface";
				}

				return (
					<div
						className={`flex items-start ${isLast ? "" : "flex-1 transition-all duration-300"}`}
						key={label}
					>
						<div className="flex w-16 flex-col items-center gap-1.5">
							<div
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-jetbrains-mono font-medium text-[11px] transition-colors duration-300 ${circleClass}`}
							>
								{completed ? (
									<Check className="h-3 w-3 text-foreground-inverse" />
								) : (
									stepNum
								)}
							</div>

							<span
								className={`whitespace-nowrap font-jetbrains-mono font-medium text-[10px] uppercase tracking-[1.5px] transition-colors duration-300 ${
									active
										? "text-foreground-primary"
										: "text-foreground-tertiary"
								}`}
							>
								{label}
							</span>
						</div>

						{!isLast && (
							<div
								className={`mt-3 h-px flex-1 transition-colors duration-300 ${
									completed ? "bg-foreground-primary" : "bg-border"
								}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
