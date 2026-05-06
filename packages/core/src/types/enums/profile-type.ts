export const PROFILE_TYPE = {
	ADMIN: "ADMIN",
	CLIENT: "CLIENT",
	PLATFORM_DEVELOPER: "PLATFORM_DEVELOPER",
} as const;

export type ProfileType = (typeof PROFILE_TYPE)[keyof typeof PROFILE_TYPE];
