import type { AccountTypeValue, PlatformProfileValue } from "@/lib/platform-roles.js";

export interface JwtPayload {
	sub: string;
	profileType: PlatformProfileValue;
	accountType: AccountTypeValue;
}
