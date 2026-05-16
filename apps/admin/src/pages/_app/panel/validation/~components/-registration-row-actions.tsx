import {
	COMPANY_APPROVAL_STATUS,
	type CompanyApprovalStatus,
} from "@repo/core/types/enums/company-approval-status";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Check, X } from "lucide-react";

interface RegistrationRowActionsProps {
	approvalStatus: CompanyApprovalStatus;
	companyId: string;
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
}

export function RegistrationRowActions({
	approvalStatus,
	companyId,
	onApprove,
	onReject,
}: RegistrationRowActionsProps) {
	const isPending = approvalStatus === COMPANY_APPROVAL_STATUS.PENDING;

	return (
		<div className="flex items-center gap-2">
			<Button
				className="h-8 gap-1.5 px-3 text-xs"
				disabled={!isPending}
				onClick={() => onApprove(companyId)}
				size="sm"
				variant="secondary"
			>
				<Check className="h-3 w-3 text-success" />
				Aprovar
			</Button>
			<Button
				className="h-8 gap-1.5 px-3 text-xs"
				disabled={!isPending}
				onClick={() => onReject(companyId)}
				size="sm"
				variant="secondary"
			>
				<X className="h-3 w-3 text-danger" />
				Recusar
			</Button>
		</div>
	);
}
