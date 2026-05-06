export const SECURITY_INFO_MOMENT = {
	REGISTER: 1,
	LOGIN: 2,
} as const;

export type SecurityInfoMoment =
	(typeof SECURITY_INFO_MOMENT)[keyof typeof SECURITY_INFO_MOMENT];
