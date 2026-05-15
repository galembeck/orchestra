// Central registry of platform-level roles.
// ProfileType controls API access level (platform-wide guards).
// AccountType identifies what kind of user account it is.
//
// To add a role:
//   1. Add the new value to the const below
//   2. Extend the corresponding pgEnum in src/db/schema/users.ts
//   3. Run: pnpm --filter @orchestra/api db:generate && db:migrate

export const PlatformProfile = {
	Admin: "ADMIN",
	Client: "CLIENT",
	PlatformDeveloper: "PLATFORM_DEVELOPER",
} as const;

export type PlatformProfileValue =
	(typeof PlatformProfile)[keyof typeof PlatformProfile];

export const AccountType = {
	Client: "CLIENT",
	Worker: "WORKER",
	CompanyOwner: "COMPANY",
} as const;

export type AccountTypeValue =
	(typeof AccountType)[keyof typeof AccountType];
