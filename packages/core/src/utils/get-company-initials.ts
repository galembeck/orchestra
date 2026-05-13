const WHITESPACE_REGEX = /\s+/;

export const getCompanyInitials = (fantasyName?: string): string => {
	const cleanName = fantasyName?.trim();

	if (!cleanName) {
		return "??";
	}

	const parts = cleanName.split(WHITESPACE_REGEX).filter(Boolean);
	const firstInitial = parts[0]?.charAt(0) ?? "";
	const secondInitial = parts[1]?.charAt(0) ?? "";

	const initials = `${firstInitial}${secondInitial}`.toUpperCase();
	return initials || cleanName.slice(0, 2).toUpperCase();
};
