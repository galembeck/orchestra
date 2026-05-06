import { Building2, type LucideIcon, User } from "lucide-react";

export const ACCOUNT_TYPE = {
	CLIENT: "CLIENT",
	COMPANY: "COMPANY",
} as const;

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

export interface AccountTypeProps {
	icon: LucideIcon;
	label: string;
	value: AccountType;
}

export const ACCOUNT_TYPE_DETAILS: Record<AccountType, AccountTypeProps> = {
	[ACCOUNT_TYPE.CLIENT]: {
		value: ACCOUNT_TYPE.CLIENT,
		label: "Cliente",
		icon: User,
	},
	[ACCOUNT_TYPE.COMPANY]: {
		value: ACCOUNT_TYPE.COMPANY,
		label: "Empresa",
		icon: Building2,
	},
};

export const ACCOUNT_TYPE_OPTIONS = Object.values(ACCOUNT_TYPE_DETAILS);
