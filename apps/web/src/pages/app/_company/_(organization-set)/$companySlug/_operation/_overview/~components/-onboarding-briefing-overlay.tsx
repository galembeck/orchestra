import { dashboardData } from "@/constants/_app/company/dashboard-sidebar";
import { X } from "lucide-react";
import { useState } from "react";

const BRIEFING_STORAGE_KEY = (companyId: string) =>
	`orchestra_briefing_done_${companyId}`;

export function isBriefingComplete(companyId: string): boolean {
	try {
		return localStorage.getItem(BRIEFING_STORAGE_KEY(companyId)) === "true";
	} catch {
		return false;
	}
}

export function markBriefingComplete(companyId: string): void {
	try {
		localStorage.setItem(BRIEFING_STORAGE_KEY(companyId), "true");
	} catch {
		// localStorage unavailable
	}
}

const allNavItems = [
	...dashboardData.primary,
	...dashboardData.business,
].filter((item) => item.description);

interface OnboardingBriefingOverlayProps {
	companyId: string;
	onComplete: () => void;
}

export function OnboardingBriefingOverlay({
	companyId,
	onComplete,
}: OnboardingBriefingOverlayProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const currentItem = allNavItems[currentIndex];
	const isFirst = currentIndex === 0;
	const isLast = currentIndex === allNavItems.length - 1;
	const Icon = currentItem?.icon;

	const handleNext = () => {
		if (isLast) {
			markBriefingComplete(companyId);
			onComplete();
		} else {
			setCurrentIndex((i) => i + 1);
		}
	};

	const handlePrev = () => {
		if (!isFirst) setCurrentIndex((i) => i - 1);
	};

	const handleSkip = () => {
		markBriefingComplete(companyId);
		onComplete();
	};

	if (!currentItem) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
				aria-hidden="true"
			/>

			{/* Overlay card */}
			<div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm sm:left-auto sm:right-6 sm:bottom-6 sm:mx-0 sm:max-w-[360px]">
				<div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-xl">
					{/* Header */}
					<div className="flex items-start justify-between gap-3">
						<div className="flex flex-col gap-0.5">
							<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
								Briefing do painel · {currentIndex + 1} de {allNavItems.length}
							</span>
							<h3 className="font-instrument-serif text-[22px] text-foreground-primary leading-tight -tracking-[0.4px]">
								{currentItem.title}
							</h3>
						</div>

						{Icon && (
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground-primary/8">
								<Icon className="h-4.5 w-4.5 text-foreground-primary" />
							</div>
						)}
					</div>

					{/* Progress bar */}
					<div className="h-1 w-full overflow-hidden rounded-full bg-border">
						<div
							className="h-full rounded-full bg-foreground-primary transition-all duration-300"
							style={{
								width: `${((currentIndex + 1) / allNavItems.length) * 100}%`,
							}}
						/>
					</div>

					{/* Description */}
					<p className="font-inter text-[14px] text-foreground-secondary leading-relaxed">
						{currentItem.description}
					</p>

					{/* Actions */}
					<div className="flex items-center gap-2">
						{!isFirst && (
							<button
								type="button"
								onClick={handlePrev}
								className="flex h-9 items-center justify-center rounded-md border border-border px-3 font-inter text-[13px] text-foreground-secondary transition-colors hover:bg-surface-hover"
							>
								Anterior
							</button>
						)}

						<button
							type="button"
							onClick={handleNext}
							className="flex h-9 flex-1 items-center justify-center rounded-md bg-foreground-primary px-4 font-inter font-medium text-[13px] text-background transition-opacity hover:opacity-90"
						>
							{isLast ? "Concluir briefing" : "Próximo"}
						</button>

						<button
							type="button"
							onClick={handleSkip}
							aria-label="Pular briefing"
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground-tertiary transition-colors hover:bg-surface-hover"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
