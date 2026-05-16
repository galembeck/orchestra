import type { CompanyRegistrationDetail } from "@repo/core/types/company-registration";
import { COMPANY_APPROVAL_STATUS } from "@repo/core/types/enums/company-approval-status";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { Clock } from "lucide-react";

function formatDateTime(dateString: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(dateString));
}

interface TimelineRowProps {
	label: string;
	value: string | null;
}

function TimelineRow({ label, value }: TimelineRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 border-border border-b py-3 last:border-0 last:pb-0">
			<span className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.2px]">
				{label}
			</span>
			<span className="font-inter text-foreground-primary text-sm">
				{value ?? "—"}
			</span>
		</div>
	);
}

interface CompanyTimelineCardProps {
	company: CompanyRegistrationDetail;
}

export function CompanyTimelineCard({ company }: CompanyTimelineCardProps) {
	const isApproved =
		company.approvalStatus === COMPANY_APPROVAL_STATUS.APPROVED;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Clock className="h-4 w-4 text-foreground-tertiary" />
					<CardTitle>Histórico de datas</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<TimelineRow
					label="Cadastrado em"
					value={formatDateTime(company.createdAt)}
				/>
				<TimelineRow
					label="Atualizado em"
					value={formatDateTime(company.updatedAt)}
				/>
				{isApproved && (
					<TimelineRow
						label="Aprovado em"
						value={
							company.approvedAt ? formatDateTime(company.approvedAt) : null
						}
					/>
				)}
			</CardContent>
		</Card>
	);
}
