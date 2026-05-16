import { Briefcase, type LucideIcon, Shield, User } from "lucide-react";

export const ACCOUNT_TYPE = {
	CLIENT: "CLIENT",
	WORKER: "WORKER",
	OWNER: "OWNER",
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
	[ACCOUNT_TYPE.WORKER]: {
		value: ACCOUNT_TYPE.WORKER,
		label: "Profissional",
		icon: Briefcase,
	},
	[ACCOUNT_TYPE.OWNER]: {
		value: ACCOUNT_TYPE.OWNER,
		label: "Proprietário",
		icon: Shield,
	},
};

export const ACCOUNT_TYPE_OPTIONS = Object.values(ACCOUNT_TYPE_DETAILS);
