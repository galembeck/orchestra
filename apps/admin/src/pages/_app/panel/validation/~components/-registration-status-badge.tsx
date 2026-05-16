import {
	COMPANY_APPROVAL_STATUS,
	type CompanyApprovalStatus,
} from "@repo/core/types/enums/company-approval-status";
import { Badge } from "@repo/ui/components/atoms/badge/badge";

const STATUS_CONFIG = {
	[COMPANY_APPROVAL_STATUS.PENDING]: {
		label: "Pendente",
		variant: "warning" as const,
	},
	[COMPANY_APPROVAL_STATUS.APPROVED]: {
		label: "Aprovado",
		variant: "success" as const,
	},
	[COMPANY_APPROVAL_STATUS.REJECTED]: {
		label: "Recusado",
		variant: "danger" as const,
	},
};

interface RegistrationStatusBadgeProps {
	status: CompanyApprovalStatus;
}

export function RegistrationStatusBadge({
	status,
}: RegistrationStatusBadgeProps) {
	const config = STATUS_CONFIG[status];
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
