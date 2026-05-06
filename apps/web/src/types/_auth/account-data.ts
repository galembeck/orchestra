import type { AccountType } from "@repo/core/types/enums/account-type";

export interface AccountData {
	acceptTerms: boolean;
	accountType: AccountType;
	cellphone: string;
	confirmPassword: string;
	document: string;
	email: string;
	name: string;
	password: string;
}
