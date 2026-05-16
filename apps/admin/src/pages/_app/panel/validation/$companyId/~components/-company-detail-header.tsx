import type { CompanyRegistrationDetail } from "@repo/core/types/company-registration";
import { COMPANY_APPROVAL_STATUS } from "@repo/core/types/enums/company-approval-status";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { RegistrationStatusBadge } from "../../~components/-registration-status-badge";

interface CompanyDetailHeaderProps {
	company: CompanyRegistrationDetail;
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
}

export function CompanyDetailHeader({
	company,
	onApprove,
	onReject,
}: CompanyDetailHeaderProps) {
	const isPending = company.approvalStatus === COMPANY_APPROVAL_STATUS.PENDING;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
				<Link
					className="flex items-center gap-1.5 font-inter text-foreground-tertiary text-xs transition-colors hover:text-foreground-primary"
					to="/panel/validation"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Voltar para validação
				</Link>

				<div className="flex items-center gap-4">
					{isPending ? (
						<div className="flex items-center gap-2">
							<Button
								className="h-9 gap-1.5 px-4 text-xs"
								onClick={() => onApprove(company.id)}
								size="sm"
								variant="secondary"
							>
								<Check className="h-3.5 w-3.5 text-success" />
								Aprovar cadastro
							</Button>
							<Button
								className="h-9 gap-1.5 px-4 text-xs"
								onClick={() => onReject(company.id)}
								size="sm"
								variant="secondary"
							>
								<X className="h-3.5 w-3.5 text-danger" />
								Recusar cadastro
							</Button>
						</div>
					) : (
						<RegistrationStatusBadge status={company.approvalStatus} />
					)}
				</div>
			</div>
		</div>
	);
}
